// path: src/app/auth/error/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MotionWrapper } from "@/components/MotionWrapper";

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams ? searchParams.get("error") : null;

  const errorMessages: { [key: string]: { title: string; message: string } } = {
    InvalidDomain: {
      title: "Ungültige E-Mail-Domain",
      message:
        "Nur E-Mail-Adressen mit @reedu.de sind für die Anmeldung zugelassen.",
    },
    InvalidEmail: {
      title: "Ungültige E-Mail-Adresse",
      message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    },
    UserNotFound: {
      title: "Benutzer nicht gefunden",
      message:
        "Es wurde kein Benutzerkonto mit dieser E-Mail-Adresse gefunden.",
    },
    ServerError: {
      title: "Serverfehler",
      message:
        "Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
    },
    Default: {
      title: "Anmeldefehler",
      message:
        "Es ist ein Fehler bei der Anmeldung aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.",
    },
  };

  const errorInfo =
    error && typeof error === "string"
      ? errorMessages[error] || errorMessages.Default
      : errorMessages.Default;

  useEffect(() => {
    toast.error(`${errorInfo.title}: ${errorInfo.message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, [error, errorInfo.message, errorInfo.title]);

  return (
    <MotionWrapper>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50">
        <ToastContainer />
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 bg-red-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <AlertCircle className="mr-2 h-6 w-6" />
              {errorInfo.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-center text-gray-700 mb-6">
              {errorInfo.message}
            </p>
            <div
              className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg"
              role="alert"
            >
              <p className="font-bold">Hinweis</p>
              <p>
                Wenn Sie Hilfe benötigen, kontaktieren Sie bitte unseren Support
                unter support@reedu.de.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center"
            >
              <Home className="mr-2 h-4 w-4" />
              Startseite
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MotionWrapper>
  );
}
