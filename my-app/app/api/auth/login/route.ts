import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

// Post a User
export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    const newuser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return NextResponse.json({ user: newuser, status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create a user." }, { status: 500 });
  }
}
