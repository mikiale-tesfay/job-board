"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Overview", href: "/dashboard" },
  { label: "Applications", href: "/dashboard/applications" },
  { label: "Notifications", href: "/dashboard/notifications" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Profile", href: "/dashboard/profile" },
];

export function DashboardTabBar() {
  const pathname = usePathname();

  return (
    <div className="bg-muted">
      <nav className="flex gap-10 px-4 overflow-x-auto ">
        {tabs.map((tab) => {
          // Exact match for /dashboard, prefix match for sub-tabs
          const isActive = tab.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(tab.href);

          return (
            <div key={tab.href} className="flex flex-col gap-1 shrink-0">
              <Link
                href={tab.href}
                className={[
                  "py-3 max-sm:pb-2 font-medium whitespace-nowrap border-b-2 transition-colors",
                  isActive ? "border-blue-600 text-blue-600" : "border-transparent  hover:text-foreground hover:border-border active:border-border",
                ].join(" ")}
              >
                {tab.label}
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
