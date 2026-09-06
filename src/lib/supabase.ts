// src/lib/supabase.ts
// Mediverse Life Sciences - Production Supabase Client with graceful mock fallback

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://mock-mediverse.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "mock-anon-key";

export const isSupabaseConfigured = Boolean(
  (import.meta as any).env?.VITE_SUPABASE_URL && 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY &&
  (import.meta as any).env?.VITE_SUPABASE_URL !== "https://mock-mediverse.supabase.co"
);

class MediverseApiClient {

  private url: string;
  private key: string;

  constructor(url: string, key: string) {
    this.url = url;
    this.key = key;
  }

  // REST PostgREST generic caller with RLS Auth headers
  async query<T>(
    endpoint: string, 
    options: { method?: string; body?: any; token?: string } = {}
  ): Promise<{ data: T | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { data: null, error: "Supabase credentials not configured. Using local state." };
    }

    try {
      const headers: Record<string, string> = {
        "apikey": this.key,
        "Content-Type": "application/json",
      };

      if (options.token) {
        headers["Authorization"] = `Bearer ${options.token}`;
      }

      const res = await fetch(`${this.url}/rest/v1/${endpoint}`, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!res.ok) {
        const errText = await res.text();
        return { data: null, error: errText };
      }

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  }

  // Edge Function Caller
  async invokeFunction<T>(functionName: string, payload: any): Promise<{ data: T | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { data: null, error: "Mock mode: edge function simulation active." };
    }

    try {
      const res = await fetch(`${this.url}/functions/v1/${functionName}`, {
        method: "POST",
        headers: {
          "apikey": this.key,
          "Authorization": `Bearer ${this.key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  }
}

export const supabaseClient = new MediverseApiClient(SUPABASE_URL, SUPABASE_ANON_KEY);

