// // Path: src/components/admin-dashboard/ProjectExport.tsx
// // Component: ProjectExport for exporting project data as CSV
// import React, { useState, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";
// import { saveAs } from "file-saver";
// import { Download, Loader2, CheckCircle2, Search, X } from "lucide-react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
// } from "@/components/ui/drawer";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { getProjectForExport } from "@/lib/api/projectClient";

// interface ProjectExportProps {
//   projectId: string;
//   projectName: string;
// }

// function calculateNetAmount(amount: number, category: string): number {
//   const taxRate = category === "reimbursement" ? 19 : 7;
//   const netAmount = amount / (1 + taxRate / 100);
//   return parseFloat(netAmount.toFixed(2));
// }

// function formatCurrency(amount: number): string {
//   return `${amount.toFixed(2)} €`;
// }

// export function ProjectExport({ projectId, projectName }: ProjectExportProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [data, setData] = useState<any[]>([]);
//   const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   const headers = [
//     "Number",
//     "Date",
//     "Amount",
//     "Net Amount",
//     "Description",
//     "Category",
//     "Status",
//     "User",
//     "Travel Start Date",
//     "Travel End Date",
//   ];

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const fetchedData = await getProjectForExport(projectId);
//       if (!Array.isArray(fetchedData) || fetchedData.length === 0) {
//         throw new Error("No data available for export");
//       }

//       const dataWithNetAmount = fetchedData.map((item) => ({
//         ...item,
//         amount: formatCurrency(item.amount),
//         netamount: formatCurrency(
//           calculateNetAmount(item.amount, item.category.toLowerCase())
//         ),
//       }));

//       setData(dataWithNetAmount);
//       setSelectedColumns(headers);
//       setIsDrawerOpen(true);
//     } catch (error) {
//       console.error("Error fetching project data:", error);
//       toast.error(
//         error instanceof Error ? error.message : "An unknown error occurred"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleExport = useCallback(() => {
//     if (selectedColumns.length === 0) {
//       toast.error("Please select at least one column to export");
//       return;
//     }

//     const csvContent = [
//       selectedColumns.join(","),
//       ...data.map((row) =>
//         selectedColumns
//           .map((header) => {
//             const value = row[header.toLowerCase().replace(/ /g, "")];
//             return typeof value === "string" && value.includes(",")
//               ? `"${value.replace(/"/g, '""')}"`
//               : value;
//           })
//           .join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, `${projectName}_export.csv`);
//     toast.success("Project data exported successfully");
//     setIsDrawerOpen(false);
//   }, [selectedColumns, data, projectName]);

//   const toggleColumnSelection = useCallback((column: string) => {
//     setSelectedColumns((prev) =>
//       prev.includes(column)
//         ? prev.filter((col) => col !== column)
//         : [...prev, column]
//     );
//   }, []);

//   const filteredData = data.filter((row) =>
//     Object.values(row).some((value) =>
//       String(value).toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Button
//             onClick={fetchData}
//             disabled={isLoading}
//             className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
//           >
//             {isLoading ? (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//               <Download className="mr-2 h-4 w-4" />
//             )}
//             <span>{isLoading ? "Loading..." : "Export Project Data"}</span>
//           </Button>
//         </TooltipTrigger>
//         <TooltipContent>
//           <p>Select columns and download project data as CSV</p>
//         </TooltipContent>
//       </Tooltip>

//       <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
//         <DrawerContent className="max-w-6xl mx-auto">
//           <DrawerHeader className="border-b border-border pb-4">
//             <DrawerTitle className="text-2xl font-bold text-primary">
//               Export Project Data
//             </DrawerTitle>
//             <DrawerDescription className="text-muted-foreground">
//               Select the columns you want to include in the CSV export.
//             </DrawerDescription>
//           </DrawerHeader>
//           <div className="p-4 space-y-4">
//             <div className="flex flex-wrap gap-2">
//               {headers.map((header) => (
//                 <Badge
//                   key={header}
//                   variant={
//                     selectedColumns.includes(header) ? "default" : "destructive"
//                   }
//                   className={`cursor-pointer transition-colors ${
//                     selectedColumns.includes(header)
//                       ? "bg-green-100 text-green-800 hover:bg-green-200"
//                       : "bg-red-100 text-red-800 hover:bg-red-200"
//                   }`}
//                   onClick={() => toggleColumnSelection(header)}
//                 >
//                   {header}
//                   {selectedColumns.includes(header) && (
//                     <CheckCircle2 className="ml-1 h-3 w-3" />
//                   )}
//                 </Badge>
//               ))}
//             </div>
//             <div className="relative">
//               <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 type="text"
//                 placeholder="Search data..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-8"
//               />
//               {searchTerm && (
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2"
//                   onClick={() => setSearchTerm("")}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>
//           </div>
//           <ScrollArea className="flex-1 p-4 h-[50vh]">
//             <Table className="border border-border rounded-lg">
//               <TableHeader>
//                 <TableRow>
//                   {headers.map((header) => (
//                     <TableHead
//                       key={header}
//                       className={`font-semibold text-primary ${
//                         selectedColumns.includes(header) ? "" : "hidden"
//                       }`}
//                     >
//                       {header}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredData.map((row, index) => (
//                   <TableRow
//                     key={index}
//                     className={index % 2 === 0 ? "bg-muted/50" : ""}
//                   >
//                     {headers.map((header) => (
//                       <TableCell
//                         key={`${index}-${header}`}
//                         className={`p-2 ${
//                           selectedColumns.includes(header) ? "" : "hidden"
//                         }`}
//                       >
//                         {row[header.toLowerCase().replace(/ /g, "")]}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </ScrollArea>
//           <DrawerFooter className="border-t border-border pt-4">
//             <div className="flex justify-between items-center w-full mb-4">
//               <span className="text-sm text-muted-foreground">
//                 {selectedColumns.length} of {headers.length} columns selected |
//                 Showing {filteredData.length} of {data.length} rows
//               </span>
//               <div className="space-x-2">
//                 <Button
//                   onClick={handleExport}
//                   className="bg-primary hover:bg-primary/90 text-primary-foreground"
//                 >
//                   Download Selected ({selectedColumns.length})
//                 </Button>
//                 <DrawerClose asChild>
//                   <Button variant="outline" size="sm">
//                     Cancel
//                   </Button>
//                 </DrawerClose>
//               </div>
//             </div>
//           </DrawerFooter>
//         </DrawerContent>
//       </Drawer>
//     </TooltipProvider>
//   );
// }
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import { Download, Loader2, CheckCircle2, Search, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { getProjectForExport } from "@/lib/api/projectClient";
import { Expense, ExpenseStatus } from "@prisma/client";

interface ProjectExportProps {
  projectId: string;
  projectName: string;
}

function formatCurrency(
  amount: number | string | null | undefined,
  currencyCode: string = "€"
): string {
  if (amount === null || amount === undefined) {
    return `0.00 ${currencyCode}`;
  }
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) {
    return `0.00 ${currencyCode}`;
  }
  return `${numericAmount.toFixed(2)} ${currencyCode}`;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const dateObject = date instanceof Date ? date : new Date(date);
  return dateObject.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function ProjectExport({ projectId, projectName }: ProjectExportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const headers = [
    "Number",
    "Date",
    "Gross Amount",
    "Net Amount",
    "Description",
    "Category",
    "Status",
    "User",
    "Travel Start Date",
    "Travel End Date",
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchedData = await getProjectForExport(projectId);
      if (!Array.isArray(fetchedData) || fetchedData.length === 0) {
        throw new Error("No data available for export");
      }
      // Path: src/components/admin-dashboard/ProjectExport.tsx
      const dataWithFormattedFields = fetchedData.map(
        // @ts-ignore
        (item: Expense, index: number) => {
          console.log("Processing item:", item); // Debug log
          return {
            number: index + 1,
            date: formatDate(item.createdAt),
            grossamount: formatCurrency(item.grossAmount),
            netamount: formatCurrency(item.netAmount),
            description: item.description || "",
            category: item.category || "",
            status: item.status as ExpenseStatus,
            user: item.userId || "",
            travelstartdate: formatDate(item.travelStartDate),
            travelenddate: formatDate(item.travelEndDate),
          };
        }
      );

      console.log("Formatted data:", dataWithFormattedFields); // Debug log
      setData(dataWithFormattedFields);
      setSelectedColumns(headers);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching project data:", error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = useCallback(() => {
    if (selectedColumns.length === 0) {
      toast.error("Please select at least one column to export");
      return;
    }

    const csvContent = [
      selectedColumns.join(","),
      ...data.map((row) =>
        selectedColumns
          .map((header) => {
            const value = row[header.toLowerCase().replace(/ /g, "")];
            return typeof value === "string" && value.includes(",")
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${projectName}_export.csv`);
    toast.success("Project data exported successfully");
    setIsDrawerOpen(false);
  }, [selectedColumns, data, projectName]);

  const toggleColumnSelection = useCallback((column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  }, []);

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totals = {
    grossAmount: formatCurrency(
      data.reduce((sum, item) => sum + parseFloat(item.grossamount) || 0, 0)
    ),
    netAmount: formatCurrency(
      data.reduce((sum, item) => sum + parseFloat(item.netamount) || 0, 0)
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={fetchData}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            <span>{isLoading ? "Loading..." : "Export Project Data"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Select columns and download project data as CSV</p>
        </TooltipContent>
      </Tooltip>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-8xl mx-auto">
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle className="text-2xl font-bold text-primary">
              Export Project Data
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Select the columns you want to include in the CSV export.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {headers.map((header) => (
                <Badge
                  key={header}
                  variant={
                    selectedColumns.includes(header) ? "default" : "destructive"
                  }
                  className={`cursor-pointer transition-colors ${
                    selectedColumns.includes(header)
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                  onClick={() => toggleColumnSelection(header)}
                >
                  {header}
                  {selectedColumns.includes(header) && (
                    <CheckCircle2 className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <ScrollArea className="flex-1 p-4 h-[50vh]">
            <Table className="border border-border rounded-lg">
              <TableHeader>
                <TableRow>
                  {headers.map((header) => (
                    <TableHead
                      key={header}
                      className={`font-semibold text-primary ${
                        selectedColumns.includes(header) ? "" : "hidden"
                      }`}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow
                    key={index}
                    className={index % 2 === 0 ? "bg-muted/50" : ""}
                  >
                    {headers.map((header) => (
                      <TableCell
                        key={`${index}-${header}`}
                        className={`p-2 ${
                          selectedColumns.includes(header) ? "" : "hidden"
                        }`}
                      >
                        {row[header.toLowerCase().replace(/ /g, "")]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2}>Totals</TableCell>
                  <TableCell>{totals.grossAmount}</TableCell>
                  <TableCell>{totals.netAmount}</TableCell>
                  <TableCell colSpan={6}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ScrollArea>
          <DrawerFooter className="border-t border-border pt-4">
            <div className="flex justify-between items-center w-full mb-4">
              <span className="text-sm text-muted-foreground">
                {selectedColumns.length} of {headers.length} columns selected |
                Showing {filteredData.length} of {data.length} rows
              </span>
              <div className="space-x-2">
                <Button
                  onClick={handleExport}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Download Selected ({selectedColumns.length})
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </TooltipProvider>
  );
}
