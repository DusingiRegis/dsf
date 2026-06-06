"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If already logged in go straight to dashboard
    if (status === "authenticated") {
      router.push("/admin")
    }
  }, [status, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      // Wrong credentials — stay on login page
      setError("❌ Wrong email or password. Please try again.")
      setLoading(false)
    } else {
      // Login successful — go to dashboard
      router.push("/admin")
    }
  }

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0B1F3A]">
            D.E.F Real Estate
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Admin Portal — Please login to continue
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
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
              autoComplete="off"
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
              placeholder="Enter your password"
              autoComplete="off"
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
