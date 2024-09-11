"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { X } from "lucide-react";

// Admin Dashboard Component
export default function AdminDashboard() {
  // States for search terms
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [debouncedProjectSearchTerm, setDebouncedProjectSearchTerm] =
    useState("");
  const [expenseSearchTerm, setExpenseSearchTerm] = useState("");
  const [debouncedExpenseSearchTerm, setDebouncedExpenseSearchTerm] =
    useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [debouncedUserSearchTerm, setDebouncedUserSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    name: string;
    status: string;
    budget: number;
    actualSpend: number;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
    role: string;
    status: string;
  } | null>(null);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      user: "John Doe",
      project: "Project A",
      amount: 100,
      status: "Open",
    },
    {
      id: 2,
      user: "Jane Doe",
      project: "Project A",
      amount: 200,
      status: "Paid",
    },
    {
      id: 3,
      user: "Bob Smith",
      project: "Project B",
      amount: 150,
      status: "Pending",
    },
  ]);

  // Dummy Projects and Expenses Data
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Project A",
      status: "Active",
      budget: 50000,
      actualSpend: 45000,
    },
    {
      id: 2,
      name: "Project B",
      status: "Pending",
      budget: 75000,
      actualSpend: 40000,
    },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Doe", role: "User", status: "Active" },
    { id: 3, name: "Bob Smith", role: "User", status: "Pending" },
    { id: 4, name: "Alice Johnson", role: "User", status: "Inactive" },
    { id: 5, name: "Charlie Brown", role: "Admin", status: "Active" },
    { id: 6, name: "Emily Davis", role: "User", status: "Pending" },
    { id: 7, name: "Frank White", role: "User", status: "Inactive" },
    { id: 8, name: "Grace Lee", role: "Admin", status: "Active" },
    { id: 9, name: "Henry Green", role: "User", status: "Active" },
    { id: 10, name: "Ivy Black", role: "User", status: "Inactive" },
  ]);

  // Debouncing search inputs to delay search execution for better performance
  useEffect(() => {
    const projectHandler = setTimeout(
      () => setDebouncedProjectSearchTerm(projectSearchTerm),
      300
    );
    const expenseHandler = setTimeout(
      () => setDebouncedExpenseSearchTerm(expenseSearchTerm),
      300
    );
    const userHandler = setTimeout(
      () => setDebouncedUserSearchTerm(userSearchTerm),
      300
    );

    return () => {
      clearTimeout(projectHandler);
      clearTimeout(expenseHandler);
      clearTimeout(userHandler);
    };
  }, [projectSearchTerm, expenseSearchTerm, userSearchTerm]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (selectedFilter === "name") {
        return project.name
          .toLowerCase()
          .includes(debouncedProjectSearchTerm.toLowerCase());
      } else if (selectedFilter === "status") {
        return project.status
          .toLowerCase()
          .includes(debouncedProjectSearchTerm.toLowerCase());
      }
      return false;
    });
  }, [debouncedProjectSearchTerm, projects, selectedFilter]);

  // Filtering projects based on the search term
  // const filteredProjects = useMemo(() => {
  //   return projects.filter(
  //     (project) =>
  //       project.name
  //         .toLowerCase()
  //         .includes(debouncedProjectSearchTerm.toLowerCase()) ||
  //       project.status
  //         .toLowerCase()
  //         .includes(debouncedProjectSearchTerm.toLowerCase())
  //   );
  // }, [debouncedProjectSearchTerm, projects]);

  // Filtering expenses based on the search term
  const filteredExpenses = useMemo(() => {
    return expenses.filter(
      (expense) =>
        expense.user
          .toLowerCase()
          .includes(debouncedExpenseSearchTerm.toLowerCase()) ||
        expense.status
          .toLowerCase()
          .includes(debouncedExpenseSearchTerm.toLowerCase()) ||
        expense.project
          .toLowerCase()
          .includes(debouncedExpenseSearchTerm.toLowerCase())
    );
  }, [debouncedExpenseSearchTerm, expenses]);

  // Filtering users based on the search term
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name
          .toLowerCase()
          .includes(debouncedUserSearchTerm.toLowerCase()) ||
        user.role
          .toLowerCase()
          .includes(debouncedUserSearchTerm.toLowerCase()) ||
        user.status
          .toLowerCase()
          .includes(debouncedUserSearchTerm.toLowerCase())
    );
  }, [debouncedUserSearchTerm, users]);

  const handleViewProject = (
    project: {
      id: number;
      name: string;
      status: string;
      budget: number;
      actualSpend: number;
    } | null
  ) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  // Funktion zum Genehmigen einer Ausgabe
  const handleApproveExpense = (id: number) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, status: "Paid" } : expense
    );
    // Update den Zustand der Ausgaben mit den aktualisierten Daten
    setExpenses(updatedExpenses);
  };

  // Funktion zum Ablehnen einer Ausgabe
  const handleRejectExpense = (id: number) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, status: "Rejected" } : expense
    );
    // Update den Zustand der Ausgaben mit den aktualisierten Daten
    setExpenses(updatedExpenses);
  };

  const handleEditUser = (user: {
    id: number;
    name: string;
    role: string;
    status: string;
  }) => {
    setSelectedUser(user);
    setShowEditUserForm(true);
  };

  // Funktion zum Speichern der Änderungen des Benutzers
  const handleSaveUser = (updatedUser: {
    id: number;
    name: string;
    role: string;
    status: string;
  }) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    // Update den Zustand der Benutzer
    setUsers(updatedUsers);
    setShowEditUserForm(false);
  };

  // Funktion zum Entfernen eines Benutzers
  const handleRemoveUser = (id: number) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    // Update den Zustand der Benutzer
    setUsers(updatedUsers);
  };
  const handleSaveNewProject = (newProject: {
    name: string;
    status: string;
    budget: number;
  }) => {
    const newProjectWithIdAndSpend = {
      ...newProject,
      id: projects.length + 1, // Generiere eine neue ID (oder eine andere Logik verwenden)
      actualSpend: 0, // Initialisiere actualSpend auf 0
    };

    setProjects([...projects, newProjectWithIdAndSpend]); // Füge das neue Projekt zur Liste hinzu
    setShowAddProjectForm(false); // Schließe das Formular
  };
  const handleAddNewProject = () => setShowAddProjectForm(true);
  const handleAddNewUser = () => setShowAddUserForm(true);
  const handleSaveNewUser = (newUser: {
    name: string;
    role: string;
    status: string;
  }) => {
    const newUserWithId = {
      ...newUser,
      id: users.length + 1, // Generiere eine neue ID (oder eine andere Logik verwenden)
    };

    setUsers([...users, newUserWithId]); // Füge den neuen Benutzer zur Liste hinzu
    setShowAddUserForm(false); // Schließe das Formular
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 py-12 md:py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Admin Dashboard
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Manage your projects, users, and expenses.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="flex border-b">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Open Expenses Card */}
                  <Card className="relative overflow-hidden shadow-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-red-600 opacity-50"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-center">
                        Open Expenses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 flex justify-center items-center h-24">
                      <p className="text-5xl font-bold">
                        {expenses.filter((e) => e.status === "Open").length}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Approved Expenses Card */}
                  <Card className="relative overflow-hidden shadow-lg bg-gradient-to-r from-green-400 to-teal-500 text-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-600 opacity-50"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-center">
                        Approved Expenses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 flex justify-center items-center h-24">
                      <p className="text-5xl font-bold">
                        {expenses.filter((e) => e.status === "Paid").length}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Total Projects Card */}
                  <Card className="relative overflow-hidden shadow-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-50"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-center">
                        Total Projects
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 flex justify-center items-center h-24">
                      <p className="text-5xl font-bold">{projects.length}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle>Projects</CardTitle>
                    <div className="flex items-center gap-4">
                      {/* Dropdown-Menü für Filter */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Filter By</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem
                            onClick={() => setSelectedFilter("name")}
                          >
                            Project Name
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedFilter("status")}
                          >
                            Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Input
                        placeholder="Search projects..."
                        value={projectSearchTerm}
                        onChange={(e) => setProjectSearchTerm(e.target.value)}
                        className="bg-background"
                      />

                      <Button onClick={() => setShowAddProjectForm(true)}>
                        Add New Project
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Budget</TableHead>
                          <TableHead>Actual Spend</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">
                              {project.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  project.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                } text-xs`}
                              >
                                {project.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              ${project.budget.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              ${project.actualSpend.toLocaleString()}
                            </TableCell>
                            <TableCell className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewProject(project)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Expenses Tab */}
              <TabsContent value="expenses">
                <Card>
                  <CardHeader>
                    <CardTitle>Expenses</CardTitle>
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder="Search expenses..."
                        value={expenseSearchTerm}
                        onChange={(e) => setExpenseSearchTerm(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExpenses.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell className="font-medium">
                              {expense.user}
                            </TableCell>
                            <TableCell>{expense.project}</TableCell>
                            <TableCell>
                              ${expense.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  expense.status === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : expense.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : expense.status === "Open"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                } text-xs`}
                              >
                                {expense.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="flex justify-end space-x-2">
                              {expense.status === "Pending" ||
                              expense.status === "Open" ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleApproveExpense(expense.id)
                                    }
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleRejectExpense(expense.id)
                                    }
                                  >
                                    Reject
                                  </Button>
                                </>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="bg-background"
                      />
                      <Button onClick={() => setShowAddUserForm(true)}>
                        Add New User
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  user.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : user.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : user.status === "Inactive"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                } text-xs`}
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveUser(user.id)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      {showAddProjectForm && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <Card className="max-w-4xl w-full">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Add New Project</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddProjectForm(false)}
                className="ml-auto"
              >
                <X />
              </Button>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Logik zum Speichern des neuen Projekts
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const newProject = {
                    name: formData.get("name") as string,
                    status: formData.get("status") as string,
                    budget: parseFloat(formData.get("budget") as string),
                  };
                  handleSaveNewProject(newProject);
                }}
              >
                <Input
                  name="name"
                  placeholder="Project Name"
                  required
                  className="mb-4"
                />
                <Input
                  name="status"
                  placeholder="Status"
                  required
                  className="mb-4"
                />
                <Input
                  name="budget"
                  type="number"
                  placeholder="Budget"
                  required
                  className="mb-4"
                />
                <Button type="submit">Save Project</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      {showAddUserForm && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <Card className="max-w-4xl w-full">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Add New User</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddUserForm(false)}
                className="ml-auto"
              >
                <X />
              </Button>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Logik zum Speichern des neuen Benutzers
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const newUser = {
                    name: formData.get("name") as string,
                    role: formData.get("role") as string,
                    status: formData.get("status") as string,
                  };
                  handleSaveNewUser(newUser);
                }}
              >
                <Input
                  name="name"
                  placeholder="User Name"
                  required
                  className="mb-4"
                />
                <Input
                  name="role"
                  placeholder="Role"
                  required
                  className="mb-4"
                />
                <Input
                  name="status"
                  placeholder="Status"
                  required
                  className="mb-4"
                />
                <Button type="submit">Save User</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <Card className="max-w-4xl w-full">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                {selectedProject?.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProjectDetails(false)}
                className="ml-auto mt-8 "
              >
                <span className="sr-only">Close</span>
                <X />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Status: {selectedProject?.status}
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Budget</TableHead>
                    <TableHead>Actual Spend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      ${selectedProject?.budget.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      ${selectedProject?.actualSpend.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
      {showEditUserForm && selectedUser && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <Card className="max-w-4xl w-full">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Edit User</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto mt-8"
                onClick={() => setShowEditUserForm(false)}
              >
                <X />
              </Button>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form); // Formulardaten sammeln
                  const updatedUser = {
                    ...selectedUser,
                    name: formData.get("name") as string, // Typanpassung
                    role: formData.get("role") as string,
                    status: formData.get("status") as string,
                  };
                  handleSaveUser(updatedUser);
                }}
              >
                <Input
                  name="name"
                  defaultValue={selectedUser.name}
                  placeholder="Name"
                  className="mb-4"
                />
                <Input
                  name="role"
                  defaultValue={selectedUser.role}
                  placeholder="Role"
                  className="mb-4"
                />
                <Input
                  name="status"
                  defaultValue={selectedUser.status}
                  placeholder="Status"
                  className="mb-4"
                />
                <Button type="submit">Save</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
