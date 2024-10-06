"use client";
import { MainNav } from "@/components/ui/navigation";

import React from "react";

export function SiteHeader() {
  return (
    <header className="bg-background border-b">
      <MainNav
        items={[
          {
            title: "Admin",
            href: "/admin",
          },
          {
            title: "User",
            href: "/account",
          },
          {
            title: "FAQ",
            href: "/faq",
          },
        ]}
      />
    </header>
  );
}
