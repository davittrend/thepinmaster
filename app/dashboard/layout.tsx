'use client'

import { useAuth } from "@/contexts/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { redirect } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-1">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}

