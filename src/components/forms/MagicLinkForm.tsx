// // Path: src/components/forms/MagicLinkForm.tsx
// // Component: MagicLinkForm for sending magic links to users for authentication and login/register
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
  const [emailError, setEmailError] = useState<string>("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      session.user.role === "admin"
        ? router.push(`/admin`)
        : router.push(`/account`);
    }
  }, [status, router, session]);

  const validateEmail = (email: string): boolean => {
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isReeduDomain = email.endsWith("@reedu.de");
    return isValidFormat && isReeduDomain;
  };

  const onSubmitMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError(
        "Bitte geben Sie eine gültige @reedu.de E-Mail-Adresse ein."
      );
      return;
    }

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
      });

      if (result?.error) {
        console.error("Magic link error:", result.error);
        toast.error(
          "Fehler beim Senden des Magic Links. Bitte versuchen Sie es erneut."
        );
      } else {
        setIsDialogOpen(false);
        toast.success("Magic Link gesendet! Überprüfen Sie Ihre E-Mails.");
        handleUserCreated();
      }
    } catch (error) {
      console.error("Error when sending magic link:", error);
      toast.error(
        "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
      );
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          onClick={() => setIsDialogOpen(true)}
        >
          Anmelden
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] w-full p-4"
        aria-describedby="dialog-description"
      >
        <DialogTitle>Magic Link Authentifizierung</DialogTitle>
        <DialogDescription id="dialog-description">
          Geben Sie Ihre @reedu.de E-Mail-Adresse ein, um einen Magic Link zur
          Authentifizierung zu erhalten.
        </DialogDescription>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Magic Link</CardTitle>
            <CardDescription>
              Geben Sie Ihre @reedu.de E-Mail-Adresse ein, um einen Magic Link
              zu erhalten.
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmitMagicLink}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="magic-link-email">E-Mail</Label>
                <Input
                  id="magic-link-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre@reedu.de"
                  className="w-full"
                  required
                />
                {emailError && (
                  <p className="text-sm text-red-500">{emailError}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" className="w-full sm:w-auto">
                Magic Link senden
              </Button>
              {/* <Button
                onClick={() => router.push("/auth/error?error=ServerError")}
                className="mt-2"
              >
                Test Error Page
              </Button> */}
            </CardFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
