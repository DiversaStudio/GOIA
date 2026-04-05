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
  Activity,
  Upload,
  Download,
  FileText,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react"

const auditLogs = [
  {
    id: "log-001",
    timestamp: "2024-03-15 14:32:22",
    action: "RISK_ASSESSMENT_COMPLETED",
    user: "admin@goia.ai",
    resource: "Customer Service Chatbot",
    status: "success",
  },
  {
    id: "log-002",
    timestamp: "2024-03-15 13:45:10",
    action: "DPIA_CREATED",
    user: "compliance@goia.ai",
    resource: "Fraud Detection System",
    status: "success",
  },
  {
    id: "log-003",
    timestamp: "2024-03-15 11:22:05",
    action: "BIAS_ALERT_TRIGGERED",
    user: "system",
    resource: "Loan Approval Assistant",
    status: "warning",
  },
  {
    id: "log-004",
    timestamp: "2024-03-15 10:15:33",
    action: "EVIDENCE_UPLOADED",
    user: "admin@goia.ai",
    resource: "EU AI Act Documentation",
    status: "success",
  },
  {
    id: "log-005",
    timestamp: "2024-03-14 16:50:22",
    action: "SYSTEM_REGISTERED",
    user: "admin@goia.ai",
    resource: "Recommendation Engine",
    status: "success",
  },
  {
    id: "log-006",
    timestamp: "2024-03-14 14:30:00",
    action: "COMPLIANCE_CHECK_FAILED",
    user: "system",
    resource: "Loan Approval Assistant",
    status: "error",
  },
]

const evidenceItems = [
  {
    id: "ev-001",
    name: "EU AI Act Risk Assessment",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: "2024-03-15",
    system: "Customer Service Chatbot",
  },
  {
    id: "ev-002",
    name: "DPIA Report Q1 2024",
    type: "PDF",
    size: "1.8 MB",
    uploadedAt: "2024-03-14",
    system: "Multiple",
  },
  {
    id: "ev-003",
    name: "Model Training Data Manifest",
    type: "XLSX",
    size: "456 KB",
    uploadedAt: "2024-03-13",
    system: "Fraud Detection System",
  },
  {
    id: "ev-004",
    name: "Fairness Assessment Results",
    type: "PDF",
    size: "890 KB",
    uploadedAt: "2024-03-12",
    system: "Recommendation Engine",
  },
]

const systemHealth = [
  { system: "Customer Service Chatbot", health: 98, status: "healthy" },
  { system: "Fraud Detection System", health: 95, status: "healthy" },
  { system: "Loan Approval Assistant", health: 72, status: "degraded" },
  { system: "Recommendation Engine", health: 99, status: "healthy" },
]

export default function AuditPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Observability & Audit</h1>
          <p className="text-muted-foreground">
            Audit logs, evidence vault, and system health monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Export Logs
          </Button>
          <Button className="gap-2">
            <Upload className="size-4" />
            Upload Evidence
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Audit Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">2,431</div>
              <Activity className="size-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Evidence Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">156</div>
              <FileText className="size-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">12</div>
              <Shield className="size-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-emerald-600">98%</div>
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Complete log of all governance activities</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="size-4" />
                Search
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="size-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action.replace(/_/g, ' ')}</Badge>
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      log.status === 'success' ? 'bg-emerald-500/10 text-emerald-600' :
                      log.status === 'warning' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-red-500/10 text-red-600'
                    }>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Evidence Vault & System Health */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Evidence Vault */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Evidence Vault</CardTitle>
                <CardDescription>Compliance documentation and artifacts</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {evidenceItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <FileText className="size-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type} • {item.size} • {item.uploadedAt}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time monitoring of AI systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {systemHealth.map((system, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{system.system}</span>
                      <span className={`text-sm font-bold ${
                        system.health >= 90 ? 'text-emerald-600' :
                        system.health >= 70 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {system.health}%
                      </span>
                    </div>
                    <Progress value={system.health} className="h-2" />
                  </div>
                  {system.status === 'healthy' ? (
                    <CheckCircle2 className="size-5 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="size-5 text-amber-500" />
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
