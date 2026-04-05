import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Shield, Lock, Scale, Activity, 
  ArrowRight, CheckCircle2, Sparkles,
  Globe, FileText, AlertTriangle
} from "lucide-react"

const pillars = [
  {
    title: "Regulation & Compliance",
    description: "Comprehensive AI system registry, risk classification, and compliance management for global AI regulations.",
    icon: Shield,
    features: ["AI Systems Registry", "Risk Assessment", "EU AI Act Ready", "Global Frameworks"],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Privacy & Data Governance",
    description: "Data flow mapping, DPIA automation, and privacy compliance management for AI systems.",
    icon: Lock,
    features: ["Data Flow Mapping", "DPIA Automation", "Subject Requests", "Consent Management"],
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Bias & Fairness",
    description: "Model cards, fairness assessments, and bias detection to ensure responsible AI deployment.",
    icon: Scale,
    features: ["Model Cards", "Fairness Metrics", "Bias Alerts", "Drift Monitoring"],
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Observability & Audit",
    description: "Complete audit trails, evidence vault, and system health monitoring for accountability.",
    icon: Activity,
    features: ["Audit Logs", "Evidence Vault", "Health Monitoring", "Compliance Reports"],
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
]

const features = [
  {
    icon: Globe,
    title: "Global Regulatory Coverage",
    description: "EU AI Act, Brazil's AI Bill, African Union Framework, and more.",
  },
  {
    icon: FileText,
    title: "Automated Documentation",
    description: "Generate compliance docs, DPIAs, and model cards automatically.",
  },
  {
    icon: AlertTriangle,
    title: "Real-time Alerts",
    description: "Get notified of compliance gaps, bias detection, and risks.",
  },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-50 glass border-b">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="size-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight">GOIA</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#pillars" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pillars
              </Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="container py-24 md:py-32">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm mb-8 animate-fade-in">
              <Sparkles className="size-4 text-accent" />
              <span>AI Governance for the Modern Enterprise</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-in stagger-1">
              Govern AI with
              <span className="block text-gradient mt-2">Confidence & Clarity</span>
            </h1>
            
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed animate-in stagger-2">
              GOIA provides comprehensive AI governance across compliance, privacy, fairness, and auditability. 
              Built for the era of global AI regulation.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-in stagger-3">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Launch Dashboard
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="#pillars">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl animate-in stagger-4">
              {[
                { value: "4", label: "Governance Pillars" },
                { value: "15+", label: "Regulatory Frameworks" },
                { value: "100%", label: "Audit Coverage" },
                { value: "24/7", label: "Monitoring" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container py-24 bg-muted/30">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Why GOIA?</h2>
              <p className="mt-4 text-muted-foreground">
                Built for compliance teams, AI engineers, and risk managers
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="relative overflow-hidden card-hover">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <feature.icon className="size-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section id="pillars" className="container py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Four Pillars of AI Governance</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                A comprehensive framework covering all aspects of responsible AI deployment and management
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {pillars.map((pillar, i) => (
                <Card key={i} className="relative overflow-hidden card-hover group">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`flex size-12 items-center justify-center rounded-xl ${pillar.bgColor}`}>
                        <pillar.icon className={`size-6 ${pillar.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{pillar.title}</CardTitle>
                        <CardDescription className="mt-2">{pillar.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-2 gap-2">
                      {pillar.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className={`size-4 ${pillar.color}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl">
            <Card className="relative overflow-hidden bg-primary text-primary-foreground">
              <div className="absolute inset-0 bg-dots opacity-10" />
              <CardContent className="relative p-12 text-center">
                <h2 className="text-2xl font-bold">Ready to Govern Your AI Systems?</h2>
                <p className="mt-4 opacity-90">
                  Start your AI governance journey today with GOIA's comprehensive platform.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/auth/register">
                    <Button variant="secondary" size="lg" className="gap-2">
                      Create Free Account
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="size-5" />
              <span className="font-semibold">GOIA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Global AI Oversight Initiative - AI Governance Platform
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>v0.0.1</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
