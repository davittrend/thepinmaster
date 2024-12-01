'use client'

import { useEffect } from 'react'
import { usePinterest } from '@/contexts/pinterest-context'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getPinterestAuthUrl } from '@/lib/pinterest'
import { useToast } from '@/components/ui/use-toast'

export default function AccountsPage() {
  const { accounts, currentAccount, setCurrentAccount, refreshBoards } = usePinterest()
  const { toast } = useToast()

  useEffect(() => {
    if (currentAccount) {
      refreshBoards().catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to refresh boards',
          variant: 'destructive',
        })
      })
    }
  }, [currentAccount])

  const handleAuthClick = async () => {
    const authUrl = await getPinterestAuthUrl()
    window.location.href = authUrl
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pinterest Accounts</h1>
        <Button onClick={handleAuthClick}>
          Add Pinterest Account
        </Button>
      </div>

      {accounts.length > 0 ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Account</label>
            <Select
              value={currentAccount?.id}
              onValueChange={(value) => {
                const account = accounts.find(a => a.id === value)
                if (account) setCurrentAccount(account)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentAccount?.boards && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Boards</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {currentAccount.boards.map((board) => (
                  <div
                    key={board.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <h3 className="font-medium">{board.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {board.description || 'No description'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            No Pinterest accounts connected. Click the button above to add one.
          </p>
        </div>
      )}
    </div>
  )
}

