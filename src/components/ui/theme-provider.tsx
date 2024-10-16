// "use client";

// import * as React from "react";
// import { Moon, Sun, MonitorCog } from "lucide-react";
// import { useTheme } from "next-themes";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export function ThemeToggle() {
//   const { setTheme } = useTheme();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon">
//           <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//           <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem
//           onClick={() => setTheme("light")}
//           className="size-min"
//         >
//           <Sun className="mr-2" />
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")} className="size-min">
//           <Moon className="mr-2" />
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onClick={() => setTheme("system")}
//           className="size-min"
//         >
//           <MonitorCog className="mr-2" />
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props} enableSystem defaultTheme="system">
      {children}
    </NextThemesProvider>
  );
}
