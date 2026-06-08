import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ClientRegister from "./ClientRegister"

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  if (!session.user.isSuperAdmin) {
    redirect("/")
  }

  return <ClientRegister />
}