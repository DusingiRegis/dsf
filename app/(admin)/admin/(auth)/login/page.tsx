"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const { status } = useSession()
  const router     = useRouter()

  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    // If already logged in — go to dashboard
    if (status === "authenticated") {
      router.replace("/admin")
    }
  }, [status, router])

  // Show spinner while checking session
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // IMPORTANT — handle redirect manually
    })

    if (result?.error) {
      // Wrong credentials
      setError("Wrong email or password. Please try again.")
      setLoading(false)
    } else {
      // Success — go to dashboard
      router.replace("/admin")
    }
  }

  // Show login form only when unauthenticated
  return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0B1F3A]">
            D.E.F Real Estate
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Enter your credentials to access the dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              placeholder="admin@estatehub.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A84C] text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Login to Dashboard"
            )}
          </button>

        </form>

      </div>
    </div>
  )
}
