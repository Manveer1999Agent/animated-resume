import type {
  ImportConfidenceSummary,
  ImportJob,
  ImportJobStatus,
  ImportSectionWarning,
  PortfolioDraft,
  SectionConfidenceMap,
  SourceType,
} from "@animated-resume/contracts";
import {
  createEmptyPortfolioDraft,
  createDefaultSectionConfidenceMap,
  importJobSchema,
  portfolioDraftSchema,
  sectionConfidenceMapSchema,
} from "@animated-resume/contracts";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Env } from "./env.js";

export type AuthenticatedUser = {
  id: string;
  email: string | null;
};

type BootstrapResult = {
  accountId: string;
};

type PortfolioRow = {
  id: string;
  account_id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

type PortfolioDraftRow = {
  id: string;
  portfolio_id: string;
  schema_version: string;
  draft_payload: unknown;
  source_type: SourceType;
  source_confidence: number;
  completion_score: number;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

type PortfolioSectionStateRow = {
  draft_id: string;
  section_key: keyof SectionConfidenceMap;
  confidence_score: number;
  field_confidence: Record<string, number>;
  warnings: string[];
  verified: boolean;
  last_verified_at: string | null;
  updated_at: string;
};

type ImportJobRow = {
  id: string;
  account_id: string;
  portfolio_id: string;
  draft_id: string | null;
  source_type: SourceType;
  status: ImportJobStatus;
  confidence_summary: ImportConfidenceSummary;
  section_states: SectionConfidenceMap;
  section_warnings: ImportSectionWarning[];
  error_message: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

export type StoredDraftRecord = {
  id: string;
  portfolioId: string;
  draft: PortfolioDraft;
  createdAt: string;
  updatedAt: string;
};

export interface AuthRepository {
  validateAccessToken: (token: string) => Promise<AuthenticatedUser | null>;
  bootstrapPersonalAccount: (user: AuthenticatedUser) => Promise<BootstrapResult>;
}

export interface PortfolioDraftRepository {
  getOrCreateDraft: (accountId: string) => Promise<StoredDraftRecord>;
  saveDraft: (accountId: string, draft: PortfolioDraft) => Promise<StoredDraftRecord>;
}

export type CreateImportJobInput = {
  accountId: string;
  portfolioId: string;
  draftId: string | null;
  sourceType: SourceType;
  status: ImportJobStatus;
  confidenceSummary: ImportConfidenceSummary;
  sectionStates: SectionConfidenceMap;
  sectionWarnings: ImportSectionWarning[];
  errorMessage?: string | null;
  completedAt?: string | null;
};

export type UpdateImportJobInput = Partial<Omit<CreateImportJobInput, "accountId" | "portfolioId" | "sourceType">>;

export interface ImportJobRepository {
  createJob: (input: CreateImportJobInput) => Promise<ImportJob>;
  updateJob: (jobId: string, accountId: string, input: UpdateImportJobInput) => Promise<ImportJob>;
  getJob: (accountId: string, jobId: string) => Promise<ImportJob | null>;
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

function normalizeSectionStates(
  draftPayload: PortfolioDraft | Record<string, unknown>,
  rows: PortfolioSectionStateRow[],
): SectionConfidenceMap {
  const payloadSectionStates = typeof draftPayload === "object" && draftPayload !== null
    && "metadata" in draftPayload
    && typeof draftPayload.metadata === "object"
    && draftPayload.metadata !== null
    && "sectionStates" in draftPayload.metadata
    ? (draftPayload.metadata.sectionStates as unknown)
    : createDefaultSectionConfidenceMap();

  const baseStates = sectionConfidenceMapSchema.parse(payloadSectionStates);

  for (const row of rows) {
    baseStates[row.section_key] = {
      score: Number(row.confidence_score),
      fieldConfidence: row.field_confidence ?? {},
      warnings: row.warnings ?? [],
      verified: row.verified,
      lastVerifiedAt: row.last_verified_at,
    };
  }

  return baseStates;
}

async function ensurePortfolioForAccount(
  serviceClient: SupabaseClient,
  accountId: string,
): Promise<PortfolioRow> {
  const { data: existingPortfolio, error: existingPortfolioError } = await serviceClient
    .from("portfolios")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<PortfolioRow>();

  if (existingPortfolioError) {
    throw existingPortfolioError;
  }

  if (existingPortfolio) {
    return existingPortfolio;
  }

  const { data: createdPortfolio, error: createdPortfolioError } = await serviceClient
    .from("portfolios")
    .insert({
      account_id: accountId,
      slug: "default",
      name: "Primary Portfolio",
    })
    .select("*")
    .single<PortfolioRow>();

  if (createdPortfolioError) {
    throw createdPortfolioError;
  }

  return createdPortfolio;
}

async function fetchSectionStates(
  serviceClient: SupabaseClient,
  draftId: string,
): Promise<PortfolioSectionStateRow[]> {
  const { data, error } = await serviceClient
    .from("portfolio_section_states")
    .select("*")
    .eq("draft_id", draftId);

  if (error) {
    throw error;
  }

  return (data ?? []) as PortfolioSectionStateRow[];
}

async function hydrateStoredDraft(
  serviceClient: SupabaseClient,
  draftRow: PortfolioDraftRow,
): Promise<StoredDraftRecord> {
  const sectionStateRows = await fetchSectionStates(serviceClient, draftRow.id);
  const draftPayload = (draftRow.draft_payload ?? {}) as Record<string, unknown>;
  const sectionStates = normalizeSectionStates(draftPayload, sectionStateRows);
  const draft = portfolioDraftSchema.parse({
    ...draftPayload,
    portfolioId: draftRow.portfolio_id,
    metadata: {
      ...(typeof draftPayload.metadata === "object" && draftPayload.metadata !== null
        ? draftPayload.metadata
        : {}),
      sourceType: draftRow.source_type,
      sourceConfidence: Number(draftRow.source_confidence),
      lastVerifiedAt: draftRow.last_verified_at,
      completionScore: draftRow.completion_score,
      sectionStates,
    },
  });

  return {
    id: draftRow.id,
    portfolioId: draftRow.portfolio_id,
    draft,
    createdAt: draftRow.created_at,
    updatedAt: draftRow.updated_at,
  };
}

async function upsertSectionStates(
  serviceClient: SupabaseClient,
  draftId: string,
  sectionStates: SectionConfidenceMap,
): Promise<void> {
  const rows = Object.entries(sectionStates).map(([sectionKey, sectionState]) => ({
    draft_id: draftId,
    section_key: sectionKey,
    confidence_score: sectionState.score,
    field_confidence: sectionState.fieldConfidence,
    warnings: sectionState.warnings,
    verified: sectionState.verified,
    last_verified_at: sectionState.lastVerifiedAt,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await serviceClient
    .from("portfolio_section_states")
    .upsert(rows, { onConflict: "draft_id,section_key" });

  if (error) {
    throw error;
  }
}

function toImportJob(row: ImportJobRow): ImportJob {
  return importJobSchema.parse({
    id: row.id,
    portfolioId: row.portfolio_id,
    draftId: row.draft_id,
    sourceType: row.source_type,
    status: row.status,
    confidenceSummary: row.confidence_summary,
    sectionStates: row.section_states,
    sectionWarnings: row.section_warnings,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
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

export function createSupabaseDraftRepository(env: Env): PortfolioDraftRepository {
  const serviceClient = createServiceRoleClient(env);

  return {
    async getOrCreateDraft(accountId) {
      const portfolio = await ensurePortfolioForAccount(serviceClient, accountId);
      const { data: existingDraft, error: existingDraftError } = await serviceClient
        .from("portfolio_drafts")
        .select("*")
        .eq("portfolio_id", portfolio.id)
        .maybeSingle<PortfolioDraftRow>();

      if (existingDraftError) {
        throw existingDraftError;
      }

      if (existingDraft) {
        return hydrateStoredDraft(serviceClient, existingDraft);
      }

      const draft = createEmptyPortfolioDraft(portfolio.id);
      return this.saveDraft(accountId, draft);
    },

    async saveDraft(accountId, draft) {
      const portfolio = await ensurePortfolioForAccount(serviceClient, accountId);
      const normalizedDraft = portfolioDraftSchema.parse({
        ...draft,
        portfolioId: portfolio.id,
      });

      const { data: upsertedDraft, error: upsertError } = await serviceClient
        .from("portfolio_drafts")
        .upsert(
          {
            portfolio_id: portfolio.id,
            schema_version: normalizedDraft.schemaVersion,
            draft_payload: normalizedDraft,
            source_type: normalizedDraft.metadata.sourceType,
            source_confidence: normalizedDraft.metadata.sourceConfidence,
            completion_score: normalizedDraft.metadata.completionScore,
            last_verified_at: normalizedDraft.metadata.lastVerifiedAt,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "portfolio_id" },
        )
        .select("*")
        .single<PortfolioDraftRow>();

      if (upsertError) {
        throw upsertError;
      }

      await upsertSectionStates(serviceClient, upsertedDraft.id, normalizedDraft.metadata.sectionStates);

      return hydrateStoredDraft(serviceClient, upsertedDraft);
    },
  };
}

export function createSupabaseImportRepository(env: Env): ImportJobRepository {
  const serviceClient = createServiceRoleClient(env);

  return {
    async createJob(input) {
      const { data, error } = await serviceClient
        .from("import_jobs")
        .insert({
          account_id: input.accountId,
          portfolio_id: input.portfolioId,
          draft_id: input.draftId,
          source_type: input.sourceType,
          status: input.status,
          confidence_summary: input.confidenceSummary,
          section_states: input.sectionStates,
          section_warnings: input.sectionWarnings,
          error_message: input.errorMessage ?? null,
          completed_at: input.completedAt ?? null,
        })
        .select("*")
        .single<ImportJobRow>();

      if (error) {
        throw error;
      }

      return toImportJob(data);
    },

    async updateJob(jobId, accountId, input) {
      const { data, error } = await serviceClient
        .from("import_jobs")
        .update({
          draft_id: input.draftId,
          status: input.status,
          confidence_summary: input.confidenceSummary,
          section_states: input.sectionStates,
          section_warnings: input.sectionWarnings,
          error_message: input.errorMessage,
          completed_at: input.completedAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobId)
        .eq("account_id", accountId)
        .select("*")
        .single<ImportJobRow>();

      if (error) {
        throw error;
      }

      return toImportJob(data);
    },

    async getJob(accountId, jobId) {
      const { data, error } = await serviceClient
        .from("import_jobs")
        .select("*")
        .eq("account_id", accountId)
        .eq("id", jobId)
        .maybeSingle<ImportJobRow>();

      if (error) {
        throw error;
      }

      return data ? toImportJob(data) : null;
    },
  };
}
