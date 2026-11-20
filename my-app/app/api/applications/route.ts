// app/api/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const jobId = body?.jobId as string | undefined;
  const coverLetter = body?.coverLetter as string | undefined;

  if (!jobId) {
    return NextResponse.json({ message: "jobId is required" }, { status: 400 });
  }

  if (!coverLetter || coverLetter.trim().length < 50) {
    return NextResponse.json({ message: "Cover letter must be at least 50 characters" }, { status: 400 });
  }

  try {
    const application = await prisma.application.create({
      data: {
        jobId,
        userId: session.user.id,
        coverLetter,
        status: "PENDING",
      },
      select: { id: true, status: true, createdAt: true },
    });
    return NextResponse.json({ application, success: true }, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ message: "You've already applied to this job" }, { status: 409 });
    }
    return NextResponse.json({ message: "Failed to submit application" }, { status: 500 });
  }
}

// Get Your Applications
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          description: true,
          tags: true,
        },
      },
    },
  });

  return NextResponse.json({ applications, success: true });
}
