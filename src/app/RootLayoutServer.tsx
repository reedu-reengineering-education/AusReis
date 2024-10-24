// Path: src/app/RootLayoutServer.tsx
// Component: RootLayoutServer for wrapping the app with the session provider on the server
import { getServerSession } from "next-auth";
import { ReactNode } from "react";

export default async function RootLayoutServer({
  children,
}: {
  children: (session: any) => ReactNode;
}) {
  const session = await getServerSession();
  return <>{children(session)}</>;
}
