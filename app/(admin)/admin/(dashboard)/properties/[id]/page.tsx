import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import ClientEditProperty from "./ClientEditProperty"

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const role = session.user.role
  if (role !== "admin" && role !== "super_admin") {
    redirect("/")
  }

  const property = await prisma.property.findUnique({
    where: { id: params.id }
  })

  if (!property) {
    redirect("/admin/properties")
  }

  return <ClientEditProperty property={property} />
}
