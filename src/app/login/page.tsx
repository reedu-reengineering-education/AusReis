// path: src/app/login/page.tsx
// Component: LoginPage for displaying the login page with the magic link form
"use client";
import { MagicLinkForm } from "@/components/forms/MagicLinkForm";

export default function LoginPage() {
  const handleUserCreated = () => {
    console.log("User created");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <MagicLinkForm handleUserCreated={handleUserCreated} />
    </div>
  );
}
