// backend/supabase/functions/send-match-email/index.ts
// Monthly Drop Transactional Notification via Resend API
// Section 5 of Strategic Report: Habit Loop triggers at 9:00 AM IST on the 1st of every month

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
    const { monthName = "August" } = await req.json();
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = getSupabaseAdmin();

    // Query subscribers opted into matching notifications
    const { data: eligibleUsers, error } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("notify_matches", true)
      .eq("consent_matching", true)
      .is("deleted_at", null);

    if (error) throw error;

    let emailsSent = 0;

    // Send minimal curiosity-driven notification
    for (const user of eligibleUsers || []) {
      if (resendApiKey) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Meridian Life Sciences <editorial@meridian.news>",
            to: user.email,
            subject: `Your ${monthName} matches are ready`,
            html: `
              <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px 16px; color: #1A1A1A; background-color: #F8F6F0;">
                <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #5A6B7C;">Meridian Life Sciences</p>
                <h2 style="font-size: 24px; font-weight: 600; margin: 16px 0;">Your ${monthName} matches are ready.</h2>
                <p style="font-size: 15px; line-height: 1.6; color: #5A6B7C;">
                  Your curated monthly cohort across Pharma, MedTech, and AI-Health has been generated based on your role and topic tags.
                </p>
                <div style="margin: 28px 0;">
                  <a href="https://meridian.news/dashboard" style="display: inline-block; background-color: #1A1A1A; color: #F8F6F0; padding: 12px 24px; text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 2px;">
                    Review Your Matches &rarr;
                  </a>
                </div>
                <p style="font-size: 12px; color: #5A6B7C; border-top: 1px solid rgba(26,26,26,0.1); padding-top: 16px;">
                  You received this email because you opted into monthly match notifications on Meridian. You can manage this in Settings.
                </p>
              </div>
            `,
          }),
        });
        emailsSent++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        month: monthName,
        eligibleUsersCount: eligibleUsers?.length || 0,
        emailsDispatched: emailsSent,
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
