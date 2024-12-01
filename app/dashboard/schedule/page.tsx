'use client'

import { useState } from 'react'
import { useAccounts } from '@/contexts/accounts-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { createPin } from '@/lib/pinterest'

interface PinData {
  title: string
  description: string
  link: string
  imagePath: string
}

export default function SchedulePage() {
  const { accounts, currentAccount } = useAccounts()
  const [pinsPerDay, setPinsPerDay] = useState(15)
  const [csvData, setCsvData] = useState<PinData[]>([])
  const [scheduledTimes, setScheduledTimes] = useState<Date[]>([])
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',')
      const pins = lines.slice(1).map(line => {
        const values = line.split(',')
        return {
          title: values[0],
          description: values[1],
          link: values[2],
          imagePath: values[3],
        }
      })
      setCsvData(pins)
      calculateSchedule(pins.length)
    }
    reader.readAsText(file)
  }

  const calculateSchedule = (totalPins: number) => {
    const times: Date[] = []
    let currentDate = new Date()
    currentDate.setHours(9, 0, 0, 0) // Start at 9 AM

    for (let i = 0; i < totalPins; i++) {
      if (i > 0 && i % pinsPerDay === 0) {
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
        currentDate.setHours(9, 0, 0, 0)
      }

      times.push(new Date(currentDate.getTime() + (i % pinsPerDay) * 15 * 60 * 1000))
    }

    setScheduledTimes(times)
  }

  const handleSchedule = async () => {
    if (!currentAccount || !currentAccount.boards) {
      toast({
        title: 'Error',
        description: 'No Pinterest account or boards available',
        variant: 'destructive',
      })
      return
    }

    try {
      for (let i = 0; i < csvData.length; i++) {
        const pin = csvData[i]
        const randomBoard = currentAccount.boards[Math.floor(Math.random() * currentAccount.boards.length)]
        
        await createPin(currentAccount.accessToken, randomBoard.id, {
          title: pin.title,
          description: pin.description,
          link: pin.link,
          imageUrl: pin.imagePath,
        })

        toast({
          title: 'Success',
          description: `Scheduled ${csvData.length} pins successfully`,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule pins',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Schedule Pins</h1>

      <div className="space-y-4">
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
                    onClick={() => handlePublishNow(pin)}
                  >
                    Publish Now
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(pin.id)}
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
              No scheduled pins found for this account.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

