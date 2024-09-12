// import { useState, useMemo } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";

// export default function ProjectManagement() {
//   const [projectSearchTerm, setProjectSearchTerm] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   // Dummy project data
//   const projects = [
//     {
//       id: 1,
//       name: "Project A",
//       status: "Active",
//       budget: 50000,
//       actualSpend: 45000,
//     },
//     {
//       id: 2,
//       name: "Project B",
//       status: "Pending",
//       budget: 75000,
//       actualSpend: 40000,
//     },
//   ];

//   const filteredProjects = useMemo(() => {
//     return projects.filter((project) =>
//       selectedFilter === "name"
//         ? project.name.toLowerCase().includes(projectSearchTerm.toLowerCase())
//         : project.status.toLowerCase().includes(projectSearchTerm.toLowerCase())
//     );
//   }, [projectSearchTerm, projects, selectedFilter]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Projects</CardTitle>
//         <div className="flex items-center gap-4">
//           <Input
//             placeholder="Search projects..."
//             value={projectSearchTerm}
//             onChange={(e) => setProjectSearchTerm(e.target.value)}
//             className="bg-background"
//           />
//           <Button>Add New Project</Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Budget</TableHead>
//               <TableHead>Actual Spend</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredProjects.map((project) => (
//               <TableRow key={project.id}>
//                 <TableCell>{project.name}</TableCell>
//                 <TableCell>
//                   <Badge>{project.status}</Badge>
//                 </TableCell>
//                 <TableCell>${project.budget.toLocaleString()}</TableCell>
//                 <TableCell>${project.actualSpend.toLocaleString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }
