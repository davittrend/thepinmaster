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
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Scheduled Pins</h1>
      
      {scheduledPins.length > 0 ? (
        <div className="space-y-4">
          {scheduledPins.map((pin) => (
            <div key={pin.id} className="border p-4 rounded-md">
              <h3 className="font-medium">{pin.title}</h3>
              <p className="text-sm text-gray-500">
                Scheduled for: {new Date(pin.scheduledTime).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No scheduled pins found.</p>
      )}
    </div>
  )
}

