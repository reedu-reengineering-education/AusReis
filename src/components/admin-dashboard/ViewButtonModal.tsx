"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, DollarSignIcon, Euro, UsersIcon } from "lucide-react";
import { ProjectExport } from "./ProjectExport";

export function ProjectViewModal({ project }: { project: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const spendPercentage = (project.actualSpend / project.budget) * 100;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {project.name}
          </DialogTitle>
          <DialogDescription>Information about the project</DialogDescription>
          <Badge className={`${getStatusBadgeColor(project.status)} mt-2`}>
            {project.status}
          </Badge>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Project Timeline</span>
            </div>
            <div className="text-sm">
              {/* Replace with actual start and end dates if available */}
              Start - End
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Euro className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Budget</span>
              </div>
              <span className="text-sm font-medium">
                {project.budget.toLocaleString()} €
              </span>
            </div>
            <Progress value={spendPercentage} className="h-2 w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Spent: {project.actualSpend.toLocaleString()}€</span>
              <span>{spendPercentage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <UsersIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Assigned Users</span>
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              {project.users && project.users.length > 0 ? (
                project.users.map((user: any) => (
                  <Badge key={user.id} className="relative">
                    <span className="text-xs">{user.name}</span>
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">No users assigned</span>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <ProjectExport projectId={project.id} projectName={project.name} />
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
