// backend/supabase/functions/run-matching/index.ts
// Phase 1 Algorithmic Matching Execution Function with Phase 2 Vector Upgrade Path

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
    const { monthKey, phase = "phase1" } = await req.json();
    const targetMonth = monthKey || new Date().toISOString().slice(0, 7);

    const supabase = getSupabaseAdmin();

    if (phase === "phase1") {
      // Execute database procedure for deterministic rule-based matching
      const { data, error } = await supabase.rpc("generate_monthly_matches", {
        p_month_key: targetMonth,
      });

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          phase: "phase1-rule-based",
          monthKey: targetMonth,
          matchesGenerated: data,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Phase 2: Vector embedding cosine similarity + LLM reason generator
      // Fetch users with pgvector embeddings
      const { data: usersWithEmbeddings, error } = await supabase
        .from("profiles")
        .select("id, role, embedding, consent_matching")
        .eq("consent_matching", true)
        .is("deleted_at", null)
        .not("embedding", "is", null);

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          phase: "phase2-vector",
          eligibleVectorUsers: usersWithEmbeddings?.length || 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
