"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scale, AlertTriangle, FileText, Plus, ArrowRight, CheckCircle, XCircle } from "lucide-react"
import { api } from "@/lib/api"

export default function FairnessPage() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [modelCards, setModelCards] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentsRes, cardsRes, alertsRes] = await Promise.all([
          api.get<{ items: any[] }>("/api/v1/fairness/assessments").catch(() => ({ items: [] })),
          api.get<{ items: any[] }>("/api/v1/fairness/model-cards").catch(() => ({ items: [] })),
          api.get<{ items: any[] }>("/api/v1/fairness/alerts").catch(() => ({ items: [] })),
        ])
        setAssessments(assessmentsRes.items)
        setModelCards(cardsRes.items)
        setAlerts(alertsRes.items)
      } catch (error) {
        console.error("Failed to fetch fairness data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = {
    assessments: assessments.length || 2,
    modelCards: modelCards.length || 1,
    publishedCards: modelCards.filter(c => c.is_published).length || 1,
    activeAlerts: alerts.filter(a => a.is_triggered).length || 1,
  }

  const severityColors: Record<string, string> = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bias & Fairness</h1>
          <p className="text-gray-500">Fairness assessments, model cards, and bias monitoring</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/fairness/model-cards/new">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Create Model Card
            </Button>
          </Link>
          <Link href="/dashboard/fairness/assessments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Fairness Assessments</CardTitle>
              <Scale className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assessments}</div>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Model Cards</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.modelCards}</div>
            <p className="text-xs text-gray-500">{stats.publishedCards} published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-red-600">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.activeAlerts}</div>
            <p className="text-xs text-gray-500">Triggered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Fairness Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">82%</div>
            <p className="text-xs text-gray-500">Average across systems</p>
          </CardContent>
        </Card>
      </div>

      {/* Bias Alerts */}
      {stats.activeAlerts > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-800">Active Bias Alerts</CardTitle>
            </div>
            <CardDescription className="text-red-700">
              The following bias alerts have been triggered and require attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium">Demographic Parity Violation</div>
                    <div className="text-sm text-gray-500">Recruitment Screening AI • Threshold: 0.8, Current: 0.65</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs border ${severityColors.high}`}>
                    High
                  </span>
                  <Button size="sm" variant="outline">Acknowledge</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fairness Assessments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fairness Assessments</CardTitle>
              <CardDescription>Assess and monitor bias in AI systems</CardDescription>
            </div>
            <Link href="/dashboard/fairness/assessments">
              <Button variant="ghost" size="sm">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-3">
              {[
                { name: "Credit Scoring Model", score: 85, status: "completed", isFair: true },
                { name: "Recruitment Screening AI", score: 65, status: "completed", isFair: false },
                { name: "Fraud Detection System", score: 78, status: "in_progress", isFair: true },
              ].map((assessment, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {assessment.isFair ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium">{assessment.name}</div>
                      <div className="text-sm text-gray-500">Fairness Score: {assessment.score}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${assessment.score >= 80 ? 'bg-green-500' : assessment.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${assessment.score}%` }}
                      />
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      assessment.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {assessment.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Model Cards</CardTitle>
              <CardDescription>Documentation for transparency and accountability</CardDescription>
            </div>
            <Link href="/dashboard/fairness/model-cards">
              <Button variant="ghost" size="sm">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: "Credit Scoring Model v3.0", published: true, date: "2024-01-15" },
              { name: "Fraud Detection v2.1", published: true, date: "2024-01-10" },
              { name: "Recruitment AI v1.5", published: false, date: "Draft" },
            ].map((card, idx) => (
              <div key={idx} className="p-4 border rounded-lg hover:border-green-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{card.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{card.date}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    card.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {card.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="ghost">View</Button>
                  <Button size="sm" variant="ghost">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/fairness/assessments/new">
          <Card className="hover:border-green-300 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Scale className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Run Assessment</h3>
                  <p className="text-sm text-gray-500">Analyze fairness metrics</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/fairness/model-cards/new">
          <Card className="hover:border-green-300 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Create Model Card</h3>
                  <p className="text-sm text-gray-500">Document your model</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/fairness/alerts">
          <Card className="hover:border-green-300 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium">Configure Alerts</h3>
                  <p className="text-sm text-gray-500">Set bias thresholds</p>
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
