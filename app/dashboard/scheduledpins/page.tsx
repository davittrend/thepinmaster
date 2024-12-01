'use client'

import { useState, useEffect } from 'react'
import { usePinterest } from '@/contexts/pinterest-context'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ScheduledPin } from '@/lib/scheduler'
import { createPin } from '@/lib/pinterest'
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ScheduledPinsPage() {
  const { user } = useAuth()
  const { accounts, currentAccount, setCurrentAccount, getValidToken } = usePinterest()
  const [scheduledPins, setScheduledPins] = useState<ScheduledPin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (currentAccount) {
      loadScheduledPins()
    }
  }, [currentAccount])

  const loadScheduledPins = async () => {
    if (!user || !currentAccount) return

    setLoading(true)
    setError(null)

    try {
      const pinsRef = collection(db, 'users', user.uid, 'scheduled_pins')
      const q = query(pinsRef, where('accountId', '==', currentAccount.id), where('status', '==', 'scheduled'))
      const snapshot = await getDocs(q)
      const pins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduledPin))
      setScheduledPins(pins)
    } catch (err) {
      setError('Failed to load scheduled pins. Please try again.')
      toast({
        title: 'Error',
        description: 'Failed to load scheduled pins',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePublishNow = async (pin: ScheduledPin) => {
    if (!currentAccount) return

    try {
      const validToken = await getValidToken(currentAccount.id)
      await createPin(validToken, currentAccount.boards[0].id, pin)
      await updateDoc(doc(db, 'users', user!.uid, 'scheduled_pins', pin.id), { status: 'published', publishedAt: new Date() })
      toast({
        title: 'Success',
        description: 'Pin published successfully',
      })
      await loadScheduledPins()
    } catch (error) {
      if (error instanceof Error && error.message.includes('Pinterest account disconnected')) {
        toast({
          title: 'Error',
          description: 'Pinterest account disconnected. Please reconnect your account.',
          variant: 'destructive',
        })
        router.push('/dashboard/accounts')
      } else {
        toast({
          title: 'Error',
          description: 'Failed to publish pin',
          variant: 'destructive',
        })
      }
    }
  }

  const handleDelete = async (pin: ScheduledPin) => {
    try {
      await deleteDoc(doc(db, 'users', user!.uid, 'scheduled_pins', pin.id))
      toast({
        title: 'Success',
        description: 'Pin deleted successfully',
      })
      await loadScheduledPins()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete pin',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Button onClick={loadScheduledPins} className="mt-4">Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Scheduled Pins</h1>
      
      <div>
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

      {scheduledPins.length > 0 ? (
        <div className="space-y-4">
          {scheduledPins.map((pin) => (
            <div key={pin.id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <h3 className="font-medium">{pin.title}</h3>
                <p className="text-sm text-gray-500">Scheduled for: {new Date(pin.scheduledTime).toLocaleString()}</p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => handlePublishNow(pin)}>Publish Now</Button>
                <Button variant="destructive" onClick={() => handleDelete(pin)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No scheduled pins for this account.</p>
      )}
    </div>
  )
}

