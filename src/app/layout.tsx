import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Space_Mono } from "next/font/google";
import { Bricolage_Grotesque } from "next/font/google";
import Providers from "./providers";
import { SiteHeader } from "@/components/ui/site-header";
import RootLayoutServer from "@/app/RootLayoutServer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </Providers>
          </body>
        </html>
      )}
    </RootLayoutServer>
  );
}
