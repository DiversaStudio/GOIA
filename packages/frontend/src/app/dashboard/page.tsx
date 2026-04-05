"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Lock,
  Scale,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react"

const stats = [
  {
    title: "AI Systems",
    value: "12",
    change: "+2",
    changeType: "increase",
    description: "Registered systems",
    icon: Shield,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Compliance Score",
    value: "87%",
    change: "+5%",
    changeType: "increase",
    description: "Overall compliance",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Open DPIAs",
    value: "4",
    change: "-1",
    changeType: "decrease",
    description: "Pending assessments",
    icon: Lock,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Active Alerts",
    value: "3",
    change: "+2",
    changeType: "increase",
    description: "Requires attention",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
]

const pillars = [
  {
    title: "Regulation & Compliance",
    description: "AI Systems Registry, Risk Classification",
    icon: Shield,
    href: "/dashboard/compliance",
    stats: {
      systems: 12,
      compliant: 10,
      pending: 2,
    },
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    title: "Privacy & Data Governance",
    description: "Data Flows, DPIAs, Subject Requests",
    icon: Lock,
    href: "/dashboard/privacy",
    stats: {
      flows: 28,
      dpias: 4,
      requests: 6,
    },
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    title: "Bias & Fairness",
    description: "Model Cards, Fairness Assessments",
    icon: Scale,
    href: "/dashboard/fairness",
    stats: {
      models: 8,
      assessed: 6,
      alerts: 1,
    },
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    title: "Observability & Audit",
    description: "Audit Logs, Evidence Vault",
    icon: Activity,
    href: "/dashboard/audit",
    stats: {
      events: "2.4k",
      evidence: 156,
      reports: 12,
    },
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "compliance",
    title: "Risk assessment completed",
    description: "Customer Service Chatbot v2.1",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "privacy",
    title: "New DPIA started",
    description: "Fraud Detection System",
    time: "5 hours ago",
    status: "in_progress",
  },
  {
    id: 3,
    type: "fairness",
    title: "Bias alert triggered",
    description: "Loan Approval Model - Age bias detected",
    time: "1 day ago",
    status: "alert",
  },
  {
    id: 4,
    type: "audit",
    title: "Evidence uploaded",
    description: "EU AI Act compliance documentation",
    time: "2 days ago",
    status: "completed",
  },
]

const statusColors: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-500",
  in_progress: "bg-blue-500/10 text-blue-500",
  alert: "bg-amber-500/10 text-amber-500",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your AI governance posture
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`flex size-8 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`flex items-center text-xs ${stat.changeType === 'increase' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Four Pillars */}
      <div className="grid gap-4 md:grid-cols-2">
        {pillars.map((pillar, i) => (
          <Link key={i} href={pillar.href}>
            <Card className={`card-hover h-full border-2 ${pillar.borderColor}`}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`flex size-12 items-center justify-center rounded-xl ${pillar.bgColor}`}>
                    <pillar.icon className={`size-6 ${pillar.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{pillar.title}</CardTitle>
                    <CardDescription>{pillar.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(pillar.stats).map(([key, value], j) => (
                    <div key={j} className="text-center">
                      <div className="text-xl font-semibold">{value}</div>
                      <div className="text-xs text-muted-foreground capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Activity & Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Link href="/dashboard/audit">
                <Button variant="ghost" size="sm">View all</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 size-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-emerald-500' :
                    activity.status === 'in_progress' ? 'bg-blue-500' :
                    'bg-amber-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={statusColors[activity.status]}>
                        {activity.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common governance tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" render={<Link href="/dashboard/compliance" />}>
                <Shield className="size-5 text-blue-500" />
                <span>Register AI System</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" render={<Link href="/dashboard/privacy" />}>
                <Lock className="size-5 text-emerald-500" />
                <span>Start DPIA</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" render={<Link href="/dashboard/fairness" />}>
                <Scale className="size-5 text-amber-500" />
                <span>Fairness Check</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" render={<Link href="/dashboard/audit" />}>
                <FileText className="size-5 text-rose-500" />
                <span>Upload Evidence</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
