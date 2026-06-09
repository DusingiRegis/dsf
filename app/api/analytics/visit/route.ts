import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOf30Days = new Date(startOfToday);
    startOf30Days.setDate(startOf30Days.getDate() - 30);

    const [
      totalVisits,
      todayVisits,
      visitsByPage,
      visitsPerDay,
    ] = await Promise.all([
      prisma.pageVisit.count(),
      prisma.pageVisit.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.pageVisit.groupBy({
        by: ["page"],
        _count: { _all: true },
        orderBy: { _count: { _all: "desc" } },
        take: 5,
      }),
      prisma.pageVisit.groupBy({
        by: ["createdAt"],
        _count: { _all: true },
        where: { createdAt: { gte: startOf30Days } },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // Process visits per day
    const dailyVisitsMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const date = new Date(startOf30Days);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      dailyVisitsMap.set(dateStr, 0);
    }
    visitsPerDay.forEach((visit) => {
      const dateStr = visit.createdAt.toISOString().split("T")[0];
      const current = dailyVisitsMap.get(dateStr) || 0;
      dailyVisitsMap.set(dateStr, current + visit._count._all);
    });
    const dailyVisits = Array.from(dailyVisitsMap.entries()).map(
      ([date, count]) => ({ date, count })
    );

    return NextResponse.json({
      totalVisits,
      todayVisits,
      visitsByPage: visitsByPage.map((v) => ({
        page: v.page,
        count: v._count._all,
      })),
      dailyVisits,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { page, referrer, userAgent } = data;

    // Get IP address
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = hashIP(ip);

    await prisma.pageVisit.create({
      data: {
        page,
        referrer,
        userAgent,
        ipHash,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to record visit" }, { status: 500 });
  }
}
