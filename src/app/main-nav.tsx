"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MountainIcon, User, Settings, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ProfileModal from "@/components/forms/ProfileModal";
import SettingsModal from "@/components/forms/SettingsModal";

interface MainNavProps {
  items?: {
    title: string;
    href?: string;
    disabled?: boolean;
    external?: boolean;
  }[];
}

export function MainNav({ items }: MainNavProps) {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const handleProfileClick = (e: Event) => {
    e.preventDefault();
    setIsProfileOpen(true);
  };

  const handleSettingsClick = (e: Event) => {
    e.preventDefault();
    setIsSettingsOpen(true);
  };

  return (
    <div className="flex flex-col">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="text-lg font-medium">Aus:Reis</span>
          </Link>

          {items?.length ? (
            <nav className="hidden space-x-4 md:flex">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href ?? "#"}
                  className={cn(
                    "relative text-sm font-medium text-muted-foreground",
                    "underline-animation",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                  prefetch={false}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder-user.jpg"
                      alt="User avatar"
                    />
                    <AvatarFallback>
                      {session?.user?.name
                        ? session.user.name.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder-user.jpg"
                      alt="User avatar"
                    />
                    <AvatarFallback>
                      {session?.user?.name
                        ? session.user.name.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5 leading-none">
                    <div className="font-semibold">
                      {session?.user?.name || "User"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session?.user?.email || "user@example.com"}
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <ProfileModal open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}
