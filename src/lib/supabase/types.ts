export type SubscriptionPlan = "free" | "pro" | "agency";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | null;

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  stripe_customer_id: string | null;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  created_at: string;
}

export interface Lead {
  id: string;
  company_name: string;
  owner_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  city: string | null;
  province: string | null;
  employee_count: number | null;
  revenue_estimate: string | null;
  linkedin: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface ExportRecord {
  id: string;
  user_id: string;
  lead_count: number;
  exported_at: string;
}

export const PLAN_LIMITS = {
  free: { viewLimit: 50, exportLimit: 0 },
  pro: { viewLimit: Infinity, exportLimit: 1000 },
  agency: { viewLimit: Infinity, exportLimit: Infinity },
} as const;
