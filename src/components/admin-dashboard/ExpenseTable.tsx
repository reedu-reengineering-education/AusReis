// "use client";

// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import SearchBar from "./SearchBar";
// import type { ExpenseStatus } from "@prisma/client";
// import { Expense } from "@prisma/client";
// import { User } from "@prisma/client";
// import { Project } from "@prisma/client";
// import { File } from "@prisma/client";
// import { Bill } from "@prisma/client";

// import { getExpenses, updateExpense } from "@/lib/api/expenseClient";

// export default function ExpenseTable() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expenses, setExpenses] = useState<
//     (Expense & { user: User; project: Project; file: File; bills: Bill })[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   const [activeTab, setActiveTab] = useState("all");

//   useEffect(() => {
//     const fetchExpenses = async () => {
//       try {
//         setIsLoading(true);
//         const data = await getExpenses();
//         setExpenses(data);
//       } catch (error) {
//         console.error("Error fetching expenses:", error);
//         setError(error as any);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchExpenses();
//   }, []);

//   const handleApproveExpense = async (id: string) => {
//     try {
//       await updateExpense(id, undefined, undefined, undefined, "paid");
//       setExpenses((prevExpenses) =>
//         prevExpenses.map(
//           (
//             expense: Expense & {
//               user: User;
//               project: Project;
//               file: File;
//               bills: Bill;
//             }
//           ) => (expense.id === id ? { ...expense, status: "paid" } : expense)
//         )
//       );
//     } catch (error) {
//       console.error("Error approving expense:", error);
//     }
//   };

//   const handleRejectExpense = async (id: string) => {
//     try {
//       await updateExpense(id, undefined, undefined, undefined, "rejected");
//       setExpenses((prevExpenses) =>
//         prevExpenses.map((expense) =>
//           expense.id === id
//             ? { ...expense, status: "rejected" as ExpenseStatus }
//             : expense
//         )
//       );
//     } catch (error) {
//       console.error("Error rejecting expense:", error);
//     }
//   };

//   const filteredExpenses = expenses.filter(
//     (expense) =>
//       (expense.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         expense.projectId.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (activeTab === "all" || expense.category === activeTab)
//   );

//   const downloadFile = async (fileId: string) => {
//     window.open(`/api/download/${fileId}`, "_blank");
//   };

//   if (isLoading) {
//     return <div>Loading expenses...</div>;
//   }

//   if (error) {
//     return <div>Error loading expenses: {error.message}</div>;
//   }

//   return (
//     <div className="flex">
//       <Tabs
//         orientation="vertical"
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className="w-48"
//       >
//         <TabsList className="flex flex-col h-full">
//           <TabsTrigger value="all">All Expenses</TabsTrigger>
//           <TabsTrigger value="travel">Travel</TabsTrigger>
//           <TabsTrigger value="reimbursement">Reimbursement</TabsTrigger>
//         </TabsList>
//       </Tabs>
//       <div className="flex-1 ml-4">
//         <SearchBar
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>User</TableHead>
//               <TableHead>Project</TableHead>
//               <TableHead>Amount</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>
//                 <span className="sr-only">Actions</span>
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredExpenses.map((expense) => (
//               <TableRow key={expense.id}>
//                 <TableCell>{expense.user.name}</TableCell>
//                 <TableCell>{expense.project.name}</TableCell>
//                 <TableCell>{expense.amount.toLocaleString()} €</TableCell>
//                 <TableCell>{expense.category}</TableCell>
//                 <TableCell>
//                   <Badge
//                     className={`${
//                       expense.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : expense.status === "pending"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : "bg-red-100 text-red-800"
//                     } text-xs`}
//                   >
//                     {expense.status}
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="flex justify-end space-x-2">
//                   {expense.status === "pending" ? (
//                     <>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleApproveExpense(expense.id)}
//                       >
//                         Approve
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleRejectExpense(expense.id)}
//                       >
//                         Reject
//                       </Button>
//                     </>
//                   ) : null}
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     // onClick={() => downloadFile(expense.file)}
//                   >
//                     View
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }
// ------------------------------------------------------------
// "use client";

// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import SearchBar from "./SearchBar";
// import ExpenseButtons from "./ExpenseButtons";
// import type { ExpenseStatus } from "@prisma/client";
// import { Expense, Bill, File } from "@prisma/client";
// import { User } from "@prisma/client";
// import { Project } from "@prisma/client";

// import {
//   getExpenses,
//   updateExpense,
//   deleteExpense,
// } from "@/lib/api/expenseClient";

// export default function ExpenseTable() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expenses, setExpenses] = useState<
//     (Expense & {
//       user: User;
//       project: Project;
//       file: File;
//       bills: (Bill & { files: File[] })[];
//     })[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   const [activeTab, setActiveTab] = useState("all");

//   useEffect(() => {
//     const fetchExpenses = async () => {
//       try {
//         setIsLoading(true);
//         const data = await getExpenses();
//         setExpenses(data);
//       } catch (error) {
//         console.error("Error fetching expenses:", error);
//         setError(error as any);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchExpenses();
//   }, []);

//   const filteredExpenses = expenses.filter(
//     (expense) =>
//       (expense.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         expense.projectId.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (activeTab === "all" || expense.category === activeTab)
//   );

//   const downloadFile = async (fileId: string) => {
//     window.open(`/api/download/${fileId}`, "_blank");
//   };

//   if (isLoading) {
//     return <div>Loading expenses...</div>;
//   }

//   if (error) {
//     return <div>Error loading expenses: {error.message}</div>;
//   }

//   return (
//     <div className="flex">
//       <Tabs
//         orientation="vertical"
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className="w-48"
//       >
//         <TabsList className="flex flex-col h-full">
//           <TabsTrigger value="all">All Expenses</TabsTrigger>
//           <TabsTrigger value="travel">Travel</TabsTrigger>
//           <TabsTrigger value="reimbursement">Reimbursement</TabsTrigger>
//         </TabsList>
//       </Tabs>
//       <div className="flex-1 ml-4">
//         <SearchBar
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>User</TableHead>
//               <TableHead>Project</TableHead>
//               <TableHead>Amount</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>
//                 <span className="sr-only">Actions</span>
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredExpenses.map((expense) => (
//               <TableRow key={expense.id}>
//                 <TableCell>{expense.user.name}</TableCell>
//                 <TableCell>{expense.project.name}</TableCell>
//                 <TableCell>{expense.amount.toLocaleString()} €</TableCell>
//                 <TableCell>{expense.category}</TableCell>
//                 <TableCell>
//                   <Badge
//                     className={`${
//                       expense.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : expense.status === "pending"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : "bg-blue-100 text-blue-800"
//                     } text-xs`}
//                   >
//                     {expense.status}
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="flex justify-end space-x-2">
//                   <ExpenseButtons
//                     expenseId={expense.id}
//                     status={expense.status}
//                     onStatusChange={(newStatus) => {
//                       setExpenses((prevExpenses) =>
//                         prevExpenses.map((e) =>
//                           e.id === expense.id ? { ...e, status: newStatus } : e
//                         )
//                       );
//                     }}
//                     onDelete={() => {
//                       setExpenses((prevExpenses) =>
//                         prevExpenses.filter((e) => e.id !== expense.id)
//                       );
//                     }}
//                     fileUrl={expense.bills?.[0]?.files?.[0]?.fileUrl || ""}
//                     fileName={expense.bills[0]?.files[0]?.filename || ""}
//                     fileType={
//                       expense.bills[0]?.files[0]?.mimeType?.startsWith("image/")
//                         ? "image"
//                         : "pdf"
//                     }
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }
// ------------------------------------------------------------
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchBar from "./SearchBar";
import ExpenseButtons from "./ExpenseButtons";
import type { ExpenseStatus } from "@prisma/client";
import { Expense, Bill, File } from "@prisma/client";
import { User } from "@prisma/client";
import { Project } from "@prisma/client";

import {
  getExpenses,
  updateExpense,
  deleteExpense,
} from "@/lib/api/expenseClient";

export default function ExpenseTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expenses, setExpenses] = useState<
    (Expense & {
      user: User;
      project: Project;
      file: File;
      bills: (Bill & { files: File[] })[];
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setIsLoading(true);
        const data = await getExpenses();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError(
          error instanceof Error
            ? error
            : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter(
    (expense) =>
      (expense.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.projectId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeTab === "all" || expense.category === activeTab)
  );

  if (isLoading) {
    return <div>Loading expenses...</div>;
  }

  if (error) {
    return <div>Error loading expenses: {error.message}</div>;
  }

  return (
    <div className="flex">
      <Tabs
        orientation="vertical"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-48"
      >
        <TabsList className="flex flex-col h-full">
          <TabsTrigger value="all">All Expenses</TabsTrigger>
          <TabsTrigger value="travel">Travel</TabsTrigger>
          <TabsTrigger value="reimbursement">Reimbursement</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex-1 ml-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.user.name}</TableCell>
                <TableCell>{expense.project.name}</TableCell>
                <TableCell>{expense.amount.toLocaleString()} €</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      expense.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : expense.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    } text-xs`}
                  >
                    {expense.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end space-x-2">
                  <ExpenseButtons
                    expenseId={expense.id}
                    status={expense.status}
                    onStatusChange={(newStatus) => {
                      setExpenses((prevExpenses) =>
                        prevExpenses.map((e) =>
                          e.id === expense.id ? { ...e, status: newStatus } : e
                        )
                      );
                    }}
                    onDelete={() => {
                      setExpenses((prevExpenses) =>
                        prevExpenses.filter((e) => e.id !== expense.id)
                      );
                    }}
                    fileId={expense.bills?.[0]?.files?.[0]?.id}
                    fileName={expense.bills[0]?.files[0]?.filename || ""}
                    fileType={
                      expense.bills[0]?.files[0]?.mimeType?.startsWith("image/")
                        ? "image"
                        : "pdf"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
