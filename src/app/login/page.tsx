"use client";
import { LoginRegisterForm } from "@/components/forms/LoginRegisterForm.tsx";

export default function LoginPage() {
  const handleUserCreated = () => {
    console.log("User created");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <LoginRegisterForm user={null} handleUserCreated={handleUserCreated} />
    </div>
  );
}