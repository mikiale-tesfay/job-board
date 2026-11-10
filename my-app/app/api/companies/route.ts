import { auth } from "@/auth";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const session = await auth();
    const ownerId = session?.user?.id;

    if (!ownerId) {
      return NextResponse.json({ error: "You must be signed in to register a company." }, { status: 401 });
    }

    const { name, description, logo, logoColor, employees, industry, founded, website, address } = body;

    if (!name || !description) {
      return NextResponse.json({ error: "Company name and description are required." }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: {
        ownerId,
        name,
        description,
        logo: logo || null,
        logoColor: logoColor || "#000000",
        employees: employees || null,
        industry: industry || null,
        founded: founded || null,
        website: website || null,
        address: address || null,
      },
    });

    await prisma.user.update({
      where: { id: ownerId },
      data: { role: "RECRUITER" },
    });

    return NextResponse.json({ company }, { status: 201 });
  } catch (err: any) {
    // Handle unique constraint on `name`
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "A company with that name already exists." }, { status: 409 });
    }
    console.error("[POST /api/companies]", err);
    return NextResponse.json({ error: "Failed to create company profile." }, { status: 500 });
  }
}
