// Path: src/components/ui/site-header.tsx
// Component: SiteHeader for displaying the site header with the main navigation

"use client";

import { MainNav } from "@/components/ui/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";

  const navItems = isAuthenticated
    ? [
        ...(session?.user?.role === "admin"
          ? [{ title: "Admin", href: "/admin" }]
          : []),
        {
          title: "User",
          href: "/account",
        },
        {
          title: "FAQ",
          href: "/faq",
        },
      ]
    : [];

  return (
    <header className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <MainNav items={navItems} />
        {
          !isAuthenticated
          // && (
          //   <Link href="/login">
          //     <Button variant="ghost">Sign In</Button>
          //   </Link>
          // )
        }
      </div>
    </header>
  );
}
