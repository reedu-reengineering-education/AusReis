// Path: src/app/account/page.tsx
// Component: AccountPage for displaying the user account page
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserAccountPage from "@/components/user-account/UserAccountPage";
import { useEffect } from "react";
import { MotionWrapper } from "@/components/MotionWrapper";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <MotionWrapper>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <section className="container flex flex-col items-center justify-center gap-6 py-12 md:py-24 lg:py-32">
            <div className="space-y-4 typewriter drop-shadow text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Benutzer-Account
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed typewriter">
                Verwalten Sie Ihre Auslagen und Reisekosten.
              </p>
            </div>
            {/* Haupt-UserAccountPage-Komponente */}
            <UserAccountPage />
          </section>
        </main>
      </div>
      <footer className="bg-muted py-6 text-center text-xs text-muted-foreground">
        <div className="container">
          &copy; {new Date().getFullYear()} Reedu GmbH & Co. KG. Alle Rechte
          vorbehalten.
        </div>
      </footer>
    </MotionWrapper>
  );
}
