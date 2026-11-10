import { DefaultSession } from "next-auth";
import { Role } from "@/app/generated/prisma"; // adjust path if your generated client lives elsewhere

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
