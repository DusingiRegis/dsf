// app/api/admin/settings/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// GET — fetch current admin details
export async function GET() {
  const session = await getServerSession(authOptions)

  // Block if not logged in
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })

  return NextResponse.json(user)
}

// PUT — update admin profile (name + email)
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const body = await req.json()
  const { name, email } = body

  // Validate
  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    )
  }

  // Update in database
  const updated = await prisma.user.update({
    where: { email: session.user.email! },
    data: { name, email },
  })

  return NextResponse.json({
    message: "Profile updated successfully",
    user: {
      name: updated.name,
      email: updated.email,
    },
  })
}

// PATCH — change password
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const body = await req.json()
  const { currentPassword, newPassword, confirmPassword } = body

  // Validate
  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json(
      { error: "All password fields are required" },
      { status: 400 }
    )
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { error: "New passwords do not match" },
      { status: 400 }
    )
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "New password must be at least 6 characters" },
      { status: 400 }
    )
  }

  // Get current user with password
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  })

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  // Check current password is correct
  const passwordMatch = await bcrypt.compare(
    currentPassword,
    user.password
  )

  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    )
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Update password in database
  await prisma.user.update({
    where: { email: session.user.email! },
    data: { password: hashedPassword },
  })

  return NextResponse.json({
    message: "Password changed successfully"
  })
}
