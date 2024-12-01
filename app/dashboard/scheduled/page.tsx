'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface ScheduledPin {
  id: string
  title: string
  description: string
  scheduledTime: string
  boardId: string
}

export default function ScheduledPage() {
  const [loading, setLoading] = useState(true)
  const [scheduledPins, setScheduledPins] = useState<ScheduledPin[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const loadScheduledPins = async () => {
      if (!auth.currentUser) return

      try {
        const pinsRef = collection(db, 'users', auth.currentUser.uid, 'scheduled_pins')
        const q = query(pinsRef, where('status', '==', 'scheduled'))
        const snapshot = await getDocs(q)
        
        const pins = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ScheduledPin[]

        setScheduledPins(pins)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load scheduled pins',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    loadScheduledPins()
  }, [toast])

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Scheduled Pins</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-12 rounded-lg bg-muted"></div>
          <div className="h-12 rounded-lg bg-muted"></div>
          <div className="h-12 rounded-lg bg-muted"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Scheduled Pins</h1>
      
      {scheduledPins.length > 0 ? (
        <div className="space-y-4">
          {scheduledPins.map((pin) => (
            <div
              key={pin.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <h3 className="font-medium">{pin.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Scheduled for: {new Date(pin.scheduledTime).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: 'Coming Soon',
                      description: 'This feature is not yet implemented',
                    })
                  }}
                >
                  Publish Now
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    toast({
                      title: 'Coming Soon',
                      description: 'This feature is not yet implemented',
                    })
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            No scheduled pins found.
          </p>
        </div>
      )}
    </div>
  )
}

