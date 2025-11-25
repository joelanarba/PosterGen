"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  type User as FirebaseUser,
  sendEmailVerification
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./firebase-config"
import { type User, type CreateUserData } from "./db-schema"

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        setUser({ id: userDoc.id, ...userDoc.data() } as User)
      } else {
        // If user exists in Auth but not Firestore (rare edge case or first Google login)
        // We handle creation in the login/signup flows, but this is a fallback
        console.warn("User profile not found in Firestore")
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser)
      
      if (currentUser) {
        await fetchUserProfile(currentUser.uid)
      } else {
        setUser(null)
      }
      
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const refreshProfile = async () => {
    if (firebaseUser) {
      await fetchUserProfile(firebaseUser.uid)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error: any) {
      console.error("Login error:", error)
      return { success: false, error: error.message }
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user profile in Firestore
      const userData: CreateUserData = {
        email,
        name,
        plan: "free",
        credits: 5, // Free credits for new users
        totalGenerations: 0,
        emailVerified: false
      }

      await setDoc(doc(db, "users", newUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      // Send verification email
      try {
        await sendEmailVerification(newUser)
      } catch (e) {
        console.error("Error sending verification email:", e)
      }

      // Update local state immediately
      setUser({ 
        id: newUser.uid, 
        ...userData, 
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
        updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any
      })
      
      return { success: true }
    } catch (error: any) {
      console.error("Signup error:", error)
      return { success: false, error: error.message }
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const { user: googleUser } = await signInWithPopup(auth, provider)
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, "users", googleUser.uid))
      
      if (!userDoc.exists()) {
        // Create new profile for Google user
        const userData: CreateUserData = {
          email: googleUser.email || "",
          name: googleUser.displayName || "User",
          avatar: googleUser.photoURL || undefined,
          plan: "free",
          credits: 5,
          totalGenerations: 0,
          emailVerified: googleUser.emailVerified
        }

        await setDoc(doc(db, "users", googleUser.uid), {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
        
        setUser({ 
          id: googleUser.uid, 
          ...userData, 
          createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
          updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any
        })
      }
      
      return { success: true }
    } catch (error: any) {
      console.error("Google login error:", error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setFirebaseUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateUser = async (data: Partial<User>) => {
    if (!user) return

    try {
      await setDoc(doc(db, "users", user.id), data, { merge: true })
      // Local state will be updated by onSnapshot listener in a real app, 
      // but here we rely on fetchUserProfile or manual update if we don't have a listener on the user doc.
      // My implementation uses fetchUserProfile on auth state change.
      // Let's manually update local state for immediate feedback
      setUser(prev => prev ? { ...prev, ...data } : null)
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser, 
      isLoading, 
      login, 
      signup, 
      loginWithGoogle, 
      logout,
      refreshProfile,
      updateUser
    }}>
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
