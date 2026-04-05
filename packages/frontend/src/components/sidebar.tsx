"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Shield,
  Lock,
  Scale,
  Activity,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "AI Systems",
    href: "/dashboard/systems",
    icon: Shield,
  },
  {
    name: "Compliance",
    href: "/dashboard/compliance",
    icon: FileText,
    children: [
      { name: "Overview", href: "/dashboard/compliance" },
      { name: "Risk Assessment", href: "/dashboard/compliance/risk" },
      { name: "Frameworks", href: "/dashboard/compliance/frameworks" },
    ]
  },
  {
    name: "Privacy",
    href: "/dashboard/privacy",
    icon: Lock,
    children: [
      { name: "Data Flows", href: "/dashboard/privacy/flows" },
      { name: "DPIA", href: "/dashboard/privacy/dpia" },
      { name: "Subject Requests", href: "/dashboard/privacy/requests" },
    ]
  },
  {
    name: "Fairness",
    href: "/dashboard/fairness",
    icon: Scale,
    children: [
      { name: "Assessments", href: "/dashboard/fairness/assessments" },
      { name: "Model Cards", href: "/dashboard/fairness/model-cards" },
      { name: "Bias Alerts", href: "/dashboard/fairness/alerts" },
    ]
  },
  {
    name: "Audit & Logs",
    href: "/dashboard/audit",
    icon: Activity,
    children: [
      { name: "Activity Logs", href: "/dashboard/audit/logs" },
      { name: "Evidence Vault", href: "/dashboard/audit/evidence" },
      { name: "Health Status", href: "/dashboard/audit/health" },
    ]
  },
]

const bottomNav = [
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    name: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn(
      "flex flex-col h-screen bg-gray-900 text-white border-r border-gray-800 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <span className="font-bold text-xl">GOIA</span>
          </Link>
        )}
        {collapsed && (
          <Shield className="h-8 w-8 text-blue-500 mx-auto" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-800"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(item.href + "/") ?? false)
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
                {!collapsed && item.children && isActive && (
                  <ul className="mt-1 ml-6 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.name}>
                        <Link
                          href={child.href}
                          className={cn(
                            "block px-3 py-1.5 text-sm rounded-md transition-colors",
                            pathname === child.href
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800"
                          )}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-800 py-4">
        <ul className="space-y-1 px-2">
          {bottomNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
