import { z } from "zod";

export const ContactRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200, "Subject must not exceed 200 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must not exceed 2000 characters"),
  meetingTime: z.string().datetime({ message: "Invalid date-time format for meeting" }).optional(),
});

export type ContactRequest = z.infer<typeof ContactRequestSchema>;

export const FeedbackSchema = z.object({
  category: z.enum(["general", "content", "agent", "app"]),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(1000, "Comment must not exceed 1000 characters"),
});

export type Feedback = z.infer<typeof FeedbackSchema>;

export const ContentProposalSchema = z.object({
  entityId: z.string().min(1, "Entity ID is required"),
  fields: z.record(z.any()),
  rationale: z.string().min(10, "Rationale must be at least 10 characters").max(1000, "Rationale must not exceed 1000 characters"),
});

export type ContentProposal = z.infer<typeof ContentProposalSchema>;

export const AuditLogSchema = z.object({
  id: z.string(),
  timestamp: z.string().datetime(),
  action: z.string(),
  actor: z.string(), // IP hash or 'owner'
  status: z.enum(["success", "failure", "blocked"]),
  details: z.record(z.any()).optional(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
