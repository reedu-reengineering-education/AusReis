// components/AdminDashboard/Dashboard.tsx
"use client";
import DashboardCards from "@/components/admin-dashboard/DashboardCards";
import ProjectTable from "@/components/admin-dashboard/ProjectTable";
import ExpenseTable from "@/components/admin-dashboard/ExpenseTable";
import UserTable from "@/components/admin-dashboard/UserTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    // <section className="container py-12 md:py-24 lg:py-32">
    // <div className="space-y-4 text-center">
    //   <h1 className="text-4xl font-bold">Admin Dashboard</h1>
    //   <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed"></p>
    // </div>
    <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
      {/* Tabs für verschiedene Bereiche des Dashboards */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex border-b">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardCards />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectTable />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseTable />
        </TabsContent>

        <TabsContent value="users">
          <UserTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
