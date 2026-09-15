export type AppMode = "full" | "showcase";

export const appMode: AppMode = import.meta.env.VITE_APP_MODE === "full" ? "full" : "showcase";
export const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const ACCESS_KEY = "decypher.accessToken";
const REFRESH_KEY = "decypher.refreshToken";

export interface ApiEvidence {
  id: string;
  case_id: string;
  name: string;
  description: string;
  type: string;
  mime_type: string;
  size: number;
  sha256: string;
  status: string;
  verification_token: string;
  created_at: string;
  registered_at: string | null;
  custody?: Array<Record<string, string>>;
  analysis?: Array<Record<string, unknown>>;
  blockchain?: Record<string, unknown> | null;
}

export function authToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem("decypher.user");
}

export function currentSession() {
  const raw = localStorage.getItem("decypher.user");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

async function request<T>(path: string, init: RequestInit = {}, authenticated = true): Promise<T> {
  if (appMode !== "full") throw new Error("This secure operation requires the local full-stack demo.");
  const headers = new Headers(init.headers);
  if (authenticated && authToken()) headers.set("Authorization", `Bearer ${authToken()}`);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const response = await fetch(`${apiBase}${path}`, { ...init, headers });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.detail?.message || body.detail || body.message || message;
    } catch { /* keep fallback */ }
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }
  return response.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  const session = await request<{ access_token: string; refresh_token: string; user: Record<string, string> }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }, false);
  localStorage.setItem(ACCESS_KEY, session.access_token);
  localStorage.setItem(REFRESH_KEY, session.refresh_token);
  localStorage.setItem("decypher.user", JSON.stringify(session.user));
  return session.user;
}

export const api = {
  resetDemo: () => request<any>("/admin/reset-demo", { method:"POST" }),
  listCases: () => request<any[]>("/cases"),
  createCase: (body: { title:string; description:string; priority:string; lead_investigator?:string }) => request<any>("/cases", { method:"POST", body:JSON.stringify(body) }),
  getCase: (id: string) => request<any>(`/cases/${id}`),
  listEvidence: (caseId = "CASE-2026-017") => request<ApiEvidence[]>(`/evidence?case_id=${encodeURIComponent(caseId)}`),
  getEvidence: (id: string) => request<ApiEvidence>(`/evidence/${id}`),
  uploadEvidence: (caseId: string, file: File, description = "") => {
    const body = new FormData(); body.append("case_id", caseId); body.append("description", description); body.append("file", file);
    return request<ApiEvidence>("/evidence", { method: "POST", body });
  },
  registerEvidence: (id: string) => request<any>(`/evidence/${id}/register`, { method: "POST" }),
  analyzeEvidence: (id: string) => request<any>(`/evidence/${id}/analyze`, { method: "POST" }),
  verifyEvidence: (id: string, file?: File) => { const body = new FormData(); if (file) body.append("file", file); return request<any>(`/evidence/${id}/verify`, { method: "POST", body }); },
  graph: (caseId: string) => request<any>(`/cases/${caseId}/graph`),
  timeline: (caseId: string) => request<any[]>(`/cases/${caseId}/timeline`),
  map: (caseId: string) => request<any[]>(`/cases/${caseId}/map`),
  network: (caseId: string) => request<any>(`/cases/${caseId}/network`),
  copilot: (caseId: string, question: string, locale: string) => request<any>("/copilot/query", { method: "POST", body: JSON.stringify({ case_id: caseId, question, locale }) }),
  generateReport: (caseId: string, locale: string) => request<any>(`/cases/${caseId}/reports`, { method: "POST", body: JSON.stringify({ locale }) }),
  job: (id: string) => request<any>(`/jobs/${id}`),
  publicVerify: async (token: string) => {
    const response = await fetch(`${apiBase}/verify/${encodeURIComponent(token)}`); if (!response.ok) throw new Error("Evidence identity was not found."); return response.json();
  },
  downloadUrl: (path: string) => `${apiBase.replace(/\/api\/v1$/, "")}${path}`,
  fileUrl: (id: string) => `${apiBase}/evidence/${id}/file`,
  qrUrl: (id: string) => `${apiBase}/evidence/${id}/qr`,
};

export async function waitForJob(id: string, onProgress?: (status: string) => void) {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    const job = await api.job(id); onProgress?.(job.status);
    if (job.status === "succeeded") return job.result;
    if (job.status === "failed") throw new Error(job.error || "Processing failed.");
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error(`Job ${id} is still pending. Check that the processing worker is running.`);
}

export async function browserSha256(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
