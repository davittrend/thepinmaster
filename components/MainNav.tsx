import Link from 'next/link'

export function MainNav() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">PinMaster</Link>
          <div className="space-x-4">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/login">Sign In</Link>
            <Link href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

