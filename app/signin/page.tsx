import { AuthForm } from "@/components/auth-form"

export default function SignInPage() {
  return (
    <main className="flex-1 flex items-center justify-center py-16">
      <AuthForm mode="login" />
    </main>
  )
}

