import { ProtectedRoute } from '@/components/protected-route'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex">
        <nav className="w-64 bg-gray-100 min-h-screen p-4">
          {/* Add dashboard navigation here */}
        </nav>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </ProtectedRoute>
  )
}

