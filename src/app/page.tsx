// Path: src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MagicLinkForm } from "@/components/forms/MagicLinkForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TypewriterText: React.FC<{ text: string; delay?: number }> = ({
  text,
  delay = 100,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [text, delay, currentIndex]);

  return <span>{displayText}</span>;
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const handleUserCreated = () => {
    console.log("User created");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTypingComplete(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 py-12 md:py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              {isTypingComplete ? (
                "Willkommen bei Aus:Reis"
              ) : (
                <TypewriterText text="Willkommen bei Aus:Reis" delay={100} />
              )}
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              {isTypingComplete ? (
                "Verwalten Sie Ihre Auslagen und Reisekosten einfach und effizient."
              ) : (
                <TypewriterText
                  text="Verwalten Sie Ihre Auslagen und Reisekosten einfach und effizient."
                  delay={50}
                />
              )}
            </p>
          </div>

          {status === "authenticated" ? (
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/account">
                <Button>Zum Benutzerkonto</Button>
              </Link>
              {session?.user?.role === "admin" && (
                <Link href="/admin">
                  <Button variant="outline">Admin-Bereich</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row">
              <MagicLinkForm handleUserCreated={handleUserCreated} />
            </div>
          )}
        </section>
      </main>
      <footer className="bg-muted py-6 text-center text-xs text-muted-foreground">
        <div className="container">
          &copy; {new Date().getFullYear()} Reedu GmbH & Co. KG. Alle Rechte
          vorbehalten.
        </div>
      </footer>
    </div>
  );
}
