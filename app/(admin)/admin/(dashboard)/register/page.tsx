import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ClientRegister from "./ClientRegister"

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const role = session.user.role
  if (role !== "super_admin") {
    redirect("/")
  }

  return <ClientRegister />
}