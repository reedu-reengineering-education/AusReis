// src/app/admin/page.tsx
import AdminDashboard from "@/components/admin-dashboard/AdminDashboard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "admin") {
    return <div>Unauthorized</div>;
  }
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 py-12 md:py-24 lg:py-32">
          <div className="space-y-4 typewriter drop-shadow  text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Admin Dashboard
            </h1>
            <p className="max-w-[700px] typewriter text-muted-foreground md:text-xl/relaxed">
              Manage your projects, users, and expenses.
            </p>
          </div>
          {/* Haupt-Dashboard-Komponente */}
          <AdminDashboard />
        </section>
      </main>
    </div>
  );
}
