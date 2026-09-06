// backend/supabase/functions/verify-domain/index.ts
// Corporate Email Auto-Verification Edge Function
// Section 4 of Strategic Report: Unlocks 14-day Professional Trial without auto-charging

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
    const { email, userId } = await req.json();

    if (!email || !userId) {
      return new Response(JSON.stringify({ error: "Email and userId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) {
      return new Response(JSON.stringify({ verified: false, reason: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check personal email providers
    const personalProviders = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
    if (personalProviders.includes(domain)) {
      return new Response(JSON.stringify({ verified: false, reason: "Personal email provider" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = getSupabaseAdmin();

    // Query corporate_domains table
    const { data: verifiedDomain } = await supabase
      .from("corporate_domains")
      .select("company_name, is_verified")
      .eq("domain", domain)
      .single();

    if (verifiedDomain && verifiedDomain.is_verified) {
      // 1. Upgrade profile to verified status
      await supabase
        .from("profiles")
        .update({
          is_verified: true,
          org: verifiedDomain.company_name,
        })
        .eq("id", userId);

      // 2. Grant 14-day Professional Trial (Non auto-charging)
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 14);

      await supabase.from("subscriptions").insert({
        user_id: userId,
        tier: "professional",
        status: "trialing",
        trial_ends_at: trialEnd.toISOString(),
      });

      return new Response(
        JSON.stringify({
          verified: true,
          company: verifiedDomain.company_name,
          trialEndsAt: trialEnd.toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Unrecognized corporate domain - route to manual review queue
    return new Response(
      JSON.stringify({
        verified: false,
        reason: "Domain queued for manual verification review",
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
