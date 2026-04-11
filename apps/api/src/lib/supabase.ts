import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Env } from "./env.js";

export type AuthenticatedUser = {
  id: string;
  email: string | null;
};

type BootstrapResult = {
  accountId: string;
};

export interface AuthRepository {
  validateAccessToken: (token: string) => Promise<AuthenticatedUser | null>;
  bootstrapPersonalAccount: (user: AuthenticatedUser) => Promise<BootstrapResult>;
}

function buildPersonalAccountName(user: AuthenticatedUser): string {
  if (user.email) {
    const handle = user.email.split("@")[0] ?? "user";
    return `${handle} Personal`;
  }
  return "Personal Account";
}

function createSupabaseClient(
  url: string,
  key: string,
): SupabaseClient {
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createServiceRoleClient(env: Env): SupabaseClient {
  return createSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createAnonClient(env: Env): SupabaseClient {
  return createSupabaseClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}

export function createSupabaseAuthRepository(env: Env): AuthRepository {
  const anonClient = createAnonClient(env);
  const serviceClient = createServiceRoleClient(env);

  return {
    async validateAccessToken(token) {
      const { data, error } = await anonClient.auth.getUser(token);
      if (error || !data.user) {
        return null;
      }
      return {
        id: data.user.id,
        email: data.user.email ?? null,
      };
    },

    async bootstrapPersonalAccount(user) {
      const { error: profileError } = await serviceClient
        .from("profiles")
        .upsert(
          {
            id: user.id,
            email: user.email,
          },
          { onConflict: "id" },
        );
      if (profileError) {
        throw profileError;
      }

      let accountId: string | null = null;

      const { data: existingAccount, error: existingAccountError } = await serviceClient
        .from("accounts")
        .select("id")
        .eq("bootstrap_creator_profile_id", user.id)
        .eq("account_type", "personal")
        .maybeSingle();
      if (existingAccountError) {
        throw existingAccountError;
      }
      if (existingAccount && "id" in existingAccount) {
        accountId = existingAccount.id;
      }

      if (!accountId) {
        const { data: createdAccount, error: accountError } = await serviceClient
          .from("accounts")
          .insert({
            account_type: "personal",
            bootstrap_creator_profile_id: user.id,
            name: buildPersonalAccountName(user),
          })
          .select("id")
          .single();
        if (accountError) {
          throw accountError;
        }
        accountId = createdAccount.id;
      }

      if (!accountId) {
        throw new Error("Failed to bootstrap personal account");
      }

      const { error: membershipError } = await serviceClient
        .from("account_memberships")
        .upsert(
          {
            account_id: accountId,
            profile_id: user.id,
            role: "owner",
          },
          { onConflict: "account_id,profile_id" },
        );
      if (membershipError) {
        throw membershipError;
      }

      return { accountId };
    },
  };
}
