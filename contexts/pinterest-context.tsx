'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth-context'
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { fetchPinterestBoards, refreshPinterestToken } from '@/lib/pinterest'

interface PinterestAccount {
  id: string
  accessToken: string
  refreshToken: string
  expiresAt: number
  username: string
  boards?: any[]
}

interface PinterestContextType {
  accounts: PinterestAccount[]
  currentAccount: PinterestAccount | null
  setCurrentAccount: (account: PinterestAccount) => void
  addAccount: (account: PinterestAccount) => Promise<void>
  refreshBoards: () => Promise<void>
  getValidToken: (accountId: string) => Promise<string>
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
      const token = await getValidToken(currentAccount.id)
      const boards = await fetchPinterestBoards(token)
      const accountRef = doc(collection(db, 'users', user!.uid, 'pinterest_accounts'), currentAccount.id)
      await setDoc(accountRef, { ...currentAccount, boards: boards.items }, { merge: true })
      await loadAccounts()
    } catch (error) {
      console.error('Failed to refresh boards:', error)
      throw error
    }
  }

  async function getValidToken(accountId: string): Promise<string> {
    const account = accounts.find(a => a.id === accountId)
    if (!account) throw new Error('Account not found')

    if (Date.now() < account.expiresAt) {
      return account.accessToken
    }

    try {
      const newTokens = await refreshPinterestToken(account.refreshToken)
      const updatedAccount = {
        ...account,
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token,
        expiresAt: Date.now() + newTokens.expires_in * 1000
      }

      await setDoc(doc(db, 'users', user!.uid, 'pinterest_accounts', account.id), updatedAccount)
      setAccounts(prevAccounts => prevAccounts.map(a => a.id === account.id ? updatedAccount : a))
      if (currentAccount?.id === account.id) {
        setCurrentAccount(updatedAccount)
      }

      return newTokens.access_token
    } catch (error) {
      console.error('Failed to refresh token:', error)
      // Remove the account if refresh token is invalid
      if (error instanceof Error && error.message.includes('invalid_grant')) {
        await deleteDoc(doc(db, 'users', user!.uid, 'pinterest_accounts', account.id))
        setAccounts(prevAccounts => prevAccounts.filter(a => a.id !== account.id))
        if (currentAccount?.id === account.id) {
          setCurrentAccount(null)
        }
        throw new Error('Pinterest account disconnected due to invalid refresh token')
      }
      throw error
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
        getValidToken,
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

