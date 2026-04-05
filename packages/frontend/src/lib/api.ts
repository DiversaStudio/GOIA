const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("goia_token")
  }

  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options
    
    let url = `${this.baseUrl}${endpoint}`
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })
      url += `?${searchParams.toString()}`
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
      const error = await response.json().catch(() => ({ detail: "Request failed" }))
      throw new Error(error.detail || "Request failed")
    }

    return response.json()
  }

  // Convenience methods
  get<T>(endpoint: string, params?: Record<string, string | number | boolean>) {
    return this.fetch<T>(endpoint, { method: "GET", params })
  }

  post<T>(endpoint: string, data: unknown) {
    return this.fetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  patch<T>(endpoint: string, data: unknown) {
    return this.fetch<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  delete<T>(endpoint: string) {
    return this.fetch<T>(endpoint, { method: "DELETE" })
  }
}

export const api = new ApiClient(API_BASE)

// Type definitions
export interface AISystem {
  id: string
  name: string
  description: string
  vendor: string
  version: string
  risk_level: "minimal" | "limited" | "high" | "unacceptable"
  status: "development" | "testing" | "production" | "retired"
  model_type: string
  deployment_environment: string
  data_sources: string[]
  intended_purpose: string
  use_cases: string[]
  target_users: string[]
  compliance_status: string
  regulatory_categories: string[]
  tenant_id: string
  owner_id: string
}

export interface ComplianceFramework {
  id: number
  framework_name: string
  framework_code: string
  description: string
  region: string
  version: string
  is_active: boolean
}

export interface DataFlowDeclaration {
  id: string
  ai_system_id: string
  data_type: string
  source: string
  destination: string
  purpose: string
  legal_basis: string
  is_approved: boolean
}

export interface DPIA {
  id: string
  ai_system_id: string
  status: "draft" | "in_review" | "approved" | "rejected"
  risk_level: string
  mitigation_measures: string[]
  assessment_date: string
}

export interface FairnessAssessment {
  id: string
  ai_system_id: string
  status: "pending" | "in_progress" | "completed"
  overall_fairness_score: number
  is_fair: boolean
  findings: string[]
  recommendations: string[]
}

export interface ModelCard {
  id: string
  ai_system_id: string
  model_name: string
  model_description: string
  training_data: string
  limitations: string[]
  ethical_considerations: string[]
  is_published: boolean
}

export interface BiasAlert {
  id: string
  ai_system_id: string
  metric_name: string
  threshold: number
  current_value: number
  severity: "low" | "medium" | "high" | "critical"
  is_triggered: boolean
}

export interface AuditLog {
  id: string
  actor_id: string
  action: string
  resource_type: string
  resource_id: string
  details: Record<string, unknown>
  created_at: string
}

export interface Evidence {
  id: string
  ai_system_id: string
  evidence_type: string
  title: string
  description: string
  file_url: string
  is_verified: boolean
  created_at: string
}
