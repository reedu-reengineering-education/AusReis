// // Path: src/app/home/page.tsx
// // Component: HomePage for displaying the home page with the magic link form
// import { Card, CardContent } from "@/components/ui/card";
// import React from "react";
// import background from "/public/background.svg";
// export default function Component() {
//   return (
//     <Card
//       className="w-full max-w-md mx-auto bg-cover bg-center"
//       style={{ backgroundImage: `url(${background})` }}
//     >
//       <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 bg-white bg-opacity-75">
//         <h2 className="text-2xl font-bold text-center">NFZ-Zahlungen</h2>
//         <p className="text-center text-gray-600">
//           Einfache und sichere Zahlungen für Nutzfahrzeuge
//         </p>
//       </CardContent>
//     </Card>
//   );
// }
// Path: src/app/page.tsx
// Component: HomePage for displaying the home page with the magic link form
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MagicLinkForm } from "@/components/forms/MagicLinkForm";

export default function HomePage({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleUserCreated = () => {
    console.log("User created");
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 py-12 md:py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Revolutionize Your Web Presence
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Unlock the full potential of your online business with our
              cutting-edge platform. Streamline your workflow, boost
              performance, and deliver exceptional user experiences.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <MagicLinkForm handleUserCreated={handleUserCreated} />
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted py-6 text-center text-xs text-muted-foreground">
        <div className="container">
          &copy; 2024 Reedu GmbH & Co. KG. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
