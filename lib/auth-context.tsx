"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan: "free" | "pro" | "business"
  credits: number
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("postergen_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check stored users
    const users = JSON.parse(localStorage.getItem("postergen_users") || "[]")
    const existingUser = users.find((u: User & { password: string }) => u.email === email)

    if (!existingUser || existingUser.password !== password) {
      return { success: false, error: "Invalid email or password" }
    }

    const { password: _, ...userWithoutPassword } = existingUser
    setUser(userWithoutPassword)
    localStorage.setItem("postergen_user", JSON.stringify(userWithoutPassword))
    return { success: true }
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem("postergen_users") || "[]")

    if (users.some((u: User) => u.email === email)) {
      return { success: false, error: "Email already exists" }
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      plan: "free",
      credits: 5,
      createdAt: new Date().toISOString(),
    }

    users.push({ ...newUser, password })
    localStorage.setItem("postergen_users", JSON.stringify(users))
    localStorage.setItem("postergen_user", JSON.stringify(newUser))
    setUser(newUser)

    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("postergen_user")
  }, [])

  const updateUser = useCallback(
    (updates: Partial<User>) => {
      if (!user) return

      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("postergen_user", JSON.stringify(updatedUser))

      // Update in users list too
      const users = JSON.parse(localStorage.getItem("postergen_users") || "[]")
      const idx = users.findIndex((u: User) => u.id === user.id)
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates }
        localStorage.setItem("postergen_users", JSON.stringify(users))
      }
    },
    [user],
  )

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
