import { z } from "zod";

export const PREMIUM_PRODUCT_KEY = "healthcare-worker-benefits-decision-system";

export const premiumModuleKeys = [
  "define-decision",
  "compare-compensation",
  "value-benefits",
  "health-plan-exposure",
  "retirement-benefits",
  "schedule-career",
  "verification-list",
  "decision-brief",
] as const;

export type PremiumModuleKey = (typeof premiumModuleKeys)[number];

export const moduleFieldSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]{1,63}$/),
  label: z.string().min(1).max(120),
  type: z.enum(["text", "textarea", "date", "number", "currency", "percent", "select", "multiselect", "rating", "checkbox"]),
  help: z.string().max(320).optional(),
  required: z.boolean().default(false),
  sensitiveReminder: z.boolean().default(false),
  options: z.array(z.object({ value: z.string().max(80), label: z.string().max(100) })).max(20).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().positive().optional(),
  group: z.enum(["optionA", "optionB", "shared"]).default("shared"),
});

export const premiumModuleDefinitionSchema = z.object({
  key: z.enum(premiumModuleKeys),
  number: z.number().int().min(1).max(premiumModuleKeys.length),
  title: z.string().min(1).max(100),
  summary: z.string().min(1).max(360),
  education: z.array(z.string().min(1).max(500)).max(8).default([]),
  fields: z.array(moduleFieldSchema).min(1).max(80),
  verificationTemplates: z.array(z.object({
    fieldId: z.string(),
    audience: z.enum(["human-resources", "recruiter", "benefits-department", "hiring-manager", "retirement-administrator", "plan-document"]),
    question: z.string().min(1).max(300),
  })).max(60).default([]),
});

export type PremiumModuleDefinition = z.infer<typeof premiumModuleDefinitionSchema>;

const answerValueSchema = z.union([
  z.string().max(8000),
  z.number().finite(),
  z.boolean(),
  z.array(z.string().max(160)).max(30),
  z.null(),
]);

export const workspaceStateSchema = z.object({
  version: z.literal(1),
  activeModuleKey: z.enum(premiumModuleKeys).default("define-decision"),
  completedModuleKeys: z.array(z.enum(premiumModuleKeys)).max(premiumModuleKeys.length).default([]),
  answers: z.record(z.string(), answerValueSchema).default({}),
  assumptions: z.array(z.string().max(500)).max(100).default([]),
  finalDecision: z.string().max(500).default(""),
  updatedAt: z.string().datetime().optional(),
});

export type WorkspaceState = z.infer<typeof workspaceStateSchema>;

export const emptyWorkspaceState = (): WorkspaceState => ({
  version: 1,
  activeModuleKey: "define-decision",
  completedModuleKeys: [],
  answers: {},
  assumptions: [],
  finalDecision: "",
});

export type AccessStatus =
  | "signed_out"
  | "not_purchased"
  | "processing"
  | "active"
  | "revoked"
  | "configuration_unavailable";

export const accessResponseSchema = z.object({
  status: z.enum(["signed_out", "not_purchased", "processing", "active", "revoked", "configuration_unavailable"]),
  productKey: z.literal(PREMIUM_PRODUCT_KEY).optional(),
  reason: z.string().max(160).optional(),
});

export const workspaceRecordSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(120),
  status: z.enum(["active", "completed", "archived"]),
  progressPercent: z.number().min(0).max(100),
  state: workspaceStateSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type WorkspaceRecord = z.infer<typeof workspaceRecordSchema>;
