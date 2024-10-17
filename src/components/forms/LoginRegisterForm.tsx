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
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { toast } from "react-toastify";

type CreateUserProps = {
  handleUserCreated: () => void;
};

export function LoginRegisterForm({ handleUserCreated }: CreateUserProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
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
    // Clear form fields when switching tabs
    setName("");
    setEmail("");
    setPassword("");
    setSecretCode("");
  };

  const onSubmitLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setIsDialogOpen(false);
        toast.success("Login successful!");
        router.push(session?.user?.role === "admin" ? "/admin" : "/account");
      }
    } catch (error) {
      console.error("Error when logging in the user:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const onSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, secretCode }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        handleUserCreated();
        toast.success("Registration successful! You can now log in.");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error when registering the user:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          onClick={() => setIsDialogOpen(true)}
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
              <form onSubmit={onSubmitLogIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="johny.d@example.com"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" className="w-full sm:w-auto">
                    Log In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Enter your registration data.</CardDescription>
              </CardHeader>
              <form onSubmit={onSubmitRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="register-name">Username</Label>
                    <Input
                      id="register-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="johny.d@example.com"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a secure password"
                      className="w-full"
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="admin-secret">
                      Admin Secret Code (Optional)
                    </Label>
                    <Input
                      id="admin-secret-code"
                      type="password"
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      placeholder="Admin secret code"
                      className="w-full"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" className="w-full sm:w-auto">
                    Register
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
