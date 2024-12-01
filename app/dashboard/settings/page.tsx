'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { usePinterest } from '@/contexts/pinterest-context'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { user, updateEmail, updatePassword } = useAuth()
  const { accounts, currentAccount, setCurrentAccount } = usePinterest()
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const { toast } = useToast()

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateEmail(newEmail)
      toast({
        title: 'Success',
        description: 'Email updated successfully',
      })
      setNewEmail('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update email',
        variant: 'destructive',
      })
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updatePassword(newPassword)
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      })
      setNewPassword('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update password',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">User Settings</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Update Email</h2>
        <form onSubmit={handleEmailChange} className="space-y-2">
          <Label htmlFor="newEmail">New Email</Label>
          <Input
            id="newEmail"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <Button type="submit">Update Email</Button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button type="submit">Change Password</Button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Connected Pinterest Accounts</h2>
        {accounts.map((account) => (
          <div key={account.id} className="flex items-center justify-between p-4 border rounded">
            <span>{account.username}</span>
            <Button
              variant="outline"
              onClick={() => setCurrentAccount(account)}
            >
              {currentAccount?.id === account.id ? 'Current' : 'Set as Current'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

