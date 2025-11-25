"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  type Timestamp
} from "firebase/firestore"
import { db } from "./firebase-config"
import { useAuth } from "./auth-context"

export interface Poster {
  id: string
  userId: string
  title: string
  description: string // Mapped from prompt
  eventType: string // Optional in schema but used in UI
  imageUrl: string
  createdAt: string
  style: string
  size: string
}

interface PosterStorageContextType {
  posters: Poster[]
  isLoading: boolean
  addPoster: (poster: Omit<Poster, "id" | "createdAt">) => Promise<Poster | null>
  deletePoster: (id: string) => Promise<void>
  getPostersByUser: (userId: string) => Poster[]
}

const PosterStorageContext = createContext<PosterStorageContextType | undefined>(undefined)

export function PosterStorageProvider({ children }: { children: ReactNode }) {
  const [posters, setPosters] = useState<Poster[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setPosters([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const q = query(
      collection(db, "posters"),
      where("userId", "==", user.id),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosters = snapshot.docs.map((doc) => {
        const data = doc.data()
        // Convert Firestore Timestamp to ISO string for frontend compatibility
        const createdAt = data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        
        return {
          id: doc.id,
          userId: data.userId,
          title: data.title || "Untitled Poster",
          description: data.prompt || "",
          eventType: data.metadata?.eventType || "General",
          imageUrl: data.imageUrl,
          createdAt,
          style: data.style || "Modern",
          size: data.size?.preset || "Instagram Story"
        } as Poster
      })
      setPosters(fetchedPosters)
      setIsLoading(false)
    }, (error) => {
      console.error("Error fetching posters:", error)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const addPoster = useCallback(async (posterData: Omit<Poster, "id" | "createdAt">) => {
    if (!user) return null

    try {
      // Map frontend model to Firestore schema
      const firestoreData = {
        userId: user.id,
        title: posterData.title,
        prompt: posterData.description,
        imageUrl: posterData.imageUrl,
        style: posterData.style,
        size: {
          width: 1080, // Default or calculate based on preset
          height: 1920,
          preset: posterData.size
        },
        status: 'completed',
        metadata: {
          eventType: posterData.eventType,
          model: 'dall-e-3'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, "posters"), firestoreData)
      
      // Return the new poster object (optimistic or constructed)
      return {
        ...posterData,
        id: docRef.id,
        createdAt: new Date().toISOString()
      }
    } catch (error) {
      console.error("Error adding poster:", error)
      return null
    }
  }, [user])

  const deletePoster = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, "posters", id))
    } catch (error) {
      console.error("Error deleting poster:", error)
    }
  }, [])

  const getPostersByUser = useCallback(
    (userId: string) => {
      // Since we only fetch current user's posters, we just return the state
      // This assumes we only view our own posters in the dashboard
      return posters.filter((p) => p.userId === userId)
    },
    [posters],
  )

  return (
    <PosterStorageContext.Provider value={{ posters, isLoading, addPoster, deletePoster, getPostersByUser }}>
      {children}
    </PosterStorageContext.Provider>
  )
}

export function usePosterStorage() {
  const context = useContext(PosterStorageContext)
  if (context === undefined) {
    throw new Error("usePosterStorage must be used within a PosterStorageProvider")
  }
  return context
}
