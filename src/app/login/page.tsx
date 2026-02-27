import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-lg font-medium">Admin Login</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with a magic link to manage tweets.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
