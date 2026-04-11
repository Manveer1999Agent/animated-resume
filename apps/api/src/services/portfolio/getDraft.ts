import type { PortfolioDraftRepository, StoredDraftRecord } from "../../lib/supabase.js";

export async function getDraft(
  accountId: string,
  draftRepository: PortfolioDraftRepository,
): Promise<StoredDraftRecord> {
  return draftRepository.getOrCreateDraft(accountId);
}
