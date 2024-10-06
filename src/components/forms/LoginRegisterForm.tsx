"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { registerUser } from "@/lib/api/registerClient";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { toast } from "react-toastify";

type CreateUserProps = {
  user: any;
  handleUserCreated: () => void;
};

export function LoginRegisterForm({
  user,
  handleUserCreated,
}: CreateUserProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [password, setPassword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [secretCode, setSecretCode] = useState<string>("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      session.user.role === "admin"
        ? router.push(`/admin`)
        : router.push(`/account`);
    }
  }, [status, router, session]);

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
  };

  const onSubmitLogIn = async () => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
        toast.error("Login failed. Please check your credentials.");
      } else {
        if (session?.user?.id) {
          router.push(`/account/${session?.user?.id}`);
        }
        setIsDialogOpen(false);
        toast.success("Login successful!");
      }
    } catch (error) {
      console.error("Error when logging in the user:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const onSubmitRegister = async () => {
    try {
      const registerData = await registerUser(
        name,
        email,
        password,
        secretCode
      );
      console.log("User registered:", registerData);
      setIsDialogOpen(false);
      handleUserCreated();
      toast.success("Registration successful! You can now log in.");
    } catch (error) {
      console.error("Error when registering the user:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          onClick={() => {
            console.log("Button clicked");
            setIsDialogOpen(true);
          }}
        >
          Get Started
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] w-full p-4"
        aria-describedby="dialog-description"
      >
        <DialogTitle>Authentication</DialogTitle>
        <DialogDescription id="dialog-description">
          Please log in or register to continue.
        </DialogDescription>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" onClick={() => handleTabChange("login")}>
              Log In
            </TabsTrigger>
            <TabsTrigger
              value="register"
              onClick={() => handleTabChange("register")}
            >
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your login data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johny.d@reedu.de"
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="secure password"
                    className="w-full"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={onSubmitLogIn} className="w-full sm:w-auto">
                  Log In
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Enter your registration data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="register-name">Username</Label>
                  <Input
                    id="register-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johny.d@reedu.de"
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="secure password"
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="admin-secret">Admin</Label>
                  <Input
                    id="admin-secret-code"
                    type="secretCode"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    placeholder="Admin secret code"
                    className="w-full"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={onSubmitRegister} className="w-full sm:w-auto">
                  Register
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
