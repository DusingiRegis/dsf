import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ClientActivity from "./ClientActivity"

export default async function ActivityPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const role = session.user.role
  if (role !== "admin" && role !== "super_admin") {
    redirect("/")
  }

  return <ClientActivity />
}