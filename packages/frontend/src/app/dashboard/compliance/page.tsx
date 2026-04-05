"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api, AISystem, ComplianceFramework } from "@/lib/api"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
  FileText,
} from "lucide-react"

const riskColors: Record<string, string> = {
  minimal: "bg-green-100 text-green-800 border-green-200",
  limited: "bg-blue-100 text-blue-800 border-blue-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  unacceptable: "bg-red-100 text-red-800 border-red-200",
}

export default function CompliancePage() {
  const [systems, setSystems] = useState<AISystem[]>([])
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [systemsRes, frameworksRes] = await Promise.all([
          api.get<{ total: number; items: AISystem[] }>("/api/v1/compliance/ai-systems"),
          api.get<{ total: number; items: ComplianceFramework[] }>("/api/v1/compliance/frameworks"),
        ])
        setSystems(systemsRes.items)
        setFrameworks(frameworksRes.items)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = {
    total: systems.length,
    compliant: systems.filter(s => s.compliance_status === "compliant").length,
    pending: systems.filter(s => s.compliance_status === "pending").length,
    highRisk: systems.filter(s => s.risk_level === "high" || s.risk_level === "unacceptable").length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Regulation & Compliance</h1>
          <p className="text-gray-500">AI Systems Registry, Risk Classification, and Compliance Management</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/compliance/risk">
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Risk Wizard
            </Button>
          </Link>
          <Link href="/dashboard/systems/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register AI System
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.compliant}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Pending Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">High/Unacceptable Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
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
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Vendor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Risk Level</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Compliance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {systems.map((system) => (
                    <tr key={system.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{system.name}</div>
                          <div className="text-xs text-gray-500">{system.model_type}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{system.vendor}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${riskColors[system.risk_level]}`}>
                          {system.risk_level}
                        </span>
                      </td>
                      <td className="py-3 px-4 capitalize">{system.status}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          system.compliance_status === "compliant" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {system.compliance_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/dashboard/systems/${system.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Frameworks */}
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Frameworks</CardTitle>
          <CardDescription>Supported compliance frameworks and regulations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {frameworks.map((framework) => (
              <div
                key={framework.id}
                className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{framework.framework_name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{framework.region} • v{framework.version}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    framework.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {framework.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{framework.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/compliance/risk">
          <Card className="hover:border-blue-300 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Risk Classification Wizard</h3>
                  <p className="text-sm text-gray-500">Classify AI system risk levels</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/compliance/frameworks">
          <Card className="hover:border-blue-300 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Compliance Templates</h3>
                  <p className="text-sm text-gray-500">Pre-built assessment templates</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/audit/evidence">
          <Card className="hover:border-blue-300 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Evidence Vault</h3>
                  <p className="text-sm text-gray-500">Compliance documentation</p>
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
