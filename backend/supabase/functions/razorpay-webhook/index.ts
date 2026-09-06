// backend/supabase/functions/razorpay-webhook/index.ts
// Razorpay Subscription Lifecycle & Dunning Webhook Handler

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getSupabaseAdmin } from "../_shared/supabase-client.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const event = body.event;
    const payload = body.payload;

    const supabase = getSupabaseAdmin();

    switch (event) {
      case "subscription.activated":
      case "subscription.charged": {
        const subData = payload.subscription.entity;
        const customerId = subData.customer_id;
        const subId = subData.id;

        // Update database subscription record to active
        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            current_period_start: new Date(subData.current_start * 1000).toISOString(),
            current_period_end: new Date(subData.current_end * 1000).toISOString(),
            tier: "professional",
          })
          .eq("razorpay_subscription_id", subId);

        // Update user tier
        const { data: subRecord } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("razorpay_subscription_id", subId)
          .single();

        if (subRecord) {
          await supabase
            .from("profiles")
            .update({ tier: "professional" })
            .eq("id", subRecord.user_id);
        }
        break;
      }

      case "subscription.cancelled": {
        const subId = payload.subscription.entity.id;
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
          .eq("razorpay_subscription_id", subId);

        const { data: subRecord } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("razorpay_subscription_id", subId)
          .single();

        if (subRecord) {
          // Downgrade back to Free tier
          await supabase
            .from("profiles")
            .update({ tier: "free" })
            .eq("id", subRecord.user_id);
        }
        break;
      }

      case "payment.failed": {
        const subId = payload.payment.entity.subscription_id;
        if (subId) {
          await supabase
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("razorpay_subscription_id", subId);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ status: "ok", processedEvent: event }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
