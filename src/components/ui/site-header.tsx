"use client";
import { MainNav } from "@/components/ui/navigation";

import React from "react";

export function SiteHeader() {
  return (
    <header className="bg-background border-b">
      <MainNav
        items={[
          {
            title: "Bills & Expenses",
            href: "/myBillsAndExpenses",
          },
          {
            title: "Account",
            href: "/account",
          },
          {
            title: "FAQ",
            href: "/faq",
          },
          {
            title: "Contact",
            href: "/contact",
          },
        ]}
      />
    </header>
  );
}
