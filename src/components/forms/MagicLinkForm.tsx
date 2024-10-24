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
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { toast } from "react-toastify";

type MagicLinkFormProps = {
  handleUserCreated: () => void;
};

export function MagicLinkForm({ handleUserCreated }: MagicLinkFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      session.user.role === "admin"
        ? router.push(`/admin`)
        : router.push(`/account`);
    }
  }, [status, router, session]);

  const onSubmitMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("email", {
        email,
        redirect: false,
      });

      if (result?.error) {
        console.error("Magic link error:", result.error);
        toast.error("Failed to send magic link. Please try again.");
      } else {
        setIsDialogOpen(false);
        toast.success("Magic link sent! Check your email.");
        handleUserCreated();
      }
    } catch (error) {
      console.error("Error when sending magic link:", error);
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
        <DialogTitle>Magic Link Authentication</DialogTitle>
        <DialogDescription id="dialog-description">
          Enter your email to receive a magic link for authentication.
        </DialogDescription>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Magic Link</CardTitle>
            <CardDescription>
              Enter your email to receive a magic link.
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmitMagicLink}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="magic-link-email">Email</Label>
                <Input
                  id="magic-link-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" className="w-full sm:w-auto">
                Send Magic Link
              </Button>
            </CardFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
