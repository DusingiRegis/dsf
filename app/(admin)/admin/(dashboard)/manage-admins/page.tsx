import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ClientManageAdmins from "./ClientManageAdmins"

export default async function ManageAdminsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const role = session.user.role
  if (role !== "super_admin") {
    redirect("/")
  }

  return <ClientManageAdmins />
}