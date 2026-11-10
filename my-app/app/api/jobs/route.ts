// 1. Fixed casing: Changed 'prismaClient' to 'PrismaClient'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";

const JobTypeEnum = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"]);
const WorkplaceTypeEnum = z.enum(["ON_SITE", "REMOTE", "HYBRID"]);

const createJobSchema = z
  .object({
    title: z.string().min(3).max(120).trim(),
    description: z.string().min(20).max(10_000).trim(),
    type: JobTypeEnum,
    workplace: WorkplaceTypeEnum,
    location: z.string().min(2).max(120).trim(),

    salaryMin: z.number().int().nonnegative().optional(),
    salaryMax: z.number().int().nonnegative().optional(),

    tags: z.array(z.string().min(1).max(30)).max(20).default([]),
    responsibilities: z.array(z.string().min(1).max(500)).max(30).default([]),
    requirements: z.array(z.string().min(1).max(500)).max(30).default([]),
  })
  .refine((data) => data.salaryMin == null || data.salaryMax == null || data.salaryMin <= data.salaryMax, {
    message: "salaryMin must be <= salaryMax",
    path: ["salaryMin"],
  });

// Get All Jobs
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: {},
      orderBy: { postedOn: "desc" },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true,
            industry: true,
            logoColor: true,
            employees: true,
          },
        },
        postedBy: {
          select: { id: true, name: true, image: true },
        },
      },
    });
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs: ", error);
    return NextResponse.json({ message: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // never trust the client
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse body safely
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Validate
    const parsed = createJobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }
    const data = parsed.data;

    // Authorization — does this user actually own the company?
    const company = await prisma.company.findFirst({
      where: {
        ownerId: session.user.id,
      },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found or you do not have permission" }, { status: 403 });
    }

    // Create — explicitly whitelist fields, never spread the raw body
    const job = await prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        workplace: data.workplace,
        location: data.location,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        tags: data.tags,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        postedById: session.user.id,
        companyId: company.id,
        // isActive, isFeatured, postedOn, createdAt, updatedAt -> server defaults
      },
      select: {
        id: true,
        title: true,
        postedOn: true,
        isActive: true,
        companyId: true,
      },
    });

    return NextResponse.json(
      { job, success: true, message: "Job created successfully" },
      {
        status: 201,
      },
    );
  } catch (err) {
    console.error("[POST /api/jobs]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
