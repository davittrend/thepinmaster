import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/auth-context'
import { MainNav } from '@/components/main-nav'
import { Footer } from '@/components/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PinMaster',
  description: 'Pinterest Management Tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <MainNav />
            {children}
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

