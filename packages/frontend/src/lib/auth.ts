"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  email: string
  name: string
  role: string
  organization?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("goia_token")
          localStorage.removeItem("goia_user")
        }
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: "goia-auth",
    }
  )
)
