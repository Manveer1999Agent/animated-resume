import type { PortfolioDraft } from "@animated-resume/contracts";

import { refreshDraftMetadata } from "../portfolio/draftUtils.js";
import type { ParsedResumeImport } from "./runGeminiResumeParse.js";

function mergeLinks(
  currentLinks: PortfolioDraft["links"],
  parsedLinks: PortfolioDraft["links"],
): PortfolioDraft["links"] {
  const merged = [...currentLinks];

  for (const parsedLink of parsedLinks) {
    if (!merged.some((link) => link.type === parsedLink.type && link.url === parsedLink.url)) {
      merged.push(parsedLink);
    }
  }

  return merged;
}

export function mapResumeToDraft(
  currentDraft: PortfolioDraft,
  parsed: ParsedResumeImport,
): PortfolioDraft {
  const nextDraft = structuredClone(currentDraft);

  nextDraft.profile.fullName = parsed.profile.fullName ?? nextDraft.profile.fullName;
  nextDraft.profile.headline = parsed.profile.headline ?? nextDraft.profile.headline;
  nextDraft.profile.location = parsed.profile.location ?? nextDraft.profile.location;
  nextDraft.profile.summary = parsed.profile.summary ?? nextDraft.profile.summary;
  nextDraft.profile.email = parsed.profile.email ?? nextDraft.profile.email;
  nextDraft.profile.phone = parsed.profile.phone ?? nextDraft.profile.phone;
  nextDraft.profile.website = parsed.profile.website ?? nextDraft.profile.website;

  if (parsed.experience.length > 0) {
    nextDraft.experience = parsed.experience;
  }
  if (parsed.projects.length > 0) {
    nextDraft.projects = parsed.projects;
  }
  if (parsed.education.length > 0) {
    nextDraft.education = parsed.education;
  }
  if (parsed.skills.featured.length > 0 || parsed.skills.groups.length > 0) {
    nextDraft.skills = parsed.skills;
  }

  nextDraft.links = mergeLinks(nextDraft.links, parsed.links);

  for (const [sectionKey, sectionState] of Object.entries(parsed.sectionStates)) {
    nextDraft.metadata.sectionStates[sectionKey as keyof typeof parsed.sectionStates] = sectionState;
  }

  return refreshDraftMetadata(nextDraft, { sourceType: "resume" });
}
