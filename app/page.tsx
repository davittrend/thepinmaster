import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Welcome to PinMaster</h1>
      <p className="mb-8">Smart Pinterest Organizer</p>
      <div className="space-x-4">
        <Link href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</Link>
        <Link href="/login" className="bg-gray-200 text-gray-800 px-4 py-2 rounded">Login</Link>
      </div>
    </main>
  )
}

