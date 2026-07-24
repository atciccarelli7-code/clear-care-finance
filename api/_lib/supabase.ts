import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { bearerToken, type ApiRequest } from "./http.js";
import { getPremiumConfig } from "./premiumConfig.js";

let adminClient: SupabaseClient | null = null;
let authClient: SupabaseClient | null = null;

export class ConfigurationUnavailableError extends Error {}
export class UnauthorizedError extends Error {}

export const getSupabaseAdmin = () => {
  const config = getPremiumConfig();
  if (!config.supabase.configured) throw new ConfigurationUnavailableError("Supabase unavailable");
  if (!adminClient) {
    adminClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return adminClient;
};

const getSupabaseAuthClient = () => {
  const config = getPremiumConfig();
  if (!config.supabase.url || !config.supabase.anonKey) throw new ConfigurationUnavailableError("Authentication unavailable");
  if (!authClient) {
    authClient = createClient(config.supabase.url, config.supabase.anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return authClient;
};

export const requireAuthenticatedUser = async (req: ApiRequest): Promise<User> => {
  const config = getPremiumConfig();
  if (!config.flags.authentication || !config.supabase.configured) throw new ConfigurationUnavailableError("Authentication unavailable");
  const token = bearerToken(req);
  if (!token) throw new UnauthorizedError("Authentication required");
  const { data, error } = await getSupabaseAuthClient().auth.getUser(token);
  if (error || !data.user) throw new UnauthorizedError("Authentication required");
  return data.user;
};
