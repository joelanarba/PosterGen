"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export interface Poster {
  id: string
  userId: string
  title: string
  description: string
  eventType: string
  imageUrl: string
  createdAt: string
  style: string
  size: string
}

interface PosterStorageContextType {
  posters: Poster[]
  addPoster: (poster: Omit<Poster, "id" | "createdAt">) => Poster
  deletePoster: (id: string) => void
  getPostersByUser: (userId: string) => Poster[]
}

const PosterStorageContext = createContext<PosterStorageContextType | undefined>(undefined)

export function PosterStorageProvider({ children }: { children: ReactNode }) {
  const [posters, setPosters] = useState<Poster[]>([])

  useEffect(() => {
    const storedPosters = localStorage.getItem("postergen_posters")
    if (storedPosters) {
      setPosters(JSON.parse(storedPosters))
    }
  }, [])

  const addPoster = useCallback((posterData: Omit<Poster, "id" | "createdAt">) => {
    const newPoster: Poster = {
      ...posterData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    setPosters((prev) => {
      const updated = [newPoster, ...prev]
      localStorage.setItem("postergen_posters", JSON.stringify(updated))
      return updated
    })

    return newPoster
  }, [])

  const deletePoster = useCallback((id: string) => {
    setPosters((prev) => {
      const updated = prev.filter((p) => p.id !== id)
      localStorage.setItem("postergen_posters", JSON.stringify(updated))
      return updated
    })
  }, [])

  const getPostersByUser = useCallback(
    (userId: string) => {
      return posters.filter((p) => p.userId === userId)
    },
    [posters],
  )

  return (
    <PosterStorageContext.Provider value={{ posters, addPoster, deletePoster, getPostersByUser }}>
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
