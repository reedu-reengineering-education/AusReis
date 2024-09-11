import "@/app/styles/globals.css";
import { cn } from "@/lib/utils";
import { Space_Mono } from "next/font/google";
import { Bricolage_Grotesque } from "next/font/google";
import Providers from "./providers";
import { SiteHeader } from "@/components/ui/site-header";
import RootLayoutServer from "@/app/RootLayoutServer";

const fontHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});
const fontBody = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: "400",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootLayoutServer>
      {(session) => (
        <html lang="en">
          <body
            className={cn(
              "antialiased font-mono",
              fontHeading.variable,
              fontBody.variable
            )}
          >
            <Providers session={session}>
              <div className="session-info">
                <SiteHeader />
                {children}
              </div>
            </Providers>
          </body>
        </html>
      )}
    </RootLayoutServer>
  );
}
