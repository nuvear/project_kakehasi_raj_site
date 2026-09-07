import { z } from "zod";
const text = z.string().max(20000);
const short = z.string().max(500);
const record = <T extends z.ZodTypeAny>(value: T, max = 200) =>
  z
    .record(
      z
        .string()
        .regex(/^[a-zA-Z0-9_]+$/)
        .max(100),
      value,
    )
    .refine((v) => Object.keys(v).length <= max);
export const stateSchema = z.object({
  userProgress: record(z.enum(["todo", "reading", "done"]), 12).default({}),
  reflections: record(text).default({}),
  heatmapRows: z
    .array(
      z.object({
        category: z.enum(["SG&A", "COGS", "Revenue"]),
        lineItem: short,
        baseline: z.number().finite().min(0).max(1e15),
        friction: short,
        lever: short,
        impact: z.number().finite().min(0).max(100),
      }),
    )
    .max(50)
    .default([]),
  governanceMap: record(short, 30).default({}),
  maturityRatings: record(
    z.union([z.literal(1), z.literal(2), z.literal(3)]),
    8,
  ).default({}),
  manifestoSigned: z
    .object({
      orgName: short,
      signerName: short,
      signDate: z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/),
    })
    .default({ orgName: "", signerName: "", signDate: "" }),
  theme: z.enum(["light", "dark", "sepia"]).default("light"),
  fontFamily: z.enum(["sans", "serif"]).default("serif"),
  fontSizeVal: z.number().int().min(14).max(24).default(18),
  activeScreen: z
    .enum(["dashboard", "reader", "maturity", "manifesto"])
    .default("dashboard"),
  activeWeek: z
    .union([
      z.number().int().min(1).max(12),
      z.literal("front"),
      z.literal("back"),
    ])
    .default(1),
  activeTab: z.string().max(200).default("Diary Opening"),
});
export type DiaryState = z.infer<typeof stateSchema>;
export const defaultRows: DiaryState["heatmapRows"] = [
  {
    category: "SG&A",
    lineItem: "Customer Support SG&A",
    baseline: 40000000,
    friction: "High volume tickets, slow responses",
    lever: "Augment agents with triaging",
    impact: 10,
  },
  {
    category: "COGS",
    lineItem: "Inventory Wastage",
    baseline: 25000000,
    friction: "Poor demand prediction and placement",
    lever: "Predictive placement routing",
    impact: 4,
  },
  {
    category: "Revenue",
    lineItem: "Personalized Offers",
    baseline: 120000000,
    friction: "Low checkout conversion",
    lever: "Prescriptive product bundling",
    impact: 3,
  },
];
export const freshState = (): DiaryState => ({
  ...stateSchema.parse({}),
  heatmapRows: structuredClone(defaultRows),
});
export const valuePool = (rows: DiaryState["heatmapRows"]) =>
  rows.reduce((sum, r) => sum + (r.baseline * r.impact) / 100, 0);
export type Member = {
  uid: string;
  email: string;
  name: string;
  role: "admin" | "participant";
  status: "pending" | "active" | "revoked";
  createdAt: string;
};
export function canAccess(member: Member | null) {
  return member?.status === "active";
}
export function canAdmin(member: Member | null) {
  return canAccess(member) && member?.role === "admin";
}
export function mayUpdateMember(actor: Member, target: Member) {
  return canAdmin(actor) && actor.uid !== target.uid;
}
