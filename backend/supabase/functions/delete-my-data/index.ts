// backend/supabase/functions/delete-my-data/index.ts
// India DPDP Act 2023 Compliant "Right to Erasure" Data Erasure Edge Function

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getSupabaseAdmin } from "../_shared/supabase-client.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, reason } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = getSupabaseAdmin();

    // 1. Soft delete profile & wipe sensitive PII immediately (DPDP mandate)
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        deleted_at: new Date().toISOString(),
        bio: "[REDACTED - DPDP RIGHT TO ERASURE]",
        location: null,
        notify_matches: false,
        consent_matching: false,
      })
      .eq("id", userId);

    if (profileError) throw profileError;

    // 2. Remove from active matching network
    await supabase.from("user_tags").delete().eq("user_id", userId);

    // 3. Mark all pending matches as expired
    await supabase
      .from("matches")
      .update({ status: "expired" })
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);

    // 4. Cancel any active subscriptions
    await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    return new Response(
      JSON.stringify({
        success: true,
        erasureStatus: "COMPLETED",
        act: "India DPDP Act 2023 Compliant",
        coolingOffPeriodDays: 30,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
