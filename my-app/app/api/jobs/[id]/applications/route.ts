import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};
// Get Applicants for a job
export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "jobId required" }, { status: 400 });
  }

  const applications = await prisma.application.findMany({
    where: { jobId: id },
    // select: { id: true, status: true, createdAt: true },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json({ applications, success: true });
}
