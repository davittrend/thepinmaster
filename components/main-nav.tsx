'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

export function MainNav() {
  const { user, logout, loading } = useAuth()
  const pathname = usePathname()

  if (loading) {
    return (
      <nav className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="font-bold">
            PinMaster
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="font-bold">
          PinMaster
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/about" className={pathname === '/about' ? 'text-primary' : ''}>
            About
          </Link>
          <Link href="/contact" className={pathname === '/contact' ? 'text-primary' : ''}>
            Contact
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className={pathname.startsWith('/dashboard') ? 'text-primary' : ''}>
                Dashboard
              </Link>
              <Button onClick={() => logout()} variant="ghost">
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
