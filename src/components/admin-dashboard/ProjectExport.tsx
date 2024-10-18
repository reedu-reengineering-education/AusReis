// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";
// import { saveAs } from "file-saver";
// import { Download, Loader2 } from "lucide-react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { getProjectForExport } from "@/lib/api/projectClient";

// interface ProjectExportProps {
//   projectId: string;
//   projectName: string;
// }

// export function ProjectExport({ projectId, projectName }: ProjectExportProps) {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleExport = async () => {
//     setIsLoading(true);
//     console.log("Export started for project:", projectId, projectName);
//     try {
//       console.log("Fetching data from API...");
//       const data = await getProjectForExport(projectId, true);
//       console.log("Data received:", data);

//       if (!Array.isArray(data) || data.length === 0) {
//         throw new Error("No data available for export");
//       }

//       // Convert JSON to CSV
//       console.log("Converting data to CSV...");
//       const headers = [
//         "Number",
//         "Date",
//         "Amount",
//         "Description",
//         "Category",
//         "Status",
//         "User",
//         "Travel Start Date",
//         "Travel End Date",
//         "Bills Count",
//         "Files Count",
//       ];
//       const csvContent = [
//         headers.join(","),
//         ...data.map((row: any) =>
//           [
//             row.number,
//             row.date,
//             row.amount,
//             `"${(row.description || "").replace(/"/g, '""')}"`,
//             row.category,
//             row.status,
//             `"${(row.user || "").replace(/"/g, '""')}"`,
//             row.travelStartDate || "",
//             row.travelEndDate || "",
//             row.billsCount,
//             row.filesCount,
//           ].join(",")
//         ),
//       ].join("\n");

//       console.log("CSV Content:", csvContent);

//       // Create Blob and save file
//       console.log("Creating and saving CSV file...");
//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

//       try {
//         saveAs(blob, `${projectName}_export.csv`);
//         console.log("File saved successfully");
//       } catch (saveError) {
//         console.error("Error saving file:", saveError);
//         throw new Error("Failed to save file");
//       }

//       console.log("Export completed successfully");
//       toast.success("Project data exported successfully");
//     } catch (error) {
//       console.error("Error exporting project data:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error";
//       toast.error(`Failed to export project data: ${errorMessage}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Button
//             onClick={handleExport}
//             disabled={isLoading}
//             className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
//           >
//             {isLoading ? (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//               <Download className="mr-2 h-4 w-4" />
//             )}
//             <span>{isLoading ? "Exporting..." : "Export Project Data"}</span>
//           </Button>
//         </TooltipTrigger>
//         <TooltipContent>
//           <p>Download project data as CSV</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   );
// }
// components/ProjectExport.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import { Download, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProjectForExport } from "@/lib/api/projectClient";

interface ProjectExportProps {
  projectId: string;
  projectName: string;
}

export function ProjectExport({ projectId, projectName }: ProjectExportProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    console.log("Export started for project:", projectId, projectName);
    try {
      console.log("Fetching data from API...");
      const data = await getProjectForExport(projectId);
      console.log("Data received:", data);

      if (!Array.isArray(data) || data.length === 0) {
        console.log("No data available for export");
        throw new Error("No data available for export");
      }

      // Convert JSON to CSV
      console.log("Converting data to CSV...");
      const headers = [
        "Number",
        "Date",
        "Amount",
        "Description",
        "Category",
        "Status",
        "User",
        "Travel Start Date",
        "Travel End Date",
        "Bills Count",
        "Files Count",
      ];
      const csvContent = [
        headers.join(","),
        ...data.map((row: any) =>
          [
            row.number,
            row.date,
            row.amount,
            `"${(row.description || "").replace(/"/g, '""')}"`,
            row.category,
            row.status,
            `"${(row.user || "").replace(/"/g, '""')}"`,
            row.travelStartDate || "",
            row.travelEndDate || "",
            row.billsCount,
            row.filesCount,
          ].join(",")
        ),
      ].join("\n");

      console.log("CSV Content:", csvContent);

      // Create Blob and save file
      console.log("Creating and saving CSV file...");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      saveAs(blob, `${projectName}_export.csv`);
      console.log("File saved successfully");

      console.log("Export completed successfully");
      toast.success("Project data exported successfully");
    } catch (error) {
      console.error("Error exporting project data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to export project data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleExport}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            <span>{isLoading ? "Exporting..." : "Export Project Data"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download project data as CSV</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
