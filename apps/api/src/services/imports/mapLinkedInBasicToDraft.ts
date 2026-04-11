import type {
  LinkedInBasicImportRequest,
  PortfolioDraft,
} from "@animated-resume/contracts";

import { refreshDraftMetadata } from "../portfolio/draftUtils.js";

function countTruthy(values: Array<unknown>): number {
  return values.filter(Boolean).length;
}

export function mapLinkedInBasicToDraft(
  currentDraft: PortfolioDraft,
  input: LinkedInBasicImportRequest,
): PortfolioDraft {
  const nextDraft = structuredClone(currentDraft);

  nextDraft.profile.fullName = input.fullName;
  nextDraft.profile.headline = input.headline;
  nextDraft.profile.location = input.location;
  nextDraft.profile.summary = input.summary;
  nextDraft.profile.email = input.email;
  nextDraft.profile.phone = input.phone;
  nextDraft.profile.website = input.website;

  nextDraft.links = [
    ...nextDraft.links.filter((link) => link.type !== "linkedin"),
    {
      type: "linkedin",
      label: "LinkedIn",
      url: input.linkedinUrl,
    },
  ];

  const heroFields = countTruthy([input.fullName, input.headline, input.location]);
  const contactFields = countTruthy([
    input.email,
    input.phone,
    input.website,
    input.linkedinUrl,
  ]);

  nextDraft.metadata.sectionStates.hero = {
    score: heroFields / 3,
    fieldConfidence: {
      fullName: input.fullName ? 1 : 0,
      headline: input.headline ? 0.95 : 0,
      location: input.location ? 0.9 : 0,
    },
    warnings: [],
    verified: false,
    lastVerifiedAt: null,
  };

  nextDraft.metadata.sectionStates.about = {
    score: input.summary ? 0.88 : 0,
    fieldConfidence: {
      summary: input.summary ? 0.88 : 0,
    },
    warnings: input.summary ? [] : ["LinkedIn basic import did not include a summary."],
    verified: false,
    lastVerifiedAt: null,
  };

  nextDraft.metadata.sectionStates.contact = {
    score: contactFields / 4,
    fieldConfidence: {
      email: input.email ? 0.98 : 0,
      phone: input.phone ? 0.9 : 0,
      website: input.website ? 0.9 : 0,
      linkedinUrl: input.linkedinUrl ? 1 : 0,
    },
    warnings: [],
    verified: false,
    lastVerifiedAt: null,
  };

  return refreshDraftMetadata(nextDraft, { sourceType: "linkedin-basic" });
}
