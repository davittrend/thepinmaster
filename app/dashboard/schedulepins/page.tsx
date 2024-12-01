'use client'

import { useState } from 'react'
import { usePinterest } from '@/contexts/pinterest-context'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { parseCSV, PinData } from '@/lib/csv-parser'
import { schedulePins, ScheduledPin } from '@/lib/scheduler'

export default function SchedulePinsPage() {
  const { accounts, currentAccount, setCurrentAccount, saveScheduledPin } = usePinterest()
  const [file, setFile] = useState<File | null>(null)
  const [pinsPerDay, setPinsPerDay] = useState(10)
  const [scheduledPins, setScheduledPins] = useState<ScheduledPin[]>([])
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleSchedule = async () => {
    if (!file || !currentAccount) {
      toast({
        title: 'Error',
        description: 'Please select a file and an account',
        variant: 'destructive',
      })
      return
    }

    try {
      const content = await file.text()
      const pins = parseCSV(content)
      const scheduled = schedulePins(pins, pinsPerDay)
      setScheduledPins(scheduled)

      for (const pin of scheduled) {
        await saveScheduledPin(pin)
      }

      toast({
        title: 'Success',
        description: `Scheduled ${scheduled.length} pins`,
      })
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
      <h1 className="text-3xl font-bold">Schedule Pins</h1>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="account">Pinterest Account</Label>
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
                  {account.user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="csv">CSV File</Label>
          <Input id="csv" type="file" accept=".csv" onChange={handleFileChange} />
        </div>

        <div>
          <Label htmlFor="pinsPerDay">Pins per Day</Label>
          <Input
            id="pinsPerDay"
            type="number"
            min={1}
            max={20}
            value={pinsPerDay}
            onChange={(e) => setPinsPerDay(Number(e.target.value))}
          />
        </div>

        <Button onClick={handleSchedule}>Schedule Pins</Button>
      </div>

      {scheduledPins.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Scheduled Pins</h2>
          <div className="space-y-2">
            {scheduledPins.map((pin, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h3 className="font-medium">{pin.title}</h3>
                <p className="text-sm text-gray-500">Scheduled for: {pin.scheduledTime}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

