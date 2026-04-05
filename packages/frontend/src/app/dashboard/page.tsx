"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Lock,
  Scale,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react"
import { auditService, complianceService, type DashboardSummary, type AISystem } from "@/lib/api-client"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null)
  const [systems, setSystems] = useState<AISystem[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch dashboard summary and systems in parallel
        const [summaryRes, systemsRes] = await Promise.all([
          auditService.getDashboardSummary(),
          complianceService.listSystems({ limit: 10 }),
        ])
        
        setDashboardData(summaryRes)
        setSystems(systemsRes.items)
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const riskColors: Record<string, string> = {
    minimal: "bg-green-100 text-green-800",
    limited: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    unacceptable: "bg-red-100 text-red-800",
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = {
    totalSystems: dashboardData?.total_systems || 0,
    compliantSystems: dashboardData?.compliant_systems || 0,
    pendingAssessments: dashboardData?.pending_assessments || 0,
    triggeredAlerts: dashboardData?.triggered_alerts || 0,
    complianceScore: dashboardData?.compliance_score || 0,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Overview of your AI governance posture</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Register New AI System
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total AI Systems</CardTitle>
            <Shield className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSystems}</div>
            <p className="text-xs text-gray-500">
              {stats.compliantSystems} compliant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Assessments</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAssessments}</div>
            <p className="text-xs text-gray-500">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.triggeredAlerts}</div>
            <p className="text-xs text-gray-500">
              Bias alerts triggered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.complianceScore.toFixed(1)}%</div>
            <p className="text-xs text-gray-500">
              Average across all systems
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4 Pillars Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Pillar 1: Regulation & Compliance */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base">Regulation & Compliance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Systems registered</span>
                <span className="font-medium">{dashboardData?.pillar_stats?.compliance?.systems_registered || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Assessments pending</span>
                <span className="font-medium text-orange-600">
                  {dashboardData?.pillar_stats?.compliance?.assessments_pending || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Systems by risk level</span>
                <span className="font-medium">
                  {Object.entries(dashboardData?.systems_by_risk || {}).map(([risk, count]) => (
                    <span key={risk} className="mr-1">{risk}: {count}</span>
                  ))}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full">
              View Compliance <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Pillar 2: Privacy & Data Governance */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-base">Privacy & Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Data flows</span>
                <span className="font-medium">{dashboardData?.pillar_stats?.privacy?.data_flows || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>DPIAs completed</span>
                <span className="font-medium text-orange-600">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Subject requests</span>
                <span className="font-medium">-</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full">
              View Privacy <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Pillar 3: Bias & Fairness */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Scale className="h-5 w-5 text-green-500" />
              <CardTitle className="text-base">Bias & Fairness</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Model cards</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fairness assessments</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bias alerts</span>
                <span className="font-medium text-red-600">
                  {dashboardData?.pillar_stats?.fairness?.alerts_triggered || 0} triggered
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full">
              View Fairness <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Pillar 4: Observability & Audit */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-base">Audit & Logs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Events logged (30d)</span>
                <span className="font-medium">
                  {dashboardData?.pillar_stats?.audit?.events_logged_30d?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Evidence items</span>
                <span className="font-medium">{dashboardData?.pillar_stats?.audit?.evidence_items || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>System health</span>
                <span className="font-medium text-green-600">All healthy</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full">
              View Audit <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Systems Table */}
      <Card>
        <CardHeader>
          <CardTitle>AI Systems Registry</CardTitle>
          <CardDescription>All registered AI systems and their compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          {systems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No AI systems registered yet.</p>
              <Button className="mt-4" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Register First System
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Risk Level</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Compliance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {systems.map((system) => (
                    <tr key={system.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{system.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskColors[system.risk_level] || "bg-gray-100 text-gray-800"}`}>
                          {system.risk_level}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize">{system.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          system.compliance_status === "compliant" ? "bg-green-100 text-green-800" :
                          system.compliance_status === "non_compliant" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {system.compliance_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest events across all pillars</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData?.recent_activity && dashboardData.recent_activity.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recent_activity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    activity.type === "compliance" ? "bg-blue-500" :
                    activity.type === "privacy" ? "bg-purple-500" :
                    activity.type === "fairness" ? "bg-green-500" :
                    "bg-orange-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity to display.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
