"use client"

import { useState, useEffect } from "react"

export default function ClientSettings() {
  // Profile state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [profileMsg, setProfileMsg] = useState("")
  const [profileError, setProfileError] = useState("")
  const [profileLoad, setProfileLoad] = useState(false)

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMsg, setPasswordMsg] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordLoad, setPasswordLoad] = useState(false)
  // Show password toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Fetch current admin details on page load
  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch("/api/admin/settings")
      const data = await res.json()
      setName(data.name || "")
      setEmail(data.email || "")
    }
    fetchDetails()
  }, [])

  // Save profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoad(true)
    setProfileMsg("")
    setProfileError("")

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })

    const data = await res.json()

    if (res.ok) {
      setProfileMsg("✅ Profile updated successfully!")
    } else {
      setProfileError(data.error || "Something went wrong")
    }

    setProfileLoad(false)
  }

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoad(true)
    setPasswordMsg("")
    setPasswordError("")

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setPasswordMsg("✅ Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      setPasswordError(data.error || "Something went wrong")
    }

    setPasswordLoad(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-[#0B1F3A] mb-8">
        Account Settings
      </h1>

      {/* ── PROFILE SECTION ── */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#0B1F3A] mb-4">
          👤 Edit Profile
        </h2>

        {/* Success */}
        {profileMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">
            {profileMsg}
          </div>
        )}

        {/* Error */}
        {profileError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {profileError}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email */}
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
              required
            />
          </div>

          <button
            type="submit"
            disabled={profileLoad}
            className="w-full bg-[#0B1F3A] text-white py-3 rounded-lg font-semibold hover:bg-navy-800 transition disabled:opacity-50"
          >
            {profileLoad ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* ── CHANGE PASSWORD SECTION ── */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-[#0B1F3A] mb-4">
          🔒 Change Password
        </h2>

        {/* Success */}
        {passwordMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">
            {passwordMsg}
          </div>
        )}

        {/* Error */}
        {passwordError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          {/* Current Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showCurrentPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordLoad}
            className="w-full bg-[#C9A84C] text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {passwordLoad ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  )
}