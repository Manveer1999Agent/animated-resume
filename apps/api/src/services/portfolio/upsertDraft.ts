import type { PortfolioDraft } from "@animated-resume/contracts";

import type { PortfolioDraftRepository, StoredDraftRecord } from "../../lib/supabase.js";
import { refreshDraftMetadata } from "./draftUtils.js";

export async function upsertDraft(
  accountId: string,
  draft: PortfolioDraft,
  draftRepository: PortfolioDraftRepository,
): Promise<StoredDraftRecord> {
  const normalizedDraft = refreshDraftMetadata(draft);
  return draftRepository.saveDraft(accountId, normalizedDraft);
}
