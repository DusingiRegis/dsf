// app/(admin)/admin/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ClientDashboard from "./ClientDashboard"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const role = session.user.role
  if (role !== "admin" && role !== "super_admin") {
    redirect("/")
  }

  return (
    <ClientDashboard />
  )
}
