"use client";

import LoginModal from "@/components/LoginModal";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const user = session?.user;

  //  Not signed in
  if (!user) {
    return <LoginModal callbackUrl={`/profile`} />;
  }

  if (sessionStatus === "loading") {
    return (
      <div className="h-[calc(100vh-90px)] flex items-center justify-center">
        <Loader2 className="text-accent animate-spin" />
      </div>
    );
  }
  return <div>ProfilePage</div>;
};

export default ProfilePage;
