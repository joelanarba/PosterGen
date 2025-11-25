// Database Schema Types and Interfaces
// TypeScript interfaces for Firestore collections

import type { Timestamp } from 'firebase/firestore'

export type UserPlan = 'free' | 'pro' | 'business'
export type PosterStatus = 'generating' | 'completed' | 'failed'

export interface User {
  id: string // Firebase Auth UID
  email: string
  name: string
  avatar?: string // Firebase Storage URL
  plan: UserPlan
  credits: number
  totalGenerations: number
  createdAt: Timestamp
  updatedAt: Timestamp
  stripeCustomerId?: string
  emailVerified: boolean
}

export interface Poster {
  id: string
  userId: string // Reference to users collection
  title: string
  prompt: string
  imageUrl: string // Firebase Storage URL
  thumbnailUrl?: string
  size: {
    width: number
    height: number
    preset?: string
  }
  style?: string
  status: PosterStatus
  createdAt: Timestamp
  updatedAt: Timestamp
  metadata?: {
    generationTime: number
    model: string
  }
}

export interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnailUrl: string
  isPremium: boolean
  createdAt: Timestamp
}

// Firestore document data (without server timestamps)
export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type CreatePosterData = Omit<Poster, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTemplateData = Omit<Template, 'id' | 'createdAt'>

// Update types (partial data)
export type UpdateUserData = Partial<Omit<User, 'id' | 'createdAt'>>
export type UpdatePosterData = Partial<Omit<Poster, 'id' | 'userId' | 'createdAt'>>
