import { LoginRegisterForm } from "@/components/forms/MagicLinkForm";

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
