import React, { Suspense } from "react";
import LoginForm from "./LoginForm";
import { Loader2 } from "lucide-react";

const Loginpage = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center flex-col">
          <Loader2 className="text-accent" />
          <h2>Loading...</h2>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
};

export default Loginpage;
