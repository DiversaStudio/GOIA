"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Database, FileCheck, Users, Plus, ArrowRight, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"

export default function PrivacyPage() {
  const [dataFlows, setDataFlows] = useState<any[]>([])
  const [dpias, setDpias] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flowsRes, dpiasRes, requestsRes] = await Promise.all([
          api.get<{ items: any[] }>("/api/v1/privacy/data-flows").catch(() => ({ items: [] })),
          api.get<{ items: any[] }>("/api/v1/privacy/dpias").catch(() => ({ items: [] })),
          api.get<{ items: any[] }>("/api/v1/privacy/subject-requests").catch(() => ({ items: [] })),
        ])
        setDataFlows(flowsRes.items)
        setDpias(dpiasRes.items)
        setRequests(requestsRes.items)
      } catch (error) {
        console.error("Failed to fetch privacy data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Mock stats for demo
  const stats = {
    dataFlows: dataFlows.length || 3,
    dpias: dpias.length || 1,
    pendingDpias: dpias.filter(d => d.status === "draft" || d.status === "in_review").length || 2,
    subjectRequests: requests.length || 2,
  }

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    in_review: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Privacy & Data Governance</h1>
          <p className="text-gray-500">Data flows, DPIA, and data subject request management</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/privacy/flows/new">
            <Button variant="outline">
              <Database className="mr-2 h-4 w-4" />
              New Data Flow
            </Button>
          </Link>
          <Link href="/dashboard/privacy/dpia/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New DPIA
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Data Flows</CardTitle>
              <Database className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dataFlows}</div>
            <p className="text-xs text-gray-500">Declared flows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">DPIAs</CardTitle>
              <FileCheck className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dpias}</div>
            <p className="text-xs text-gray-500">Assessments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-orange-600">Pending DPIAs</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingDpias}</div>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Subject Requests</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subjectRequests}</div>
            <p className="text-xs text-gray-500">Open requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Flow Declarations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Flow Declarations</CardTitle>
              <CardDescription>Track how personal data flows through your AI systems</CardDescription>
            </div>
            <Link href="/dashboard/privacy/flows">
              <Button variant="ghost" size="sm">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : dataFlows.length === 0 ? (
            <div className="text-center py-8">
              <Database className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No data flows declared yet</p>
              <Link href="/dashboard/privacy/flows/new">
                <Button className="mt-4" size="sm">Create Data Flow</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {dataFlows.slice(0, 5).map((flow, idx) => (
                <div key={flow.id || idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{flow.data_type || "Personal Data"}</div>
                    <div className="text-sm text-gray-500">
                      {flow.source || "System"} → {flow.destination || "External"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      flow.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {flow.is_approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* DPIA Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data Protection Impact Assessments</CardTitle>
            <CardDescription>GDPR-compliant DPIA for high-risk AI systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((_, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">DPIA #{idx + 1}</div>
                    <div className="text-sm text-gray-500">Credit Scoring Model</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    idx === 0 ? statusColors.approved : 
                    idx === 1 ? statusColors.in_review : 
                    statusColors.draft
                  }`}>
                    {idx === 0 ? "Approved" : idx === 1 ? "In Review" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Subject Requests</CardTitle>
            <CardDescription>Manage GDPR/privacy requests from individuals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "Access", status: "pending", date: "2 days ago" },
                { type: "Erasure", status: "completed", date: "1 week ago" },
                { type: "Portability", status: "in_progress", date: "3 days ago" },
              ].map((req, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{req.type} Request</div>
                    <div className="text-sm text-gray-500">{req.date}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    req.status === "completed" ? "bg-green-100 text-green-800" :
                    req.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {req.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/privacy/dpia/new">
          <Card className="hover:border-purple-300 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Create DPIA</h3>
                  <p className="text-sm text-gray-500">Start new assessment</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/privacy/requests">
          <Card className="hover:border-purple-300 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Subject Requests</h3>
                  <p className="text-sm text-gray-500">Manage requests</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/privacy/flows">
          <Card className="hover:border-purple-300 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Data Flows</h3>
                  <p className="text-sm text-gray-500">View declarations</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
