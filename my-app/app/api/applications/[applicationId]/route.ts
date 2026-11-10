import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

interface RouteParams {
  params: Promise<{ applicationId: string }>;
}

// Get Single Application
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { applicationId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ message: "jobId required" }, { status: 400 });
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { id: true, status: true, createdAt: true },
  });

  return NextResponse.json({ application, success: true });
}
