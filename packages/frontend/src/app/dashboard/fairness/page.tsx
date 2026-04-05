"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Scale,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  FileText,
  BarChart3,
} from "lucide-react"

const modelCards = [
  {
    id: "mc-001",
    name: "Customer Service Chatbot v2.1",
    type: "LLM",
    fairnessScore: 92,
    lastAssessment: "2024-03-15",
    status: "published",
  },
  {
    id: "mc-002",
    name: "Fraud Detection Model v3.0",
    type: "Classifier",
    fairnessScore: 78,
    lastAssessment: "2024-03-10",
    status: "review",
  },
  {
    id: "mc-003",
    name: "Loan Approval Assistant",
    type: "Decision Tree",
    fairnessScore: 65,
    lastAssessment: "2024-02-28",
    status: "alert",
  },
  {
    id: "mc-004",
    name: "Recommendation Engine",
    type: "Neural Network",
    fairnessScore: 88,
    lastAssessment: "2024-02-20",
    status: "published",
  },
]

const biasAlerts = [
  {
    id: "alert-001",
    model: "Loan Approval Assistant",
    type: "Age Bias",
    severity: "high",
    detected: "2024-03-14",
    status: "open",
    description: "Model shows 15% higher rejection rate for applicants over 50",
  },
  {
    id: "alert-002",
    model: "Fraud Detection Model",
    type: "Geographic Bias",
    severity: "medium",
    detected: "2024-03-12",
    status: "investigating",
    description: "Higher false positive rate for transactions from specific regions",
  },
]

const fairnessMetrics = [
  { metric: "Demographic Parity", score: 85, trend: "up" },
  { metric: "Equal Opportunity", score: 88, trend: "up" },
  { metric: "Disparate Impact", score: 72, trend: "down" },
  { metric: "Calibration", score: 91, trend: "stable" },
]

export default function FairnessPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Bias & Fairness</h1>
          <p className="text-muted-foreground">
            Model cards, fairness assessments, and bias monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="size-4" />
            New Assessment
          </Button>
          <Button className="gap-2">
            <FileText className="size-4" />
            Generate Model Card
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Model Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">8</div>
              <FileText className="size-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Fairness Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-emerald-600">82%</div>
              <TrendingUp className="size-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">6</div>
              <BarChart3 className="size-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-amber-600">2</div>
              <AlertTriangle className="size-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bias Alerts */}
      {biasAlerts.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              <CardTitle>Active Bias Alerts</CardTitle>
            </div>
            <CardDescription>Detected fairness issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {biasAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 p-4 rounded-lg bg-background border">
                  <div className={`mt-0.5 size-2 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{alert.model}</p>
                      <Badge variant="outline" className={alert.severity === 'high' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{alert.type}</Badge>
                      <span className="text-xs text-muted-foreground">Detected: {alert.detected}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Investigate</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Cards & Metrics */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Model Cards Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Model Cards</CardTitle>
            <CardDescription>Transparency documentation for AI models</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Fairness Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelCards.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{model.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={model.fairnessScore} className="h-2 w-16" />
                        <span className={`text-sm font-medium ${
                          model.fairnessScore >= 80 ? 'text-emerald-600' :
                          model.fairnessScore >= 70 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {model.fairnessScore}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        model.status === 'published' ? 'bg-emerald-500/10 text-emerald-600' :
                        model.status === 'alert' ? 'bg-red-500/10 text-red-600' :
                        'bg-blue-500/10 text-blue-600'
                      }>
                        {model.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Fairness Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Fairness Metrics</CardTitle>
            <CardDescription>Overall fairness indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {fairnessMetrics.map((metric, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <span className="text-sm font-bold">{metric.score}%</span>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                  </div>
                  {metric.trend === 'up' && <TrendingUp className="size-4 text-emerald-500" />}
                  {metric.trend === 'down' && <TrendingDown className="size-4 text-red-500" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
