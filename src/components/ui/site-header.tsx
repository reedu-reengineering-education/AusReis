"use client";

import { MainNav } from "@/components/ui/navigation";
import { useSession } from "next-auth/react";
import React from "react";

export function SiteHeader() {
  const { data: session } = useSession();

  const navItems = [
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
  ];

  return (
    <header className="bg-background border-b">
      <MainNav items={navItems} />
    </header>
  );
}
