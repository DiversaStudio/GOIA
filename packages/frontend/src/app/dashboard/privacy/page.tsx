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
  Lock,
  Plus,
  FileText,
  Users,
  Database,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react"

const dataFlows = [
  {
    id: "df-001",
    name: "Customer Data Pipeline",
    source: "CRM System",
    destination: "ML Training Pipeline",
    dataType: "PII",
    status: "approved",
    lastReview: "2024-03-10",
  },
  {
    id: "df-002",
    name: "Transaction Analytics",
    source: "Payment Gateway",
    destination: "Fraud Detection Model",
    dataType: "Financial",
    status: "approved",
    lastReview: "2024-03-05",
  },
  {
    id: "df-003",
    name: "User Behavior Tracking",
    source: "Web Analytics",
    destination: "Recommendation Engine",
    dataType: "Behavioral",
    status: "pending_review",
    lastReview: "2024-02-28",
  },
]

const dpias = [
  {
    id: "dpia-001",
    name: "Customer Service Chatbot DPIA",
    system: "Customer Service Chatbot",
    status: "completed",
    riskLevel: "medium",
    createdAt: "2024-02-15",
  },
  {
    id: "dpia-002",
    name: "Fraud Detection System DPIA",
    system: "Fraud Detection System",
    status: "in_progress",
    riskLevel: "high",
    createdAt: "2024-03-01",
  },
  {
    id: "dpia-003",
    name: "Loan Approval Assistant DPIA",
    system: "Loan Approval Assistant",
    status: "pending",
    riskLevel: "high",
    createdAt: "2024-03-10",
  },
]

const subjectRequests = [
  { type: "Access", count: 24, pending: 3 },
  { type: "Erasure", count: 12, pending: 2 },
  { type: "Portability", count: 8, pending: 1 },
  { type: "Correction", count: 5, pending: 0 },
]

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Privacy & Data Governance</h1>
          <p className="text-muted-foreground">
            Data flow mapping, DPIAs, and privacy compliance management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="size-4" />
            New Data Flow
          </Button>
          <Button className="gap-2">
            <FileText className="size-4" />
            Start DPIA
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Data Flows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">28</div>
              <Database className="size-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active DPIAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">4</div>
              <FileText className="size-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subject Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">6</div>
              <span className="text-xs text-amber-600">pending</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-emerald-600">92%</div>
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Flows */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Flows</CardTitle>
              <CardDescription>Tracked data movements across AI systems</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flow Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Data Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataFlows.map((flow) => (
                <TableRow key={flow.id}>
                  <TableCell className="font-medium">{flow.name}</TableCell>
                  <TableCell className="text-muted-foreground">{flow.source}</TableCell>
                  <TableCell className="text-muted-foreground">{flow.destination}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{flow.dataType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={flow.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}>
                      {flow.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{flow.lastReview}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DPIAs & Subject Requests */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* DPIAs */}
        <Card>
          <CardHeader>
            <CardTitle>Data Protection Impact Assessments</CardTitle>
            <CardDescription>Privacy risk assessments for AI systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {dpias.map((dpia) => (
                <div key={dpia.id} className="flex items-start gap-4 p-3 rounded-lg border">
                  <div className={`mt-0.5 size-2 rounded-full ${
                    dpia.status === 'completed' ? 'bg-emerald-500' :
                    dpia.status === 'in_progress' ? 'bg-blue-500' :
                    'bg-amber-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{dpia.name}</p>
                    <p className="text-sm text-muted-foreground">{dpia.system}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={dpia.riskLevel === 'high' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'}>
                        {dpia.riskLevel} risk
                      </Badge>
                      <span className="text-xs text-muted-foreground">{dpia.createdAt}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Requests</CardTitle>
            <CardDescription>GDPR data subject request tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {subjectRequests.map((request, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{request.type}</span>
                      <span className="text-sm text-muted-foreground">{request.count} total</span>
                    </div>
                    <Progress value={(request.count - request.pending) / request.count * 100} className="h-2" />
                  </div>
                  {request.pending > 0 && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600">
                      {request.pending} pending
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
