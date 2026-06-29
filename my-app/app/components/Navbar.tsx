import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const classes = "font-bold";
  return (
    <div className="flex bg-background text-foreground justify-between items-center h-16 px-3">
      {/* Logo */}
      <Link href={"/"} className="">
        <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={100} height={20} priority />
      </Link>

      {/* Center */}
      <div className="flex gap-5 items-center justify-center">
        <Link href={"/jobs"} className={`${classes}`}>
          Find Talents
        </Link>
        <Link href={"/jobs"} className={`${classes}`}>
          Browse Jobs
        </Link>
        <Link href={"/post-job"} className={`${classes}`}>
          Post a Job
        </Link>
      </div>

      {/* Right */}
      <div>
        <Link href={"/auth/login"}>Signin</Link>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
