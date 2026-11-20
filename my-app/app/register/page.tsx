import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center flex-col">
          <Loader2 className="text-accent" />
          <h2>Loading...</h2>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
};

export default RegisterPage;
