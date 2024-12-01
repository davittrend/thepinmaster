'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { usePinterest } from '@/contexts/pinterest-context'
import { exchangeCodeForToken } from '@/lib/pinterest'
import { useToast } from '@/components/ui/use-toast'

export default function CallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addAccount } = usePinterest()
  const { toast } = useToast()

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      toast({
        title: 'Error',
        description: 'No authorization code received',
        variant: 'destructive',
      })
      router.push('/dashboard/accounts')
      return
    }

    async function handleCallback() {
      try {
        const tokenData = await exchangeCodeForToken(code)
        await addAccount({
          id: tokenData.user_id,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: Date.now() + tokenData.expires_in * 1000,
          username: tokenData.username,
        })

        toast({
          title: 'Success',
          description: 'Pinterest account connected successfully',
        })
        router.push('/dashboard/accounts')
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to connect Pinterest account',
          variant: 'destructive',
        })
        router.push('/dashboard/accounts')
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Connecting your Pinterest account...</h1>
        <p className="text-muted-foreground">Please wait while we complete the setup.</p>
      </div>
    </div>
  )
}

