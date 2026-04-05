"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Shield,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react"

const aiSystems = [
  {
    id: "sys-001",
    name: "Customer Service Chatbot",
    vendor: "OpenAI",
    modelType: "LLM",
    riskLevel: "high",
    status: "compliant",
    lastAssessment: "2024-03-15",
  },
  {
    id: "sys-002",
    name: "Fraud Detection System",
    vendor: "Internal",
    modelType: "ML Classifier",
    riskLevel: "high",
    status: "in_review",
    lastAssessment: "2024-03-10",
  },
  {
    id: "sys-003",
    name: "Product Recommendation Engine",
    vendor: "AWS",
    modelType: "Neural Network",
    riskLevel: "limited",
    status: "compliant",
    lastAssessment: "2024-02-28",
  },
  {
    id: "sys-004",
    name: "Document Classification Tool",
    vendor: "Google Cloud",
    modelType: "NLP",
    riskLevel: "minimal",
    status: "compliant",
    lastAssessment: "2024-02-20",
  },
  {
    id: "sys-005",
    name: "Loan Approval Assistant",
    vendor: "Internal",
    modelType: "Decision Tree",
    riskLevel: "high",
    status: "non_compliant",
    lastAssessment: "2024-01-15",
  },
]

const riskColors = {
  minimal: "bg-green-500/10 text-green-600 border-green-500/20",
  limited: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  unacceptable: "bg-red-500/10 text-red-600 border-red-500/20",
}

const statusColors = {
  compliant: "bg-emerald-500/10 text-emerald-600",
  in_review: "bg-blue-500/10 text-blue-600",
  non_compliant: "bg-red-500/10 text-red-600",
  pending: "bg-amber-500/10 text-amber-600",
}

export default function CompliancePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Systems Registry</h1>
          <p className="text-muted-foreground">
            Manage and monitor your AI systems compliance status
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Register System
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-emerald-600">10</div>
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <Clock className="size-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Non-Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-red-600">1</div>
              <AlertTriangle className="size-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Search className="size-4" />
          Search
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="size-4" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered AI Systems</CardTitle>
          <CardDescription>
            All AI systems registered under EU AI Act and other frameworks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>System Name</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Model Type</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Assessment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aiSystems.map((system) => (
                <TableRow key={system.id} className="group">
                  <TableCell>
                    <Link href={`/dashboard/systems/${system.id}`} className="font-medium hover:underline">
                      {system.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{system.vendor}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{system.modelType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={riskColors[system.riskLevel as keyof typeof riskColors]}>
                      {system.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[system.status as keyof typeof statusColors]}>
                      {system.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{system.lastAssessment}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
