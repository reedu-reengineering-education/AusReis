// // Path: src/components/user-account/SharedExpenseTable.tsx
// // Component: SharedExpenseTable for displaying shared expenses in travel costs and reimbursement cost on the user account page
// import React from "react";
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
// import { Input } from "@/components/ui/input";
// import { AddFormModal } from "./AddFormModal";
// import { UniversalDeleteDialog } from "../forms/UniversalDeleteButton";

// interface SharedExpenseTableProps {
//   category: "reimbursement" | "travel";
//   expenses: any[];
//   isLoading: boolean;
//   searchTerm: string;
//   setSearchTerm: (value: string) => void;
//   handleAddNewClick: () => void;
//   handleFormSubmit: (formData: any) => Promise<void>;
//   handleDelete: (id: string) => Promise<void>;
// }

// export default function SharedExpenseTable({
//   category,
//   expenses,
//   isLoading,
//   searchTerm,
//   setSearchTerm,
//   handleAddNewClick,
//   handleFormSubmit,
//   handleDelete,
// }: SharedExpenseTableProps) {
//   const filteredResults = expenses.filter((item: any) => {
//     if (searchTerm === "") return true;

//     const searchLower = searchTerm.toLowerCase();
//     return (
//       item.description.toLowerCase().includes(searchLower) ||
//       item.project.name.toLowerCase().includes(searchLower) ||
//       item.status.toLowerCase().includes(searchLower) ||
//       item.amount.toString().includes(searchLower) ||
//       new Date(item.createdAt)
//         .toLocaleDateString("de-DE", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         })
//         .toLowerCase()
//         .includes(searchLower)
//     );
//   });

//   const handleDeleteSuccess = async (id: string, message: string) => {
//     await handleDelete(id);
//     console.log(message); // Sie können hier auch einen Toast verwenden
//   };

//   return (
//     <div>
//       <div className="flex items-center gap-4 mb-4">
//         <Input
//           placeholder={`Suchen nach ${
//             category === "reimbursement" ? "Auslagen" : "Reisekosten"
//           }, Projekten, Status, Betrag oder Datum...`}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="bg-background"
//         />
//         <AddFormModal
//           activeTab={category === "reimbursement" ? "expenses" : "travel"}
//           setShowAddForm={handleAddNewClick}
//           handleFormSubmit={handleFormSubmit}
//         />
//       </div>

//       {isLoading ? (
//         <p>
//           Lade {category === "reimbursement" ? "Auslagen" : "Reisekosten"}...
//         </p>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Titel</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Datum</TableHead>
//               <TableHead>Betrag</TableHead>
//               <TableHead>Projekt</TableHead>
//               <TableHead>
//                 <span className="sr-only">Aktionen</span>
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredResults.map((item) => (
//               <TableRow key={item.id}>
//                 <TableCell>{item.description}</TableCell>
//                 <TableCell>
//                   <Badge
//                     className={`${
//                       item.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : item.status === "pending"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : "bg-blue-100 text-blue-800"
//                     } text-xs`}
//                   >
//                     {item.status}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   {new Date(item.createdAt).toLocaleDateString("de-DE", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </TableCell>
//                 <TableCell>{item.amount.toLocaleString()} €</TableCell>
//                 <TableCell>{item.project.name}</TableCell>
//                 <TableCell>
//                   <div className="flex space-x-2">
//                     <UniversalDeleteDialog
//                       item={{ id: item.id, name: item.description }}
//                       itemType={
//                         category === "reimbursement" ? "Auslage" : "Reisekosten"
//                       }
//                       onDelete={handleDeleteSuccess}
//                       onClose={() => {}}
//                       triggerButton={
//                         <Button variant="destructive" size="sm">
//                           Delete
//                         </Button>
//                       }
//                     />
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// }
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AddFormModal } from "./AddFormModal";
import { UniversalDeleteDialog } from "../forms/UniversalDeleteButton";

interface SharedExpenseTableProps {
  category: "reimbursement" | "travel";
  expenses: any[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleAddNewClick: () => void;
  handleFormSubmit: (formData: any) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

export default function SharedExpenseTable({
  category,
  expenses,
  isLoading,
  searchTerm,
  setSearchTerm,
  handleAddNewClick,
  handleFormSubmit,
  handleDelete,
}: SharedExpenseTableProps) {
  const filteredResults = expenses.filter((item: any) => {
    if (searchTerm === "") return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      item.description.toLowerCase().includes(searchLower) ||
      item.project.name.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower) ||
      item.grossAmount.toString().includes(searchLower) ||
      item.netAmount.toString().includes(searchLower) ||
      new Date(item.createdAt)
        .toLocaleDateString("de-DE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        .toLowerCase()
        .includes(searchLower)
    );
  });

  const handleDeleteSuccess = async (id: string, message: string) => {
    await handleDelete(id);
    console.log(message); // Sie können hier auch einen Toast verwenden
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder={`Suchen nach ${
            category === "reimbursement" ? "Auslagen" : "Reisekosten"
          }, Projekten, Status, Betrag oder Datum...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-background"
        />
        <AddFormModal
          activeTab={category === "reimbursement" ? "expenses" : "travel"}
          setShowAddForm={handleAddNewClick}
          handleFormSubmit={handleFormSubmit}
        />
      </div>

      {isLoading ? (
        <p>
          Lade {category === "reimbursement" ? "Auslagen" : "Reisekosten"}...
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Bruttobetrag</TableHead>
              <TableHead>Nettobetrag</TableHead>
              <TableHead>Projekt</TableHead>
              <TableHead>
                <span className="sr-only">Aktionen</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      item.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : item.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    } text-xs`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>{item.grossAmount.toLocaleString()} €</TableCell>
                <TableCell>{item.netAmount.toLocaleString()} €</TableCell>
                <TableCell>{item.project.name}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <UniversalDeleteDialog
                      item={{ id: item.id, name: item.description }}
                      itemType={
                        category === "reimbursement" ? "Auslage" : "Reisekosten"
                      }
                      onDelete={handleDeleteSuccess}
                      onClose={() => {}}
                      triggerButton={
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
