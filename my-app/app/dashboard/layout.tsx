import { DashboardTabBar } from "@/components/DashboardTabBar";
import Navbar from "../../components/Navbar";
// import { requireUser } from "@/lib/auth-helpers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // await requireUser(); // guard the whole dashboard

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="items-start ">
        <div className="sticky max-w-5xl mx-auto shadow-lg top-16">
          <div className="w-full h-2 bg-background"></div>
          <DashboardTabBar />
        </div>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
