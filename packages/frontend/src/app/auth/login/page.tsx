"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/dashboard"
    }, 1000)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary-foreground/20">
              <Shield className="size-7" />
            </div>
            <span className="text-2xl font-bold">GOIA</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            AI Governance Platform
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Comprehensive compliance, privacy, fairness, and audit management for AI systems.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "AI Systems", value: "12+" },
              { label: "Compliance", value: "87%" },
              { label: "Frameworks", value: "15+" },
              { label: "Countries", value: "50+" },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-lg bg-primary-foreground/10">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">GOIA</span>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@goia.ai"
                    defaultValue="admin@goia.ai"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    defaultValue="admin123"
                    required 
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link href="#" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-primary hover:underline">
                    Create one
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Test credentials: admin@goia.ai / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
