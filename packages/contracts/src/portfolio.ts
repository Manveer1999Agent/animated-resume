import { z } from "zod";

export const portfolioSchemaVersion = "1.0";

export const sectionKeys = [
  "hero",
  "about",
  "experience",
  "projects",
  "education",
  "skills",
  "contact",
] as const;

const isoDateTimeSchema = z.string().datetime({ offset: true });
const yearMonthSchema = z.string().regex(/^\d{4}-\d{2}$/);
const nullableUrlSchema = z.string().url().nullable();
const nullableEmailSchema = z.string().email().nullable();

export const sourceTypeSchema = z.enum(["resume", "linkedin-basic", "manual"]);
export const motionLevelSchema = z.enum(["none", "minimal", "full"]);
export const sectionKeySchema = z.enum(sectionKeys);

export const sectionStateSchema = z.object({
  enabled: z.boolean(),
  variant: z.string().min(1).optional(),
});

export const sectionConfidenceSchema = z.object({
  score: z.number().min(0).max(1),
  fieldConfidence: z.record(z.string(), z.number().min(0).max(1)).default({}),
  warnings: z.array(z.string()).default([]),
  verified: z.boolean().default(false),
  lastVerifiedAt: isoDateTimeSchema.nullable().default(null),
});

const sectionConfidenceShape = {
  hero: sectionConfidenceSchema,
  about: sectionConfidenceSchema,
  experience: sectionConfidenceSchema,
  projects: sectionConfidenceSchema,
  education: sectionConfidenceSchema,
  skills: sectionConfidenceSchema,
  contact: sectionConfidenceSchema,
};

export const sectionConfidenceMapSchema = z.object(sectionConfidenceShape);

export const profileSchema = z.object({
  fullName: z.string(),
  headline: z.string(),
  location: z.string(),
  summary: z.string(),
  email: nullableEmailSchema,
  phone: z.string().nullable(),
  website: nullableUrlSchema,
  avatarAssetId: z.string().uuid().nullable(),
});

export const themeSchema = z.object({
  templateKey: z.string().min(1),
  accentPreset: z.string().min(1),
  motionLevel: motionLevelSchema,
});

export const projectLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const socialLinkSchema = z.object({
  type: z.string().min(1),
  label: z.string().min(1),
  url: z.string().url(),
});

export const experienceItemSchema = z.object({
  id: z.string().uuid(),
  company: z.string(),
  role: z.string(),
  location: z.string().nullable(),
  employmentType: z.string(),
  startDate: yearMonthSchema,
  endDate: yearMonthSchema.nullable(),
  isCurrent: z.boolean(),
  summary: z.string(),
  highlights: z.array(z.string()),
});

export const projectItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  tagline: z.string().nullable(),
  description: z.string(),
  highlights: z.array(z.string()),
  skills: z.array(z.string()),
  links: z.array(projectLinkSchema),
  mediaAssetIds: z.array(z.string().uuid()),
  featured: z.boolean(),
});

export const educationItemSchema = z.object({
  id: z.string().uuid(),
  institution: z.string(),
  program: z.string(),
  startDate: yearMonthSchema.nullable(),
  endDate: yearMonthSchema.nullable(),
  summary: z.string().nullable(),
});

export const skillsSchema = z.object({
  featured: z.array(z.string()),
  groups: z.array(
    z.object({
      label: z.string(),
      items: z.array(z.string()),
    }),
  ),
});

export const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImageAssetId: z.string().uuid().nullable(),
});

export const portfolioDraftMetadataSchema = z.object({
  sourceType: sourceTypeSchema,
  sourceConfidence: z.number().min(0).max(1),
  lastVerifiedAt: isoDateTimeSchema.nullable(),
  completionScore: z.number().int().min(0).max(100),
  sectionStates: sectionConfidenceMapSchema,
});

export const portfolioSectionsSchema = z.object({
  hero: sectionStateSchema,
  about: sectionStateSchema,
  experience: sectionStateSchema,
  projects: sectionStateSchema,
  education: sectionStateSchema,
  skills: sectionStateSchema,
  contact: sectionStateSchema,
});

export const portfolioDraftSchema = z.object({
  schemaVersion: z.literal(portfolioSchemaVersion),
  portfolioId: z.string().uuid(),
  profile: profileSchema,
  theme: themeSchema,
  sections: portfolioSectionsSchema,
  experience: z.array(experienceItemSchema),
  projects: z.array(projectItemSchema),
  education: z.array(educationItemSchema),
  skills: skillsSchema,
  links: z.array(socialLinkSchema),
  seo: seoSchema,
  metadata: portfolioDraftMetadataSchema,
});

export const heroSectionPayloadSchema = z.object({
  fullName: z.string(),
  headline: z.string(),
  location: z.string(),
});

export const aboutSectionPayloadSchema = z.object({
  summary: z.string(),
});

export const contactSectionPayloadSchema = z.object({
  email: nullableEmailSchema,
  phone: z.string().nullable(),
  website: nullableUrlSchema,
  links: z.array(socialLinkSchema),
});

export const portfolioSectionPayloadSchemas = {
  hero: heroSectionPayloadSchema,
  about: aboutSectionPayloadSchema,
  experience: z.array(experienceItemSchema),
  projects: z.array(projectItemSchema),
  education: z.array(educationItemSchema),
  skills: skillsSchema,
  contact: contactSectionPayloadSchema,
} as const;

export const sectionUpdateRequestSchema = z.object({
  data: z.unknown(),
  verified: z.boolean().optional(),
});

export type SourceType = z.infer<typeof sourceTypeSchema>;
export type MotionLevel = z.infer<typeof motionLevelSchema>;
export type SectionKey = z.infer<typeof sectionKeySchema>;
export type SectionState = z.infer<typeof sectionStateSchema>;
export type SectionConfidence = z.infer<typeof sectionConfidenceSchema>;
export type SectionConfidenceMap = z.infer<typeof sectionConfidenceMapSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type Seo = z.infer<typeof seoSchema>;
export type PortfolioDraftMetadata = z.infer<typeof portfolioDraftMetadataSchema>;
export type PortfolioDraft = z.infer<typeof portfolioDraftSchema>;
export type HeroSectionPayload = z.infer<typeof heroSectionPayloadSchema>;
export type AboutSectionPayload = z.infer<typeof aboutSectionPayloadSchema>;
export type ContactSectionPayload = z.infer<typeof contactSectionPayloadSchema>;

function createEmptySectionConfidence(): SectionConfidence {
  return {
    score: 0,
    fieldConfidence: {},
    warnings: [],
    verified: false,
    lastVerifiedAt: null,
  };
}

export function createDefaultSectionConfidenceMap(): SectionConfidenceMap {
  return {
    hero: createEmptySectionConfidence(),
    about: createEmptySectionConfidence(),
    experience: createEmptySectionConfidence(),
    projects: createEmptySectionConfidence(),
    education: createEmptySectionConfidence(),
    skills: createEmptySectionConfidence(),
    contact: createEmptySectionConfidence(),
  };
}

export function createDefaultPortfolioSections() {
  return {
    hero: { enabled: true, variant: "default" },
    about: { enabled: true },
    experience: { enabled: true },
    projects: { enabled: true },
    education: { enabled: true },
    skills: { enabled: true },
    contact: { enabled: true },
  } satisfies z.infer<typeof portfolioSectionsSchema>;
}

export function createEmptyPortfolioDraft(
  portfolioId: string,
  sourceType: SourceType = "manual",
): PortfolioDraft {
  return portfolioDraftSchema.parse({
    schemaVersion: portfolioSchemaVersion,
    portfolioId,
    profile: {
      fullName: "",
      headline: "",
      location: "",
      summary: "",
      email: null,
      phone: null,
      website: null,
      avatarAssetId: null,
    },
    theme: {
      templateKey: "default",
      accentPreset: "editorial-blue",
      motionLevel: "minimal",
    },
    sections: createDefaultPortfolioSections(),
    experience: [],
    projects: [],
    education: [],
    skills: {
      featured: [],
      groups: [],
    },
    links: [],
    seo: {
      title: "",
      description: "",
      ogImageAssetId: null,
    },
    metadata: {
      sourceType,
      sourceConfidence: sourceType === "manual" ? 1 : 0,
      lastVerifiedAt: null,
      completionScore: 0,
      sectionStates: createDefaultSectionConfidenceMap(),
    },
  });
}
