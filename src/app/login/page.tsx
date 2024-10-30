// path: src/app/login/page.tsx
// Component: LoginPage for displaying the login page with the magic link form
"use client";
import { MagicLinkForm } from "@/components/forms/MagicLinkForm";
import { MotionWrapper } from "@/components/MotionWrapper";

export default function LoginPage() {
  const handleUserCreated = () => {
    console.log("User created");
  };

  return (
    <MotionWrapper>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <MagicLinkForm handleUserCreated={handleUserCreated} />
      </div>
    </MotionWrapper>
  );
}
