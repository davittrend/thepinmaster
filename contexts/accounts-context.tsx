'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth-context'
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface PinterestAccount {
  id: string
  accessToken: string
  username: string
  boards?: any[]
}

interface AccountsContextType {
  accounts: PinterestAccount[]
  currentAccount: PinterestAccount | null
  setCurrentAccount: (account: PinterestAccount) => void
  addAccount: (account: PinterestAccount) => Promise<void>
  refreshBoards: () => Promise<void>
}

const AccountsContext = createContext<AccountsContextType | null>(null)

export function AccountsProvider({ children }: { children: React.ReactNode }) {
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

    const boards = await getBoards(currentAccount.accessToken)
    const accountRef = doc(collection(db, 'users', user.uid, 'pinterest_accounts'), currentAccount.id)
    await setDoc(accountRef, { ...currentAccount, boards: boards.items }, { merge: true })
    await loadAccounts()
  }

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        currentAccount,
        setCurrentAccount,
        addAccount,
        refreshBoards,
      }}
    >
      {children}
    </AccountsContext.Provider>
  )
}

export const useAccounts = () => {
  const context = useContext(AccountsContext)
  if (!context) {
    throw new Error('useAccounts must be used within an AccountsProvider')
  }
  return context
}

