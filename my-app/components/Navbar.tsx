"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const classes = "font-semibold nowrap";

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-3 border-b border-border bg-background text-foreground">
      {/* Left */}
      <div className="flex items-center gap-3">
        <span onClick={() => setMobileMenu(!mobileMenu)} className="p-1 border rounded cursor-pointer hover:bg-muted">
          <Menu size={18} />
        </span>
        <Link href={"/"}>
          <h2 className="text-2xl bold">JobRabit</h2>
        </Link>
      </div>

      {/* Center */}
      <div className="items-center justify-center flex-1 hidden gap-7 md:flex">
        <Link href={"/jobs"} className={classes}>
          Jobs
        </Link>

        <Link href={"/applications"} className={classes}>
          Applications
        </Link>

        <Link href={"/profile"} className={classes}>
          Profile
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {status === "loading" ? (
          <div className="w-16 h-4 rounded bg-muted animate-pulse" />
        ) : !user ? (
          <Link href={"/login"} className={classes}>
            Sign in
          </Link>
        ) : (
          <>
            <span className="hidden text-sm text-muted-foreground md:inline">{user.name ?? user.email}</span>
            <button onClick={() => signOut({ callbackUrl: "/" })} className={classes}>
              Sign out
            </button>
          </>
        )}
        <ThemeToggle />
      </div>

      {mobileMenu && (
        <div className="fixed top-0 left-0 z-50 w-64 h-screen bg-muted">
          <div className="flex items-center justify-between p-3">
            <h2 className="text-lg font-bold">Logo</h2>
            <span onClick={() => setMobileMenu(false)} className="p-1 border rounded cursor-pointer bg-background">
              <X size={20} />
            </span>
          </div>

          <div className="flex flex-col px-1 mt-5">
            <Link href={"/freelancers"} className="p-1 px-3 font-semibold rounded hover:bg-background">
              Find Talents
            </Link>
            <Link href={"/jobs"} className="p-1 px-3 font-semibold rounded hover:bg-background">
              Browse Jobs
            </Link>
            {(user?.role === "RECRUITER" || user?.role === "ADMIN") && (
              <Link href={"/jobs/post-job"} className="p-1 px-3 font-semibold rounded hover:bg-background">
                Post a Job
              </Link>
            )}
            {user && (
              <Link href={"/dashboard"} className="p-1 px-3 font-semibold rounded hover:bg-background">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
