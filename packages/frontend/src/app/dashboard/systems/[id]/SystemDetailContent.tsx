"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Shield, ArrowLeft, Edit, Trash2, FileText, Lock, Scale, Activity,
  CheckCircle, AlertTriangle, Clock, ExternalLink
} from "lucide-react"
import { api, AISystem } from "@/lib/api"

const riskColors: Record<string, string> = {
  minimal: "bg-green-500/10 text-green-600 border-green-500/20",
  limited: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  unacceptable: "bg-red-500/10 text-red-600 border-red-500/20",
}

export default function AISystemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [system, setSystem] = useState<AISystem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const id = params?.id
        if (!id) return
        const data = await api.get<AISystem>(`/api/v1/compliance/ai-systems/${id}`)
        setSystem(data)
      } catch (error) {
        console.error("Failed to fetch AI system:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSystem()
  }, [params])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!system) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto size-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">AI System not found</h2>
        <Link href="/dashboard/compliance">
          <Button className="mt-4">Back to Compliance</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/compliance">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{system.name}</h1>
            <p className="text-muted-foreground">{system.vendor} • {system.model_type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/systems/${system.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 size-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/compliance/risk?system=${system.id}`}>
            <Button>
              <Shield className="mr-2 size-4" />
              Risk Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-4 p-4 bg-card border rounded-lg">
        <Badge variant="outline" className={riskColors[system.risk_level]}>
          {system.risk_level.toUpperCase()} RISK
        </Badge>
        <Badge variant="outline" className="bg-muted">
          {system.status}
        </Badge>
        <Badge variant="outline" className={
          system.compliance_status === "compliant"
            ? "bg-emerald-500/10 text-emerald-600"
            : "bg-amber-500/10 text-amber-600"
        }>
          {system.compliance_status}
        </Badge>
        <div className="ml-auto text-sm text-muted-foreground">
          Version: {system.version}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1">{system.description || "No description provided"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Deployment Environment</label>
                  <p className="mt-1">{system.deployment_environment || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Intended Purpose</label>
                  <p className="mt-1">{system.intended_purpose || "Not specified"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data Sources</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {system.data_sources?.length > 0 ? (
                    system.data_sources.map((source, idx) => (
                      <Badge key={idx} variant="outline">{source}</Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No data sources documented</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Target Users</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {system.target_users?.length > 0 ? (
                    system.target_users.map((user, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-500/10 text-blue-600">{user}</Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">Not specified</span>
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
              <div className="flex flex-col gap-3">
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
                            <CheckCircle className="size-5 text-emerald-600" />
                          ) : item.status === "in_progress" ? (
                            <Clock className="size-5 text-blue-600" />
                          ) : (
                            <AlertTriangle className="size-5 text-muted-foreground" />
                          )}
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <Badge variant="outline" className={
                          item.status === "completed" ? "bg-emerald-500/10 text-emerald-600" :
                          item.status === "in_progress" ? "bg-blue-500/10 text-blue-600" :
                          "bg-muted text-muted-foreground"
                        }>
                          {item.status.replace("_", " ")}
                        </Badge>
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
                          <CheckCircle className="size-5 text-emerald-600" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600">
                          completed
                        </Badge>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link href={`/dashboard/compliance/risk?system=${system.id}`}>
                <Button className="w-full justify-start" variant="ghost">
                  <Shield className="mr-2 size-4 text-blue-500" />
                  Risk Assessment
                </Button>
              </Link>
              <Link href={`/dashboard/privacy/dpia?system=${system.id}`}>
                <Button className="w-full justify-start" variant="ghost">
                  <Lock className="mr-2 size-4 text-emerald-500" />
                  Create DPIA
                </Button>
              </Link>
              <Link href={`/dashboard/fairness/assessments/new?system=${system.id}`}>
                <Button className="w-full justify-start" variant="ghost">
                  <Scale className="mr-2 size-4 text-amber-500" />
                  Fairness Assessment
                </Button>
              </Link>
              <Link href={`/dashboard/fairness/model-cards/new?system=${system.id}`}>
                <Button className="w-full justify-start" variant="ghost">
                  <FileText className="mr-2 size-4 text-purple-500" />
                  Generate Model Card
                </Button>
              </Link>
              <Link href={`/dashboard/audit/evidence/new?system=${system.id}`}>
                <Button className="w-full justify-start" variant="ghost">
                  <Activity className="mr-2 size-4 text-rose-500" />
                  Upload Evidence
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Items</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="font-medium text-sm">DPIA Report</div>
                <div className="text-xs text-muted-foreground">Last updated: 2 weeks ago</div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="font-medium text-sm">Fairness Assessment</div>
                <div className="text-xs text-muted-foreground">Score: 78%</div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="font-medium text-sm">Model Card</div>
                <div className="text-xs text-muted-foreground">Published</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="size-2 rounded-full bg-blue-500 mt-1.5" />
                  <div>
                    <p>Risk assessment updated</p>
                    <p className="text-muted-foreground text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-2 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <p>Evidence uploaded</p>
                    <p className="text-muted-foreground text-xs">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-2 rounded-full bg-purple-500 mt-1.5" />
                  <div>
                    <p>DPIA created</p>
                    <p className="text-muted-foreground text-xs">3 days ago</p>
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
