import React from "react";
import Navbar from "./Navbar";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginModal = ({ callbackUrl }: { callbackUrl: string }) => {
  const router = useRouter();
  return (
    <div>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-2xl px-4 py-20 mx-auto">
          <div className="p-12 text-center border bg-card border-border">
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="mb-2 text-2xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              SIGN IN REQUIRED
            </h1>
            <p className="mb-6 text-muted-foreground">You need to be signed in to access this page.</p>
            <button
              onClick={() => router.push(`/login?callbackUrl=${callbackUrl}`)}
              className="px-8 py-3 text-sm font-bold tracking-widest transition-colors bg-accent text-accent-foreground hover:bg-accent/90"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
