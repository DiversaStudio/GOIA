"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Shield, ArrowLeft, Edit, Trash2, FileText, Lock, Scale, Activity,
  CheckCircle, AlertTriangle, Clock, ExternalLink
} from "lucide-react"
import { api, AISystem } from "@/lib/api"

const riskColors: Record<string, string> = {
  minimal: "bg-green-100 text-green-800 border-green-200",
  limited: "bg-blue-100 text-blue-800 border-blue-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  unacceptable: "bg-red-100 text-red-800 border-red-200",
}

export default function AISystemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [system, setSystem] = useState<AISystem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const data = await api.get<AISystem>(`/api/v1/compliance/ai-systems/${params.id}`)
        setSystem(data)
      } catch (error) {
        console.error("Failed to fetch AI system:", error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      fetchSystem()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!system) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold">AI System not found</h2>
        <Link href="/dashboard/compliance">
          <Button className="mt-4">Back to Compliance</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/compliance">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{system.name}</h1>
            <p className="text-gray-500">{system.vendor} • {system.model_type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/systems/${system.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/compliance/risk?system=${system.id}`}>
            <Button>
              <Shield className="mr-2 h-4 w-4" />
              Risk Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-4 p-4 bg-white border rounded-lg">
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${riskColors[system.risk_level]}`}>
          {system.risk_level.toUpperCase()} RISK
        </span>
        <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 capitalize">
          {system.status}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm ${
          system.compliance_status === "compliant" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {system.compliance_status}
        </span>
        <div className="ml-auto text-sm text-gray-500">
          Version: {system.version}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1">{system.description || "No description provided"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Deployment Environment</label>
                  <p className="mt-1">{system.deployment_environment || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Intended Purpose</label>
                  <p className="mt-1">{system.intended_purpose || "Not specified"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Data Sources</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {system.data_sources?.length > 0 ? (
                    system.data_sources.map((source, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-sm">{source}</span>
                    ))
                  ) : (
                    <span className="text-gray-400">No data sources documented</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Target Users</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {system.target_users?.length > 0 ? (
                    system.target_users.map((user, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">{user}</span>
                    ))
                  ) : (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Requirements based on EU AI Act risk level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {system.risk_level === "high" && (
                  <>
                    {[
                      { name: "Risk Assessment", status: "pending" },
                      { name: "Data Governance Documentation", status: "completed" },
                      { name: "Technical Documentation", status: "in_progress" },
                      { name: "Quality Management System", status: "pending" },
                      { name: "Human Oversight Measures", status: "completed" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : item.status === "in_progress" ? (
                            <Clock className="h-5 w-5 text-blue-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === "completed" ? "bg-green-100 text-green-800" :
                          item.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </>
                )}
                {system.risk_level === "limited" && (
                  <>
                    {[
                      { name: "Transparency Requirements", status: "completed" },
                      { name: "User Notification", status: "completed" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">completed</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          {/* 4 Pillars Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/dashboard/compliance/risk?system=${system.id}`}>
                <Button className="w-full justify-start" variant="ghost">
                  <Shield className="mr-2 h-4 w-4 text-blue-500" />
                  Risk Assessment
                </Button>
              </Link>
              <Link href={`/dashboard/privacy/dpia?system=${system.id}`}>
                <Button className="w-full justify-start" variant="ghost">
                  <Lock className="mr-2 h-4 w-4 text-purple-500" />
                  Create DPIA
                </Button>
              </Link>
              <Link href={`/dashboard/fairness/assessments/new?system=${system.id}`}>
                <Button className="w-full justify-start" variant="ghost">
                  <Scale className="mr-2 h-4 w-4 text-green-500" />
                  Fairness Assessment
                </Button>
              </Link>
              <Link href={`/dashboard/fairness/model-cards/new?system=${system.id}`}>
                <Button className="w-full justify-start" variant="ghost">
                  <FileText className="mr-2 h-4 w-4 text-orange-500" />
                  Generate Model Card
                </Button>
              </Link>
              <Link href={`/dashboard/audit/evidence/new?system=${system.id}`}>
                <Button className="w-full justify-start" variant="ghost">
                  <Activity className="mr-2 h-4 w-4 text-red-500" />
                  Upload Evidence
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Related Items */}
          <Card>
            <CardHeader>
              <CardTitle>Related Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium text-sm">DPIA Report</div>
                <div className="text-xs text-gray-500">Last updated: 2 weeks ago</div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium text-sm">Fairness Assessment</div>
                <div className="text-xs text-gray-500">Score: 78%</div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium text-sm">Model Card</div>
                <div className="text-xs text-gray-500">Published</div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                  <div>
                    <p>Risk assessment updated</p>
                    <p className="text-gray-500 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                  <div>
                    <p>Evidence uploaded</p>
                    <p className="text-gray-500 text-xs">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5" />
                  <div>
                    <p>DPIA created</p>
                    <p className="text-gray-500 text-xs">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
