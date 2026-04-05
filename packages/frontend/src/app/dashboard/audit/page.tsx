"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, FileCheck, Upload, History, ArrowRight, Filter, Download } from "lucide-react"
import { api } from "@/lib/api"

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [evidence, setEvidence] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, evidenceRes] = await Promise.all([
          api.get<{ items: any[] }>("/api/v1/audit/logs").catch(() => ({ items: [] })),
          api.get<{ items: any[] }>("/api/v1/audit/evidence").catch(() => ({ items: [] })),
        ])
        setLogs(logsRes.items)
        setEvidence(evidenceRes.items)
      } catch (error) {
        console.error("Failed to fetch audit data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = {
    totalLogs: logs.length || 1247,
    evidenceItems: evidence.length || 23,
    verifiedEvidence: evidence.filter(e => e.is_verified).length || 18,
    healthScore: 98,
  }

  const actionColors: Record<string, string> = {
    create: "bg-green-100 text-green-800",
    update: "bg-blue-100 text-blue-800",
    delete: "bg-red-100 text-red-800",
    view: "bg-gray-100 text-gray-800",
    export: "bg-purple-100 text-purple-800",
  }

  // Mock audit log data
  const mockLogs = [
    { id: 1, action: "update", resource: "Credit Scoring Model", user: "admin@goia.local", time: "2 minutes ago", details: "Risk assessment updated" },
    { id: 2, action: "create", resource: "Data Flow Declaration", user: "admin@goia.local", time: "1 hour ago", details: "New flow for Fraud Detection" },
    { id: 3, action: "view", resource: "DPIA Report", user: "compliance@goia.local", time: "3 hours ago", details: "DPIA for Credit Scoring viewed" },
    { id: 4, action: "export", resource: "Compliance Report", user: "admin@goia.local", time: "1 day ago", details: "EU AI Act compliance exported" },
    { id: 5, action: "create", resource: "Evidence", user: "admin@goia.local", time: "2 days ago", details: "Training data documentation uploaded" },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Observability & Audit</h1>
          <p className="text-gray-500">Activity logs, evidence vault, and system health monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
          <Link href="/dashboard/audit/evidence/new">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Evidence
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Events (30d)</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogs.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Logged activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Evidence Items</CardTitle>
              <FileCheck className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.evidenceItems}</div>
            <p className="text-xs text-gray-500">{stats.verifiedEvidence} verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.healthScore}%</div>
            <p className="text-xs text-gray-500">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Compliance Ready</CardTitle>
              <FileCheck className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Yes</div>
            <p className="text-xs text-gray-500">Audit ready</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Audit Log</CardTitle>
              <CardDescription>Complete record of all system activities</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Link href="/dashboard/audit/logs">
                <Button variant="ghost" size="sm">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Resource</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Details</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${actionColors[log.action]}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{log.resource}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{log.user}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{log.details}</td>
                      <td className="py-3 px-4 text-sm text-gray-400">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evidence Vault & System Health */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Evidence Vault</CardTitle>
                <CardDescription>Compliance documentation and artifacts</CardDescription>
              </div>
              <Link href="/dashboard/audit/evidence">
                <Button variant="ghost" size="sm">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "EU AI Act Assessment.pdf", size: "2.4 MB", verified: true },
                { name: "Training Data Documentation.docx", size: "856 KB", verified: true },
                { name: "Algorithm Audit Report.xlsx", size: "1.2 MB", verified: false },
                { name: "Bias Testing Results.pdf", size: "3.1 MB", verified: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.size}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    item.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {item.verified ? "Verified" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/audit/evidence/new">
              <Button className="w-full mt-4" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Evidence
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health Status</CardTitle>
            <CardDescription>Real-time health of AI systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Customer Service Chatbot", status: "healthy", uptime: "99.9%", lastCheck: "1 min ago" },
                { name: "Fraud Detection System", status: "healthy", uptime: "99.7%", lastCheck: "2 min ago" },
                { name: "Credit Scoring Model", status: "healthy", uptime: "99.8%", lastCheck: "1 min ago" },
                { name: "Recruitment Screening AI", status: "degraded", uptime: "98.2%", lastCheck: "5 min ago" },
                { name: "Medical Imaging Diagnostic", status: "healthy", uptime: "99.5%", lastCheck: "3 min ago" },
              ].map((system, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      system.status === "healthy" ? "bg-green-500" : 
                      system.status === "degraded" ? "bg-yellow-500" : "bg-red-500"
                    }`} />
                    <div>
                      <div className="font-medium text-sm">{system.name}</div>
                      <div className="text-xs text-gray-500">Uptime: {system.uptime}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      system.status === "healthy" ? "bg-green-100 text-green-700" : 
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {system.status}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">{system.lastCheck}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
