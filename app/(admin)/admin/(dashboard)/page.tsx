// app/(admin)/admin/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ClientDashboard from "./ClientDashboard"

export default async function AdminDashboard() {

  // Double check session on server side
  const session = await getServerSession(authOptions)

  // Not logged in — send to login page
  if (!session) {
    redirect("/admin/login")
  }

  // Logged in — show dashboard
  return (
    <ClientDashboard />
  )
}
