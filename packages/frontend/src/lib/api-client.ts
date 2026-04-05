/**
 * GOIA Frontend API Client
 * Comprehensive API service layer for all backend endpoints
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// =====================
// TYPES
// =====================

export interface PaginatedResponse<T> {
  total: number
  skip?: number
  limit?: number
  items: T[]
}

export interface ApiError {
  detail: string
  error?: string
  code?: string
}

// Common Enums
export type RiskLevel = "minimal" | "limited" | "high" | "unacceptable"
export type AISystemStatus = "development" | "testing" | "production" | "decommissioned"
export type AssessmentStatus = "pending" | "in_progress" | "completed" | "failed"

// =====================
// AI SYSTEMS
// =====================

export interface AISystem {
  id: string
  name: string
  description?: string
  vendor?: string
  version?: string
  risk_level: RiskLevel
  status: AISystemStatus
  model_type?: string
  deployment_environment?: string
  data_sources?: string[]
  intended_purpose?: string
  use_cases?: string[]
  target_users?: string
  compliance_status: string
  regulatory_categories?: string[]
  tenant_id: string
  owner_id?: string
  created_at: string
  updated_at?: string
}

export interface AISystemCreate {
  name: string
  description?: string
  vendor?: string
  version?: string
  risk_level?: RiskLevel
  status?: AISystemStatus
  model_type?: string
  deployment_environment?: string
  data_sources?: string[]
  intended_purpose?: string
  use_cases?: string[]
  target_users?: string
  regulatory_categories?: string[]
  owner_id?: string
}

// =====================
// COMPLIANCE
// =====================

export interface ComplianceRecord {
  id: string
  ai_system_id: string
  framework_id: number
  assessment_type: string
  assessment_status: string
  overall_score: number
  compliance_percentage: number
  findings?: Record<string, unknown>[]
  recommendations?: string[]
  evidence_links?: string[]
  assessor_id?: string
  assessment_date?: string
  next_assessment_date?: string
  created_at: string
}

export interface RiskAssessment {
  id: string
  ai_system_id: string
  overall_risk_score: number
  risk_level: RiskLevel
  privacy_risk_score: number
  fairness_risk_score: number
  security_risk_score: number
  transparency_risk_score: number
  assessment_responses?: Record<string, unknown>
  risk_mitigations?: Record<string, unknown>[]
  is_validated: boolean
  validated_by?: string
  validated_at?: string
  created_at: string
}

export interface ComplianceFramework {
  id: number
  framework_name: string
  framework_code: string
  description?: string
  region?: string
  version?: string
  is_active: boolean
  effective_date?: string
  created_at: string
}

// =====================
// PRIVACY
// =====================

export interface DataFlowDeclaration {
  id: string
  ai_system_id: string
  data_type: string
  data_category: string
  source: string
  destination: string
  purpose: string
  legal_basis: string
  retention_period?: number
  cross_border_transfer: boolean
  transfer_destination?: string
  safeguards?: string[]
  is_approved: boolean
  approved_by?: string
  approved_at?: string
  created_at: string
}

export interface DPIA {
  id: string
  ai_system_id: string
  title: string
  description?: string
  status: "draft" | "in_review" | "approved" | "rejected"
  data_flows_involved?: string[]
  processing_description?: string
  necessity_assessment?: string
  risks_identified?: Record<string, unknown>[]
  mitigation_measures?: string[]
  residual_risk_level: string
  dpo_opinion?: string
  approved_by?: string
  approved_at?: string
  created_at: string
}

export interface DataSubjectRequest {
  id: string
  request_type: string
  subject_name?: string
  subject_email: string
  subject_id?: string
  description?: string
  ai_systems_involved?: string[]
  status: string
  assigned_to?: string
  response_summary?: string
  response_data?: Record<string, unknown>
  due_date?: string
  completed_at?: string
  created_at: string
}

// =====================
// FAIRNESS
// =====================

export interface ModelCard {
  id: string
  ai_system_id: string
  model_name: string
  model_description?: string
  model_version?: string
  model_architecture?: string
  training_data?: string
  training_data_size?: number
  validation_data?: string
  testing_data?: string
  performance_metrics?: Record<string, number>
  limitations?: string[]
  ethical_considerations?: string[]
  intended_uses?: string[]
  out_of_scope_uses?: string[]
  fairness_metrics?: Record<string, number>
  bias_mitigation?: string[]
  is_published: boolean
  published_at?: string
  created_at: string
}

export interface FairnessAssessment {
  id: string
  ai_system_id: string
  model_card_id?: string
  protected_attributes?: string[]
  metrics_evaluated?: string[]
  threshold?: Record<string, number>
  dataset_info?: string
  status: AssessmentStatus
  overall_fairness_score: number
  is_fair: boolean
  metric_results?: Record<string, number>
  findings?: Record<string, unknown>[]
  recommendations?: string[]
  assessment_date?: string
  assessor_id?: string
  created_at: string
}

export interface BiasAlert {
  id: string
  ai_system_id: string
  metric_name: string
  metric_description?: string
  threshold: number
  comparison_operator: string
  severity: "low" | "medium" | "high" | "critical"
  protected_attribute?: string
  notification_channels?: string[]
  is_active: boolean
  is_triggered: boolean
  current_value?: number
  previous_value?: number
  last_triggered_at?: string
  trigger_count: number
  created_at: string
}

// =====================
// AUDIT
// =====================

export interface AuditLog {
  id: string
  action: string
  resource_type: string
  resource_id: string
  actor_id?: string
  actor_email?: string
  details?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  actor_ip?: string
  tenant_id: string
  created_at: string
}

export interface Evidence {
  id: string
  ai_system_id: string
  evidence_type: string
  title: string
  description?: string
  file_url?: string
  file_name?: string
  file_size?: number
  file_hash?: string
  compliance_record_id?: string
  tags?: string[]
  retention_until?: string
  tenant_id: string
  uploaded_by?: string
  is_verified: boolean
  verified_by?: string
  verified_at?: string
  access_count: number
  last_accessed_at?: string
  created_at: string
}

export interface SystemHealth {
  id: string
  ai_system_id: string
  overall_status: "healthy" | "degraded" | "unhealthy" | "unknown"
  uptime_percentage: number
  response_time_ms?: number
  error_rate: number
  last_incident?: string
  incidents_count_30d: number
  checks?: Record<string, unknown>
  metrics?: Record<string, number>
  tenant_id: string
  created_at: string
}

// =====================
// DASHBOARD
// =====================

export interface DashboardSummary {
  total_systems: number
  compliant_systems: number
  non_compliant_systems: number
  pending_assessments: number
  triggered_alerts: number
  compliance_score: number
  systems_by_status: Record<string, number>
  systems_by_risk: Record<string, number>
  recent_activity: ActivityItem[]
  pillar_stats: {
    compliance: Record<string, number>
    privacy: Record<string, number>
    fairness: Record<string, number>
    audit: Record<string, number>
  }
  last_updated: string
}

export interface ActivityItem {
  id: string
  type: string
  message: string
  time: string
  severity?: string
  resource_id?: string
}

// =====================
// AUTH
// =====================

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  full_name: string
  tenant_name?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: {
    id: string
    email: string
    full_name: string
    tenant_id: string
    role: string
  }
}

export interface User {
  id: string
  email: string
  full_name: string
  role: string
  tenant_id: string
  is_active: boolean
  created_at: string
}

// =====================
// API CLIENT CLASS
// =====================

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("goia_token")
  }

  private setAuthToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem("goia_token", token)
  }

  private clearAuthToken(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("goia_token")
  }

  async fetch<T>(
    endpoint: string,
    options: RequestInit & { params?: Record<string, string | number | boolean> } = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options

    let url = `${this.baseUrl}${endpoint}`
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    const token = this.getAuthToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.clearAuthToken()
        // Redirect to login if in browser
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login"
        }
      }
      const error = await response.json().catch(() => ({ detail: "Request failed" }))
      throw new Error(error.detail || "Request failed")
    }

    return response.json()
  }

  // HTTP Methods
  get<T>(endpoint: string, params?: Record<string, string | number | boolean>) {
    return this.fetch<T>(endpoint, { method: "GET", params })
  }

  post<T>(endpoint: string, data?: unknown) {
    return this.fetch<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  patch<T>(endpoint: string, data?: unknown) {
    return this.fetch<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string) {
    return this.fetch<T>(endpoint, { method: "DELETE" })
  }

  // Auth Methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>("/api/v1/auth/login", credentials)
    this.setAuthToken(response.access_token)
    return response
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>("/api/v1/auth/register", data)
    this.setAuthToken(response.access_token)
    return response
  }

  logout(): void {
    this.clearAuthToken()
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken()
  }
}

// =====================
// API INSTANCE & SERVICES
// =====================

export const api = new ApiClient(API_BASE)

// Compliance Service
export const complianceService = {
  // AI Systems
  listSystems: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<AISystem>>("/api/v1/compliance/ai-systems", params),
  
  getSystem: (id: string) =>
    api.get<AISystem>(`/api/v1/compliance/ai-systems/${id}`),
  
  createSystem: (data: AISystemCreate) =>
    api.post<AISystem>("/api/v1/compliance/ai-systems", data),
  
  updateSystem: (id: string, data: Partial<AISystemCreate>) =>
    api.patch<AISystem>(`/api/v1/compliance/ai-systems/${id}`, data),
  
  deleteSystem: (id: string) =>
    api.delete<void>(`/api/v1/compliance/ai-systems/${id}`),

  // Compliance Records
  listRecords: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<ComplianceRecord>>("/api/v1/compliance/records", params),
  
  createRecord: (data: Partial<ComplianceRecord>) =>
    api.post<ComplianceRecord>("/api/v1/compliance/records", data),

  // Risk Assessments
  listRiskAssessments: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<RiskAssessment>>("/api/v1/compliance/risk-assessments", params),
  
  createRiskAssessment: (data: Partial<RiskAssessment>) =>
    api.post<RiskAssessment>("/api/v1/compliance/risk-assessments", data),

  // Frameworks
  listFrameworks: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<ComplianceFramework>>("/api/v1/compliance/frameworks", params),

  // Stats
  getStats: () =>
    api.get<Record<string, unknown>>("/api/v1/compliance/stats/summary"),
}

// Privacy Service
export const privacyService = {
  // Data Flows
  listDataFlows: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<DataFlowDeclaration>>("/api/v1/privacy/data-flows", params),
  
  createDataFlow: (data: Partial<DataFlowDeclaration>) =>
    api.post<DataFlowDeclaration>("/api/v1/privacy/data-flows", data),
  
  approveDataFlow: (id: string, approverId: string) =>
    api.post<DataFlowDeclaration>(`/api/v1/privacy/data-flows/${id}/approve`, { approver_id: approverId }),

  // DPIAs
  listDPIAs: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<DPIA>>("/api/v1/privacy/dpias", params),
  
  createDPIA: (data: Partial<DPIA>) =>
    api.post<DPIA>("/api/v1/privacy/dpias", data),

  // Subject Requests
  listSubjectRequests: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<DataSubjectRequest>>("/api/v1/privacy/subject-requests", params),
  
  createSubjectRequest: (data: Partial<DataSubjectRequest>) =>
    api.post<DataSubjectRequest>("/api/v1/privacy/subject-requests", data),
  
  completeSubjectRequest: (id: string, summary: string, data?: Record<string, unknown>) =>
    api.post<DataSubjectRequest>(`/api/v1/privacy/subject-requests/${id}/complete`, { summary, data }),

  // Stats
  getStats: () =>
    api.get<Record<string, unknown>>("/api/v1/privacy/stats/summary"),
}

// Fairness Service
export const fairnessService = {
  // Model Cards
  listModelCards: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<ModelCard>>("/api/v1/fairness/model-cards", params),
  
  createModelCard: (data: Partial<ModelCard>) =>
    api.post<ModelCard>("/api/v1/fairness/model-cards", data),
  
  publishModelCard: (id: string) =>
    api.post<ModelCard>(`/api/v1/fairness/model-cards/${id}/publish`),

  // Assessments
  listAssessments: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<FairnessAssessment>>("/api/v1/fairness/assessments", params),
  
  createAssessment: (data: Partial<FairnessAssessment>) =>
    api.post<FairnessAssessment>("/api/v1/fairness/assessments", data),
  
  completeAssessment: (id: string, data: { score: number; is_fair: boolean; findings?: unknown[]; recommendations?: string[] }) =>
    api.post<FairnessAssessment>(`/api/v1/fairness/assessments/${id}/complete`, data),

  // Alerts
  listAlerts: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<BiasAlert>>("/api/v1/fairness/alerts", params),
  
  createAlert: (data: Partial<BiasAlert>) =>
    api.post<BiasAlert>("/api/v1/fairness/alerts", data),
  
  acknowledgeAlert: (id: string) =>
    api.post<BiasAlert>(`/api/v1/fairness/alerts/${id}/acknowledge`),

  // Stats
  getStats: () =>
    api.get<Record<string, unknown>>("/api/v1/fairness/stats/summary"),
}

// Audit Service
export const auditService = {
  // Logs
  listLogs: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<AuditLog>>("/api/v1/audit/logs", params),
  
  createLog: (data: Partial<AuditLog>) =>
    api.post<AuditLog>("/api/v1/audit/logs", data),

  // Evidence
  listEvidence: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<Evidence>>("/api/v1/audit/evidence", params),
  
  createEvidence: (data: Partial<Evidence>) =>
    api.post<Evidence>("/api/v1/audit/evidence", data),
  
  verifyEvidence: (id: string, verifierId: string) =>
    api.post<Evidence>(`/api/v1/audit/evidence/${id}/verify`, { verifier_id: verifierId }),

  // Health
  listHealth: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<SystemHealth>>("/api/v1/audit/health", params),
  
  createHealth: (data: Partial<SystemHealth>) =>
    api.post<SystemHealth>("/api/v1/audit/health", data),

  // Dashboard
  getDashboardSummary: () =>
    api.get<DashboardSummary>("/api/v1/audit/dashboard/summary"),

  // Stats
  getStats: () =>
    api.get<Record<string, unknown>>("/api/v1/audit/stats/summary"),
}

// Auth Service
export const authService = {
  login: (credentials: LoginCredentials) => api.login(credentials),
  register: (data: RegisterData) => api.register(data),
  logout: () => api.logout(),
  isAuthenticated: () => api.isAuthenticated(),
  getCurrentUser: () => api.get<User>("/api/v1/auth/me"),
}
