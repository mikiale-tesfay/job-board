"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const HomeNavbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const classes = "font-semibold nowrap";
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-3 border-b border-border bg-background text-foreground">
      {/* Logo */}

      <div className="flex items-center gap-3">
        <span onClick={() => setMobileMenu(!mobileMenu)} className="p-1 border rounded cursor-pointer hover:bg-muted">
          <Menu size={18} />
        </span>
        <Link href={"/"} className="">
          <h2 className="text-2xl bold">Job</h2>
        </Link>
      </div>

      {/* Center */}
      <div className="items-center justify-center flex-1 hidden gap-5 md:flex">
        <Link href={"/freelancers"} className={`${classes}`}>
          Find Talents
        </Link>
        <Link href={"/jobs"} className={`${classes}`}>
          Browse Jobs
        </Link>
        <Link href={"/client"} className={`${classes}`}>
          Client
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* {session ? <Link href={"/auth"}>Signin</Link> : <button>sing Out</button>} */}

        <Link href={"/login"} className="px-4 py-1 text-sm border rounded-full cursor-pointer ">
          Signin
        </Link>
        <ThemeToggle />
      </div>

      {mobileMenu && (
        <div className="fixed top-0 left-0 w-64 h-screen bg-muted">
          <div className="flex items-center justify-between p-3">
            <h2 className="text-lg font-bold">Logo</h2>
            <span onClick={() => setMobileMenu(false)} className="p-1 border rounded cursor-pointer bg-background">
              <X size={20} className="" />
            </span>
          </div>

          <div className="flex flex-col px-1 mt-5">
            <Link href={"/freelancers"} className={`p-1 px-3 hover:bg-background rounded font-semibold`}>
              Find Talents
            </Link>
            <Link href={"/jobs"} className={`p-1 px-3 hover:bg-background rounded font-semibold`}>
              Browse Jobs
            </Link>
            <Link href={"/jobs/post-job"} className={`p-1 px-3 hover:bg-background rounded font-semibold`}>
              client
            </Link>

            <Link href={"/dashboard"} className={`p-1 px-3 hover:bg-background rounded font-semibold`}>
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeNavbar;
