import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Get Job
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: {
        select: { id: true, name: true, logo: true, logoColor: true },
      },
    },
  });

  if (!job) {
    return NextResponse.json({ message: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ job });
}

// PUT /api/jobs/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedJob = await prisma.job.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Error updating job: ", error);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/jobs/[id]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job: ", error);
    return NextResponse.json({ message: "Failed to delete job" }, { status: 500 });
  }
}
