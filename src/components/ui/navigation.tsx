import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MountainIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { signOut, useSession } from "next-auth/react";

interface MainNavProps {
  items?: {
    title: string;
    href?: string;
    disabled?: boolean;
    external?: boolean;
  }[];
}

function MainNav({ items }: MainNavProps) {
  const { data: session } = useSession(); // Add this line to assign the session variable

  return (
    <div className="flex flex-col">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="text-lg font-medium">Aus:Reis</span>
          </Link>

          {/* Dynamisches Navigationsmenü */}
          {items?.length ? (
            <nav className="hidden space-x-4 md:flex">
              {items?.map((item, index) => (
                <Link
                  key={index}
                  href={item.href ?? "#"}
                  className={cn(
                    "relative text-sm font-medium text-muted-foreground", // Standardstile mit Tailwind
                    "underline-animation", // Benutzerdefinierte Klasse für die animierte Unterstreichung
                    item.disabled && "cursor-not-allowed opacity-80" // Bedingter Stil, wenn item.disabled true ist
                  )}
                  prefetch={false}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
          {/* Dropdown Menü */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5 leading-none">
                    <div className="font-semibold">{session?.user?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {session?.user?.email}
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  );
}

export { MainNav };
