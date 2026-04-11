import type {
  ImportConfidenceSummary,
  ImportSectionWarning,
  PortfolioDraft,
  SectionConfidence,
  SectionConfidenceMap,
  SectionKey,
} from "@animated-resume/contracts";
import {
  createDefaultSectionConfidenceMap,
  portfolioDraftSchema,
  sectionKeys,
} from "@animated-resume/contracts";

function clampScore(value: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

function hasHeroContent(draft: PortfolioDraft): boolean {
  return Boolean(draft.profile.fullName.trim() || draft.profile.headline.trim());
}

function hasAboutContent(draft: PortfolioDraft): boolean {
  return Boolean(draft.profile.summary.trim());
}

function hasExperienceContent(draft: PortfolioDraft): boolean {
  return draft.experience.length > 0;
}

function hasProjectsContent(draft: PortfolioDraft): boolean {
  return draft.projects.length > 0;
}

function hasEducationContent(draft: PortfolioDraft): boolean {
  return draft.education.length > 0;
}

function hasSkillsContent(draft: PortfolioDraft): boolean {
  return (
    draft.skills.featured.length > 0
    || draft.skills.groups.some((group) => group.items.length > 0)
  );
}

function hasContactContent(draft: PortfolioDraft): boolean {
  return Boolean(
    draft.profile.email
      || draft.profile.phone
      || draft.profile.website
      || draft.links.length > 0,
  );
}

export function hasSectionContent(draft: PortfolioDraft, sectionKey: SectionKey): boolean {
  switch (sectionKey) {
    case "hero":
      return hasHeroContent(draft);
    case "about":
      return hasAboutContent(draft);
    case "experience":
      return hasExperienceContent(draft);
    case "projects":
      return hasProjectsContent(draft);
    case "education":
      return hasEducationContent(draft);
    case "skills":
      return hasSkillsContent(draft);
    case "contact":
      return hasContactContent(draft);
  }
}

export function calculateCompletionScore(draft: PortfolioDraft): number {
  const enabledSections = sectionKeys.filter((sectionKey) => draft.sections[sectionKey].enabled);
  if (enabledSections.length === 0) {
    return 0;
  }

  const completedSections = enabledSections.filter((sectionKey) => hasSectionContent(draft, sectionKey));
  return Math.round((completedSections.length / enabledSections.length) * 100);
}

export function averageSectionConfidence(sectionStates: SectionConfidenceMap): number {
  const scores = sectionKeys.map((sectionKey) => clampScore(sectionStates[sectionKey].score));
  return scores.length === 0
    ? 0
    : Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(4));
}

export function buildImportConfidenceSummary(
  sectionStates: SectionConfidenceMap,
): ImportConfidenceSummary {
  return {
    overall: averageSectionConfidence(sectionStates),
    sections: {
      hero: clampScore(sectionStates.hero.score),
      about: clampScore(sectionStates.about.score),
      experience: clampScore(sectionStates.experience.score),
      projects: clampScore(sectionStates.projects.score),
      education: clampScore(sectionStates.education.score),
      skills: clampScore(sectionStates.skills.score),
      contact: clampScore(sectionStates.contact.score),
    },
  };
}

export function buildImportWarnings(sectionStates: SectionConfidenceMap): ImportSectionWarning[] {
  return sectionKeys.flatMap((sectionKey) =>
    sectionStates[sectionKey].warnings.map((message) => ({
      section: sectionKey,
      message,
    })),
  );
}

function latestVerifiedAt(sectionStates: SectionConfidenceMap): string | null {
  return sectionKeys.reduce<string | null>((latest, sectionKey) => {
    const candidate = sectionStates[sectionKey].lastVerifiedAt;
    if (!candidate) {
      return latest;
    }
    if (!latest) {
      return candidate;
    }
    return candidate > latest ? candidate : latest;
  }, null);
}

function ensureSeoDefaults(draft: PortfolioDraft): PortfolioDraft {
  const nextDraft = structuredClone(draft);
  const titleParts = [nextDraft.profile.fullName, nextDraft.profile.headline].filter(Boolean);

  if (!nextDraft.seo.title.trim()) {
    nextDraft.seo.title = titleParts.join(" | ");
  }

  if (!nextDraft.seo.description.trim()) {
    nextDraft.seo.description = nextDraft.profile.summary.trim();
  }

  return nextDraft;
}

export function refreshDraftMetadata(
  draft: PortfolioDraft,
  options?: {
    sourceType?: PortfolioDraft["metadata"]["sourceType"];
    sourceConfidence?: number;
  },
): PortfolioDraft {
  const nextDraft = ensureSeoDefaults(structuredClone(draft));

  if (options?.sourceType) {
    nextDraft.metadata.sourceType = options.sourceType;
  }

  nextDraft.metadata.completionScore = calculateCompletionScore(nextDraft);
  nextDraft.metadata.sourceConfidence = options?.sourceConfidence
    ?? averageSectionConfidence(nextDraft.metadata.sectionStates);
  nextDraft.metadata.lastVerifiedAt = latestVerifiedAt(nextDraft.metadata.sectionStates);

  return portfolioDraftSchema.parse(nextDraft);
}

export function mergeSectionConfidence(
  current: SectionConfidence | undefined,
  patch: Partial<SectionConfidence>,
): SectionConfidence {
  const fallback = current ?? createDefaultSectionConfidenceMap().hero;

  return {
    score: clampScore(patch.score ?? fallback.score),
    fieldConfidence: patch.fieldConfidence ?? fallback.fieldConfidence,
    warnings: patch.warnings ?? fallback.warnings,
    verified: patch.verified ?? fallback.verified,
    lastVerifiedAt: patch.lastVerifiedAt ?? fallback.lastVerifiedAt,
  };
}
