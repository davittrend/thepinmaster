'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth-context'
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { fetchPinterestBoards, refreshPinterestToken } from '@/lib/pinterest'

interface PinterestAccount {
  id: string
  accessToken: string
  refreshToken: string
  username: string
  boards?: any[]
}

interface PinterestContextType {
  accounts: PinterestAccount[]
  currentAccount: PinterestAccount | null
  setCurrentAccount: (account: PinterestAccount) => void
  addAccount: (account: PinterestAccount) => Promise<void>
  refreshBoards: () => Promise<void>
}

const PinterestContext = createContext<PinterestContextType | null>(null)

export function PinterestProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<PinterestAccount[]>([])
  const [currentAccount, setCurrentAccount] = useState<PinterestAccount | null>(null)

  useEffect(() => {
    if (user) {
      loadAccounts()
    }
  }, [user])

  async function loadAccounts() {
    if (!user) return

    const accountsRef = collection(db, 'users', user.uid, 'pinterest_accounts')
    const snapshot = await getDocs(accountsRef)
    const loadedAccounts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PinterestAccount[]

    setAccounts(loadedAccounts)
    if (loadedAccounts.length > 0 && !currentAccount) {
      setCurrentAccount(loadedAccounts[0])
    }
  }

  async function addAccount(account: PinterestAccount) {
    if (!user) return

    const accountRef = doc(collection(db, 'users', user.uid, 'pinterest_accounts'))
    await setDoc(accountRef, account)
    await loadAccounts()
  }

  async function refreshBoards() {
    if (!currentAccount) return

    try {
      const boards = await fetchPinterestBoards(currentAccount.accessToken)
      const accountRef = doc(collection(db, 'users', user!.uid, 'pinterest_accounts'), currentAccount.id)
      await setDoc(accountRef, { ...currentAccount, boards: boards.items }, { merge: true })
      await loadAccounts()
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        // Token expired, try to refresh
        const newTokens = await refreshPinterestToken(currentAccount.refreshToken)
        const updatedAccount = { ...currentAccount, accessToken: newTokens.access_token, refreshToken: newTokens.refresh_token }
        await setDoc(doc(db, 'users', user!.uid, 'pinterest_accounts', currentAccount.id), updatedAccount)
        setCurrentAccount(updatedAccount)
        // Retry fetching boards with new token
        const boards = await fetchPinterestBoards(newTokens.access_token)
        await setDoc(doc(db, 'users', user!.uid, 'pinterest_accounts', currentAccount.id), { ...updatedAccount, boards: boards.items }, { merge: true })
        await loadAccounts()
      } else {
        throw error
      }
    }
  }

  return (
    <PinterestContext.Provider
      value={{
        accounts,
        currentAccount,
        setCurrentAccount,
        addAccount,
        refreshBoards,
      }}
    >
      {children}
    </PinterestContext.Provider>
  )
}

export const usePinterest = () => {
  const context = useContext(PinterestContext)
  if (!context) {
    throw new Error('usePinterest must be used within a PinterestProvider')
  }
  return context
}

