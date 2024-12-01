'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateEmail as updateFirebaseEmail,
  updatePassword as updateFirebasePassword,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateEmail: (newEmail: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase auth not initialized')
    await signInWithEmailAndPassword(auth, email, password)
    router.push('/dashboard')
  }

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase auth not initialized')
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    router.push('/dashboard')
  }

  const signUp = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase auth not initialized')
    await createUserWithEmailAndPassword(auth, email, password)
    router.push('/dashboard')
  }

  const logout = async () => {
    if (!auth) throw new Error('Firebase auth not initialized')
    await signOut(auth)
    router.push('/')
  }

  const updateEmail = async (newEmail: string) => {
    if (!auth.currentUser) throw new Error('No user logged in')
    await updateFirebaseEmail(auth.currentUser, newEmail)
  }

  const updatePassword = async (newPassword: string) => {
    if (!auth.currentUser) throw new Error('No user logged in')
    await updateFirebasePassword(auth.currentUser, newPassword)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signInWithGoogle,
        signUp,
        logout,
        updateEmail,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

