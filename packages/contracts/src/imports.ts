import { z } from "zod";

import {
  portfolioDraftSchema,
  sectionConfidenceMapSchema,
  sectionKeySchema,
  sourceTypeSchema,
} from "./portfolio.js";

const isoDateTimeSchema = z.string().datetime({ offset: true });

export const importJobStatusSchema = z.enum(["queued", "processing", "succeeded", "failed"]);

export const importConfidenceSummarySchema = z.object({
  overall: z.number().min(0).max(1),
  sections: z.object({
    hero: z.number().min(0).max(1),
    about: z.number().min(0).max(1),
    experience: z.number().min(0).max(1),
    projects: z.number().min(0).max(1),
    education: z.number().min(0).max(1),
    skills: z.number().min(0).max(1),
    contact: z.number().min(0).max(1),
  }),
});

export const importSectionWarningSchema = z.object({
  section: sectionKeySchema,
  message: z.string(),
});

export const importJobSchema = z.object({
  id: z.string().uuid(),
  portfolioId: z.string().uuid(),
  draftId: z.string().uuid().nullable(),
  sourceType: sourceTypeSchema,
  status: importJobStatusSchema,
  confidenceSummary: importConfidenceSummarySchema,
  sectionStates: sectionConfidenceMapSchema,
  sectionWarnings: z.array(importSectionWarningSchema),
  errorMessage: z.string().nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
  completedAt: isoDateTimeSchema.nullable(),
});

export const resumeImportRequestSchema = z.object({
  resumeText: z.string().min(1),
  fileName: z.string().min(1).optional(),
});

export const linkedInBasicImportRequestSchema = z.object({
  fullName: z.string().min(1),
  headline: z.string().default(""),
  location: z.string().default(""),
  summary: z.string().default(""),
  email: z.string().email().nullable().optional().default(null),
  phone: z.string().nullable().optional().default(null),
  website: z.string().url().nullable().optional().default(null),
  linkedinUrl: z.string().url(),
});

export const importJobResponseSchema = z.object({
  job: importJobSchema,
});

export const importDraftResponseSchema = z.object({
  job: importJobSchema,
  draft: portfolioDraftSchema,
});

export type ImportJobStatus = z.infer<typeof importJobStatusSchema>;
export type ImportConfidenceSummary = z.infer<typeof importConfidenceSummarySchema>;
export type ImportSectionWarning = z.infer<typeof importSectionWarningSchema>;
export type ImportJob = z.infer<typeof importJobSchema>;
export type ResumeImportRequest = z.infer<typeof resumeImportRequestSchema>;
export type LinkedInBasicImportRequest = z.infer<typeof linkedInBasicImportRequestSchema>;
