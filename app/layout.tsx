import { AuthProvider } from "@/contexts/auth-context"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Providers } from "@/components/providers"
import "./globals.css"

export const metadata = {
  title: 'PinMaster',
  description: 'Smart Pinterest Organizer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

