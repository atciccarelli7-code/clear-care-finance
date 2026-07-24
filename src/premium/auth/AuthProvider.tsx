import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

type AuthStatus = "loading" | "signed_out" | "signed_in" | "unavailable";

type PremiumAuthContextValue = {
  status: AuthStatus;
  accessToken?: string;
  email?: string;
  userId?: string;
  isDevelopmentDemo: boolean;
  message?: string;
  requestMagicLink: (email: string) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
};

const PremiumAuthContext = createContext<PremiumAuthContextValue | null>(null);

const getConfig = () => {
  const url = import.meta.env.VITE_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const enabled = import.meta.env.VITE_PREMIUM_AUTH_ENABLED === "true";
  const developmentDemo =
    import.meta.env.DEV &&
    !import.meta.env.PROD &&
    import.meta.env.VITE_PREMIUM_DEV_MOCK_AUTH === "true";
  return { url, anonKey, enabled, developmentDemo, configured: Boolean(enabled && url && anonKey) };
};

let browserClientPromise: Promise<SupabaseClient> | null = null;

const getBrowserClient = async () => {
  const config = getConfig();
  if (!config.configured) return null;
  if (!browserClientPromise) {
    browserClientPromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(config.url!, config.anonKey!, {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true,
          flowType: "pkce",
        },
      }),
    );
  }
  return browserClientPromise;
};

export const PremiumAuthProvider = ({ children }: { children: ReactNode }) => {
  const config = useMemo(getConfig, []);
  const [value, setValue] = useState<Omit<PremiumAuthContextValue, "requestMagicLink" | "signOut">>({
    status: "loading",
    isDevelopmentDemo: config.developmentDemo,
  });

  useEffect(() => {
    if (config.developmentDemo) {
      setValue({
        status: "signed_in",
        accessToken: "development-demo-token",
        email: "local-demo@example.invalid",
        userId: "00000000-0000-4000-8000-000000000001",
        isDevelopmentDemo: true,
        message: "Development-only demo. No real account, entitlement, payment, or cloud persistence is active.",
      });
      return undefined;
    }

    let mounted = true;
    let unsubscribe: (() => void) | undefined;
    void getBrowserClient().then(async (client) => {
      if (!mounted) return;
      if (!client) {
        setValue({
          status: "unavailable",
          isDevelopmentDemo: false,
          message: "Account access is not yet available. Public resources remain available while secure authentication is configured.",
        });
        return;
      }
      const { data, error } = await client.auth.getSession();
      if (!mounted) return;
      const session = data.session;
      setValue(
        error
          ? { status: "unavailable", isDevelopmentDemo: false, message: "The account service is temporarily unavailable." }
          : session
            ? {
                status: "signed_in",
                accessToken: session.access_token,
                email: session.user.email,
                userId: session.user.id,
                isDevelopmentDemo: false,
              }
            : { status: "signed_out", isDevelopmentDemo: false },
      );

      const authChange = client.auth.onAuthStateChange((_event, nextSession) => {
        if (!mounted) return;
        setValue(
          nextSession
            ? {
                status: "signed_in",
                accessToken: nextSession.access_token,
                email: nextSession.user.email,
                userId: nextSession.user.id,
                isDevelopmentDemo: false,
              }
            : { status: "signed_out", isDevelopmentDemo: false },
        );
      });
      unsubscribe = () => authChange.data.subscription.unsubscribe();
    }).catch(() => {
      if (mounted) setValue({ status: "unavailable", isDevelopmentDemo: false, message: "The account service is temporarily unavailable." });
    });

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, [config.developmentDemo]);

  const requestMagicLink = useCallback(async (email: string) => {
    const client = await getBrowserClient();
    if (!client) return { ok: false, message: "Account access is not yet available." };
    const redirectTo = `${window.location.origin}/app/benefits-decision`;
    const { error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
    });
    return error
      ? { ok: false, message: "The sign-in link could not be sent. Please try again later." }
      : { ok: true, message: "Check your email for a secure sign-in link." };
  }, []);

  const signOut = useCallback(async () => {
    if (config.developmentDemo) return;
    const client = await getBrowserClient();
    await client?.auth.signOut();
  }, [config.developmentDemo]);

  return (
    <PremiumAuthContext.Provider value={{ ...value, requestMagicLink, signOut }}>
      {children}
    </PremiumAuthContext.Provider>
  );
};

export const usePremiumAuth = () => {
  const value = useContext(PremiumAuthContext);
  if (!value) throw new Error("usePremiumAuth must be used within PremiumAuthProvider");
  return value;
};
