import { AuthForm } from "@/components/auth-form"

export default function SignUpPage() {
  return (
    <main className="flex-1 flex items-center justify-center py-16">
      <AuthForm mode="signup" />
    </main>
  )
}

