import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      storageKey: "murphy-al-saham-auth",
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storage: {
        getItem: (key) => {
          if (typeof window === "undefined") return null;
          const item = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${key}=`));
          return item ? item.split("=")[1] : null;
        },
        setItem: (key, value) => {
          if (typeof window === "undefined") return;
          // Set cookie with 1 hour expiry
          document.cookie = `${key}=${value};path=/;max-age=3600;SameSite=Strict`;
        },
        removeItem: (key) => {
          if (typeof window === "undefined") return;
          document.cookie = `${key}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        },
      },
    },
  }
);
