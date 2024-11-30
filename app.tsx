import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/auth-context"
import { MainNav } from "./components/main-nav"
import { Footer } from "./components/footer"
import { AuthForm } from "./components/auth-form"
import { DashboardSidebar } from "./components/dashboard/sidebar"
import { ProtectedRoute } from "./components/protected-route"

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <MainNav />
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex-1">
                  <h1>Welcome to PinMaster</h1>
                </div>
              }
            />
            <Route path="/login" element={<AuthForm mode="login" />} />
            <Route path="/signup" element={<AuthForm mode="signup" />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route
                        path="accounts"
                        element={<div>Accounts Content</div>}
                      />
                      <Route
                        path="schedule"
                        element={<div>Schedule Pins Content</div>}
                      />
                      <Route
                        path="scheduled"
                        element={<div>Scheduled Pins Content</div>}
                      />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<div>About Content</div>} />
            <Route path="/contact" element={<div>Contact Content</div>} />
            <Route path="/terms" element={<div>Terms Content</div>} />
            <Route path="/privacy" element={<div>Privacy Policy Content</div>} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

