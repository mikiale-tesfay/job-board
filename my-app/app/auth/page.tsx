"use client";

import Navbar from "../../components/Navbar";

const Register = () => {
  const handleSubmit = async () => {
    await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        ContentType: "application/json",
      },
      body: JSON.stringify({
        name: "Mikiale Tesfay",
        email: "mikiale@gmail.com",
        password: "pass",
      }),
    });
  };
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="max-w-md p-4 mx-auto space-y-2 border rounded">
          <h2 className="mb-5 text-2xl font-bold">Sign In</h2>
          <input type="text" name="email" id="email" placeholder="Email" className="w-full px-3 py-1 border rounded" />

          <input type="text" name="email" id="email" placeholder="Password" className="w-full px-3 py-1 border rounded" />

          <input type="text" name="email" id="email" placeholder="Email" className="w-full px-3 py-1 border rounded" />
          <button onClick={handleSubmit} className="w-full p-2 rounded cursor-pointer bg-foreground text-background">
            Sign In
          </button>

          <div className="flex items-center gap-1">
            <p>
              Dont have an account ? <span className="text-blue-600 cursor-pointer hover:underline">Create one.</span>{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
