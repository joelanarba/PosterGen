import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-context"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth, storage } from "./firebase-config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "./firebase-config"

export function useRequireAuth(redirectUrl = "/login") {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectUrl)
    }
  }, [user, isLoading, router, redirectUrl])

  return { user, isLoading }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true }
  } catch (error: any) {
    console.error("Error sending password reset email:", error)
    return { success: false, error: error.message }
  }
}

export async function uploadAvatar(userId: string, file: File) {
  try {
    const storageRef = ref(storage, `avatars/${userId}/${file.name}`)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    
    // Update user profile
    await updateDoc(doc(db, "users", userId), {
      avatar: downloadURL
    })
    
    return { success: true, url: downloadURL }
  } catch (error: any) {
    console.error("Error uploading avatar:", error)
    return { success: false, error: error.message }
  }
}
