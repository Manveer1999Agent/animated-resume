import type {
  ExperienceItem,
  EducationItem,
  Profile,
  ProjectItem,
  SectionConfidenceMap,
  Skills,
  SocialLink,
} from "@animated-resume/contracts";
import { createDefaultSectionConfidenceMap } from "@animated-resume/contracts";

import type { Env } from "../../lib/env.js";

export type ParsedResumeImport = {
  profile: Partial<Profile>;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  skills: Skills;
  links: SocialLink[];
  sectionStates: SectionConfidenceMap;
};

export type GeminiResumeParser = (
  input: { resumeText: string; fileName?: string },
) => Promise<ParsedResumeImport>;

function extractEmail(input: string): string | null {
  const match = input.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : null;
}

function extractPhone(input: string): string | null {
  const match = input.match(/(\+?\d[\d\s\-()]{7,}\d)/);
  return match ? match[0].trim() : null;
}

function extractWebsite(input: string): string | null {
  const match = input.match(/https?:\/\/[^\s]+/i);
  return match ? match[0] : null;
}

function extractSummary(lines: string[]): string {
  return lines.slice(2, 5).join(" ").trim();
}

function extractSkills(text: string): Skills {
  const skillsLine = text
    .split("\n")
    .find((line) => line.toLowerCase().startsWith("skills:"));

  if (!skillsLine) {
    return {
      featured: [],
      groups: [],
    };
  }

  const items = skillsLine
    .replace(/^skills:/i, "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    featured: items.slice(0, 5),
    groups: items.length > 0
      ? [
        {
          label: "Imported",
          items,
        },
      ]
      : [],
  };
}

function inferSectionStates(
  profile: Partial<Profile>,
  summary: string,
  skills: Skills,
): SectionConfidenceMap {
  const sectionStates = createDefaultSectionConfidenceMap();

  sectionStates.hero = {
    ...sectionStates.hero,
    score: profile.fullName || profile.headline ? 0.82 : 0,
    fieldConfidence: {
      fullName: profile.fullName ? 0.88 : 0,
      headline: profile.headline ? 0.76 : 0,
      location: profile.location ? 0.65 : 0,
    },
    warnings: profile.fullName ? [] : ["Could not confidently extract a full name."],
  };

  sectionStates.about = {
    ...sectionStates.about,
    score: summary ? 0.7 : 0,
    fieldConfidence: {
      summary: summary ? 0.7 : 0,
    },
    warnings: summary ? [] : ["No summary paragraph was detected in the resume text."],
  };

  sectionStates.contact = {
    ...sectionStates.contact,
    score: profile.email || profile.phone || profile.website ? 0.78 : 0,
    fieldConfidence: {
      email: profile.email ? 0.95 : 0,
      phone: profile.phone ? 0.78 : 0,
      website: profile.website ? 0.8 : 0,
    },
    warnings: [],
  };

  sectionStates.skills = {
    ...sectionStates.skills,
    score: skills.featured.length > 0 ? 0.72 : 0,
    fieldConfidence: {
      featured: skills.featured.length > 0 ? 0.72 : 0,
    },
    warnings: [],
  };

  return sectionStates;
}

async function runHeuristicParse(
  resumeText: string,
): Promise<ParsedResumeImport> {
  const trimmedText = resumeText.trim();
  const lines = trimmedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const fullName = lines[0] ?? "";
  const headline = lines[1] ?? "";
  const summary = extractSummary(lines);
  const email = extractEmail(trimmedText);
  const phone = extractPhone(trimmedText);
  const website = extractWebsite(trimmedText);
  const skills = extractSkills(trimmedText);
  const profile: Partial<Profile> = {
    fullName,
    headline,
    summary,
    email,
    phone,
    website,
  };

  return {
    profile,
    experience: [],
    projects: [],
    education: [],
    skills,
    links: website
      ? [
        {
          type: "website",
          label: "Website",
          url: website,
        },
      ]
      : [],
    sectionStates: inferSectionStates(profile, summary, skills),
  };
}

export function createGeminiResumeParser(_env: Env): GeminiResumeParser {
  return async ({ resumeText }) => runHeuristicParse(resumeText);
}
