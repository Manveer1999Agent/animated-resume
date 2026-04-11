import type {
  PortfolioDraft,
  SectionKey,
} from "@animated-resume/contracts";

import type { PortfolioDraftRepository, StoredDraftRecord } from "../../lib/supabase.js";
import { getDraft } from "./getDraft.js";
import {
  hasSectionContent,
  mergeSectionConfidence,
  refreshDraftMetadata,
} from "./draftUtils.js";

function sectionScoreForManualUpdate(
  draft: PortfolioDraft,
  sectionKey: SectionKey,
): number {
  return hasSectionContent(draft, sectionKey) ? 1 : 0;
}

export function applySectionUpdate(
  currentDraft: PortfolioDraft,
  sectionKey: SectionKey,
  data: unknown,
  verified = false,
): PortfolioDraft {
  const nextDraft = structuredClone(currentDraft);
  const now = new Date().toISOString();

  switch (sectionKey) {
    case "hero": {
      const payload = data as {
        fullName: string;
        headline: string;
        location: string;
      };
      nextDraft.profile.fullName = payload.fullName;
      nextDraft.profile.headline = payload.headline;
      nextDraft.profile.location = payload.location;
      break;
    }
    case "about": {
      const payload = data as { summary: string };
      nextDraft.profile.summary = payload.summary;
      break;
    }
    case "experience":
      nextDraft.experience = data as PortfolioDraft["experience"];
      break;
    case "projects":
      nextDraft.projects = data as PortfolioDraft["projects"];
      break;
    case "education":
      nextDraft.education = data as PortfolioDraft["education"];
      break;
    case "skills":
      nextDraft.skills = data as PortfolioDraft["skills"];
      break;
    case "contact": {
      const payload = data as {
        email: string | null;
        phone: string | null;
        website: string | null;
        links: PortfolioDraft["links"];
      };
      nextDraft.profile.email = payload.email;
      nextDraft.profile.phone = payload.phone;
      nextDraft.profile.website = payload.website;
      nextDraft.links = payload.links;
      break;
    }
  }

  nextDraft.sections[sectionKey].enabled = true;
  nextDraft.metadata.sectionStates[sectionKey] = mergeSectionConfidence(
    nextDraft.metadata.sectionStates[sectionKey],
    {
      score: sectionScoreForManualUpdate(nextDraft, sectionKey),
      warnings: [],
      verified: verified || nextDraft.metadata.sectionStates[sectionKey].verified,
      lastVerifiedAt: verified ? now : nextDraft.metadata.sectionStates[sectionKey].lastVerifiedAt,
    },
  );

  return refreshDraftMetadata(nextDraft, { sourceType: "manual" });
}

export async function updateSection(
  accountId: string,
  sectionKey: SectionKey,
  data: unknown,
  verified: boolean | undefined,
  draftRepository: PortfolioDraftRepository,
): Promise<StoredDraftRecord> {
  const currentDraft = await getDraft(accountId, draftRepository);
  const nextDraft = applySectionUpdate(currentDraft.draft, sectionKey, data, verified ?? false);
  return draftRepository.saveDraft(accountId, nextDraft);
}
