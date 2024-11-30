import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

export function MainNav() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="font-bold">
          PinMaster
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Button onClick={logout} variant="ghost">
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

