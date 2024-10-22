// "use client";

// import { useState, useEffect, SetStateAction } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { DetailsModal } from "./DetailsModal";
// import SharedExpenseTable from "./SharedExpenseTable";
// import { BillsModal } from "./ViewModal";
// import DashboardCardsUser from "@/components/user-account/DashboardCardsUser";
// import {
//   getExpenses,
//   createExpense,
//   deleteExpense,
// } from "@/lib/api/expenseClient";
// import { createFormData } from "@/helpers/fileUploadHelpers";
// import { toast } from "react-toastify";

// export default function UserAccountPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState<
//     "dashboard" | "expenses" | "travel"
//   >("dashboard");
//   const [showDetails, setShowDetails] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showBills, setShowBills] = useState(false);
//   const [openExpensesCount, setOpenExpensesCount] = useState(0);
//   const [approvedExpensesCount, setApprovedExpensesCount] = useState(0);
//   const [rejectedExpensesCount, setRejectedExpensesCount] = useState(0);
//   const [openTravelsCount, setOpenTravelsCount] = useState(0);
//   const [approvedTravelsCount, setApprovedTravelsCount] = useState(0);
//   const [rejectedTravelsCount, setRejectedTravelsCount] = useState(0);
//   const [expenses, setExpenses] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   useEffect(() => {
//     async function loadData() {
//       setIsLoading(true);
//       try {
//         const data = await getExpenses();
//         setExpenses(data);

//         const openExpenses = data.filter(
//           (item: any) =>
//             item.category === "reimbursement" && item.status === "open"
//         ).length;
//         const approvedExpenses = data.filter(
//           (item: any) =>
//             item.category === "reimbursement" && item.status === "approved"
//         ).length;
//         const rejectedExpenses = data.filter(
//           (item: any) =>
//             item.category === "reimbursement" && item.status === "rejected"
//         ).length;
//         const openTravels = data.filter(
//           (item: any) => item.category === "travel" && item.status === "open"
//         ).length;
//         const approvedTravels = data.filter(
//           (item: any) =>
//             item.category === "travel" && item.status === "approved"
//         ).length;
//         const rejectedTravels = data.filter(
//           (item: any) =>
//             item.category === "travel" && item.status === "rejected"
//         ).length;

//         setOpenExpensesCount(openExpenses);
//         setApprovedExpensesCount(approvedExpenses);
//         setRejectedExpensesCount(rejectedExpenses);
//         setOpenTravelsCount(openTravels);
//         setApprovedTravelsCount(approvedTravels);
//         setRejectedTravelsCount(rejectedTravels);
//       } catch (error) {
//         console.error("Error loading data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     loadData();
//   }, []);

//   const handleViewDetails = (item: SetStateAction<null>) => {
//     setSelectedItem(item);
//     setShowDetails(true);
//   };

//   const handleAddNewClick = () => {
//     setShowAddForm(true);
//   };

//   const handleFormSubmit = async (formData: any) => {
//     try {
//       const uploadFormData = createFormData(
//         formData.bills.map((bill: any) => bill.file)
//       );

//       const response = await fetch("/api/upload/files", {
//         method: "POST",
//         body: uploadFormData,
//       });

//       if (response.ok) {
//         const responseData = await response.json();
//         const newExpense = await createExpense(formData, responseData.data);
//         setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
//         toast.success(
//           `${
//             formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
//           } erfolgreich erstellt`
//         );
//       } else {
//         throw new Error("Fehler beim Hochladen");
//       }
//     } catch (error) {
//       console.error("Error creating expense:", error);
//       toast.error(
//         `Fehler beim Erstellen der ${
//           formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
//         }`
//       );
//     }
//   };

//   const handleDelete = async (expenseId: string) => {
//     try {
//       await deleteExpense(expenseId);
//       setExpenses((prevExpenses) =>
//         prevExpenses.filter((expense) => expense.id !== expenseId)
//       );
//       toast.success("Eintrag erfolgreich gelöscht");
//     } catch (error) {
//       console.error("Error deleting expense:", error);
//       toast.error("Fehler beim Löschen des Eintrags");
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
//       <Tabs
//         value={activeTab}
//         onValueChange={(value: string) =>
//           setActiveTab(value as "dashboard" | "expenses" | "travel")
//         }
//         className="w-full"
//       >
//         <TabsList className="flex border-b">
//           <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
//           <TabsTrigger value="expenses">Auslagen</TabsTrigger>
//           <TabsTrigger value="travel">Reisekosten</TabsTrigger>
//         </TabsList>

//         <TabsContent value="dashboard">
//           <DashboardCardsUser
//             openExpensesCount={openExpensesCount}
//             approvedExpensesCount={approvedExpensesCount}
//             rejectedExpensesCount={rejectedExpensesCount}
//             openTravelsCount={openTravelsCount}
//             approvedTravelsCount={approvedTravelsCount}
//             rejectedTravelsCount={rejectedTravelsCount}
//           />
//         </TabsContent>

//         <TabsContent value="expenses">
//           <SharedExpenseTable
//             category="reimbursement"
//             expenses={expenses.filter(
//               (item) => item.category === "reimbursement"
//             )}
//             isLoading={isLoading}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             handleAddNewClick={handleAddNewClick}
//             handleViewDetails={handleViewDetails}
//             handleFormSubmit={handleFormSubmit}
//             handleDelete={handleDelete}
//           />
//         </TabsContent>

//         <TabsContent value="travel">
//           <SharedExpenseTable
//             category="travel"
//             expenses={expenses.filter((item) => item.category === "travel")}
//             isLoading={isLoading}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             handleAddNewClick={handleAddNewClick}
//             handleViewDetails={handleViewDetails}
//             handleFormSubmit={handleFormSubmit}
//             handleDelete={handleDelete}
//           />
//         </TabsContent>
//       </Tabs>

//       {showDetails && selectedItem && (
//         <DetailsModal
//           selectedItem={selectedItem}
//           setShowDetails={setShowDetails}
//         />
//       )}

//       {showBills && selectedItem && (
//         <BillsModal selectedItem={selectedItem} setShowDetails={setShowBills} />
//       )}
//     </div>
//   );
// }
// ---------------------------------------------------------------------------
// "use client";

// import { useState, useEffect, SetStateAction } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { DetailsModal } from "./DetailsModal";
// import SharedExpenseTable from "./SharedExpenseTable";
// import { BillsModal } from "./ViewModal";
// import DashboardCardsUser from "@/components/user-account/DashboardCardsUser";
// import {
//   getExpenses,
//   createExpense,
//   deleteExpense,
// } from "@/lib/api/expenseClient";
// import { toast } from "react-toastify";
// import axios from "axios";

// export default function UserAccountPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState<
//     "dashboard" | "expenses" | "travel"
//   >("dashboard");
//   const [showDetails, setShowDetails] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showBills, setShowBills] = useState(false);
//   const [openExpensesCount, setOpenExpensesCount] = useState(0);
//   const [approvedExpensesCount, setApprovedExpensesCount] = useState(0);
//   const [rejectedExpensesCount, setRejectedExpensesCount] = useState(0);
//   const [openTravelsCount, setOpenTravelsCount] = useState(0);
//   const [approvedTravelsCount, setApprovedTravelsCount] = useState(0);
//   const [rejectedTravelsCount, setRejectedTravelsCount] = useState(0);
//   const [expenses, setExpenses] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   useEffect(() => {
//     async function loadData() {
//       setIsLoading(true);
//       try {
//         const data = await getExpenses();
//         setExpenses(data);

//         const openExpenses = data.filter(
//           (item: any) =>
//             item.category === "reimbursement" && item.status === "pending"
//         ).length;
//         const approvedExpenses = data.filter(
//           (item: any) =>
//             item.category === "reimbursement" && item.status === "processed"
//         ).length;
//         const rejectedExpenses = data.filter(
//           (item: any) =>
//             item.category === "reimbursement" && item.status === "paid"
//         ).length;
//         const openTravels = data.filter(
//           (item: any) => item.category === "travel" && item.status === "pending"
//         ).length;
//         const approvedTravels = data.filter(
//           (item: any) =>
//             item.category === "travel" && item.status === "processed"
//         ).length;
//         const rejectedTravels = data.filter(
//           (item: any) => item.category === "travel" && item.status === "paid"
//         ).length;

//         setOpenExpensesCount(openExpenses);
//         setApprovedExpensesCount(approvedExpenses);
//         setRejectedExpensesCount(rejectedExpenses);
//         setOpenTravelsCount(openTravels);
//         setApprovedTravelsCount(approvedTravels);
//         setRejectedTravelsCount(rejectedTravels);
//       } catch (error) {
//         console.error("Error loading data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     loadData();
//   }, []);

//   const handleViewDetails = (item: SetStateAction<null>) => {
//     setSelectedItem(item);
//     setShowDetails(true);
//   };

//   const handleAddNewClick = () => {
//     setShowAddForm(true);
//   };

//   const handleFormSubmit = async (formData: any) => {
//     try {
//       const uploadedFiles = await Promise.all(
//         formData.bills.map(async (bill: any) => {
//           const uploadFormData = new FormData();
//           uploadFormData.append("file", bill.file);
//           const response = await axios.post(
//             "/api/upload/files",
//             uploadFormData,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           return {
//             ...bill,
//             file: {
//               id: response.data.data.id,
//               name: bill.file.name,
//               size: bill.file.size,
//               type: bill.file.type,
//             },
//           };
//         })
//       );

//       const updatedFormData = {
//         ...formData,
//         bills: uploadedFiles.map((file) => ({
//           fileId: file.file.id,
//           amount: file.amount,
//         })),
//       };

//       const newExpense = await createExpense(updatedFormData);
//       setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
//       toast.success(
//         `${
//           formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
//         } erfolgreich erstellt`
//       );
//     } catch (error) {
//       console.error("Error creating expense:", error);
//       if (error instanceof Error) {
//         toast.error(
//           `Fehler beim Erstellen der ${
//             formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
//           }: ${error.message}`
//         );
//       } else {
//         toast.error(
//           `Fehler beim Erstellen der ${
//             formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
//           }`
//         );
//       }
//     }
//   };

//   const handleDelete = async (expenseId: string) => {
//     try {
//       await deleteExpense(expenseId);
//       setExpenses((prevExpenses) =>
//         prevExpenses.filter((expense) => expense.id !== expenseId)
//       );
//       toast.success("Eintrag erfolgreich gelöscht");
//     } catch (error) {
//       console.error("Error deleting expense:", error);
//       toast.error("Fehler beim Löschen des Eintrags");
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
//       <Tabs
//         value={activeTab}
//         onValueChange={(value: string) =>
//           setActiveTab(value as "dashboard" | "expenses" | "travel")
//         }
//         className="w-full"
//       >
//         <TabsList className="flex border-b">
//           <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
//           <TabsTrigger value="expenses">Auslagen</TabsTrigger>
//           <TabsTrigger value="travel">Reisekosten</TabsTrigger>
//         </TabsList>

//         <TabsContent value="dashboard">
//           <DashboardCardsUser
//             openExpensesCount={openExpensesCount}
//             approvedExpensesCount={approvedExpensesCount}
//             rejectedExpensesCount={rejectedExpensesCount}
//             openTravelsCount={openTravelsCount}
//             approvedTravelsCount={approvedTravelsCount}
//             rejectedTravelsCount={rejectedTravelsCount}
//           />
//         </TabsContent>

//         <TabsContent value="expenses">
//           <SharedExpenseTable
//             category="reimbursement"
//             expenses={expenses.filter(
//               (item) => item.category === "reimbursement"
//             )}
//             isLoading={isLoading}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             handleAddNewClick={handleAddNewClick}
//             handleViewDetails={handleViewDetails}
//             handleFormSubmit={handleFormSubmit}
//             handleDelete={handleDelete}
//           />
//         </TabsContent>

//         <TabsContent value="travel">
//           <SharedExpenseTable
//             category="travel"
//             expenses={expenses.filter((item) => item.category === "travel")}
//             isLoading={isLoading}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             handleAddNewClick={handleAddNewClick}
//             handleViewDetails={handleViewDetails}
//             handleFormSubmit={handleFormSubmit}
//             handleDelete={handleDelete}
//           />
//         </TabsContent>
//       </Tabs>

//       {showDetails && selectedItem && (
//         <DetailsModal
//           selectedItem={selectedItem}
//           setShowDetails={setShowDetails}
//         />
//       )}

//       {showBills && selectedItem && (
//         <BillsModal selectedItem={selectedItem} setShowDetails={setShowBills} />
//       )}
//     </div>
//   );
// }
// ---------------------------------------------------------------------------
"use client";

import { useState, useEffect, SetStateAction } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DetailsModal } from "./DetailsModal";
import SharedExpenseTable from "./SharedExpenseTable";
import { BillsModal } from "./ViewModal";
import DashboardCardsUser from "@/components/user-account/DashboardCardsUser";
import {
  getExpenses,
  createExpense,
  deleteExpense,
} from "@/lib/api/expenseClient";
import { toast } from "react-toastify";
import axios from "axios";

export default function UserAccountPage() {
  console.log("UserAccountPage: Component rendering");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "expenses" | "travel"
  >("dashboard");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBills, setShowBills] = useState(false);
  const [openExpensesCount, setOpenExpensesCount] = useState(0);
  const [approvedExpensesCount, setApprovedExpensesCount] = useState(0);
  const [rejectedExpensesCount, setRejectedExpensesCount] = useState(0);
  const [openTravelsCount, setOpenTravelsCount] = useState(0);
  const [approvedTravelsCount, setApprovedTravelsCount] = useState(0);
  const [rejectedTravelsCount, setRejectedTravelsCount] = useState(0);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("UserAccountPage: searchTerm effect triggered", { searchTerm });
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    console.log("UserAccountPage: Data loading effect triggered");
    async function loadData() {
      setIsLoading(true);
      try {
        console.log("UserAccountPage: Fetching expenses");
        const data = await getExpenses();
        console.log("UserAccountPage: Expenses fetched", { data });
        setExpenses(data);

        const openExpenses = data.filter(
          (item: any) =>
            item.category === "reimbursement" && item.status === "pending"
        ).length;
        const approvedExpenses = data.filter(
          (item: any) =>
            item.category === "reimbursement" && item.status === "processed"
        ).length;
        const rejectedExpenses = data.filter(
          (item: any) =>
            item.category === "reimbursement" && item.status === "paid"
        ).length;
        const openTravels = data.filter(
          (item: any) => item.category === "travel" && item.status === "pending"
        ).length;
        const approvedTravels = data.filter(
          (item: any) =>
            item.category === "travel" && item.status === "processed"
        ).length;
        const rejectedTravels = data.filter(
          (item: any) => item.category === "travel" && item.status === "paid"
        ).length;

        console.log("UserAccountPage: Expense counts calculated", {
          openExpenses,
          approvedExpenses,
          rejectedExpenses,
          openTravels,
          approvedTravels,
          rejectedTravels,
        });

        setOpenExpensesCount(openExpenses);
        setApprovedExpensesCount(approvedExpenses);
        setRejectedExpensesCount(rejectedExpenses);
        setOpenTravelsCount(openTravels);
        setApprovedTravelsCount(approvedTravels);
        setRejectedTravelsCount(rejectedTravels);
      } catch (error) {
        console.error("UserAccountPage: Error loading data:", error);
      } finally {
        setIsLoading(false);
        console.log("UserAccountPage: Data loading completed");
      }
    }

    loadData();
  }, []);

  const handleViewDetails = (item: SetStateAction<null>) => {
    console.log("UserAccountPage: View details triggered", { item });
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleAddNewClick = () => {
    console.log("UserAccountPage: Add new clicked");
    setShowAddForm(true);
  };

  // const handleFormSubmit = async (formData: any) => {
  //   console.log("UserAccountPage: Form submit triggered", { formData });
  //   try {
  //     console.log("UserAccountPage: Starting file upload");
  //     // Component: UserAccountPage
  //     const uploadedFiles = await Promise.all(
  //       formData.bills.map(async (bill: any) => {
  //         const uploadFormData = new FormData();
  //         uploadFormData.append("file", bill.file);
  //         console.log("UserAccountPage: Uploading file", {
  //           // Component: UserAccountPage
  //           fileName: bill.file.name,
  //         });
  //         const response = await axios.post(
  //           "/api/upload/files",
  //           uploadFormData,
  //           {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //           }
  //         );
  //         console.log("UserAccountPage: File upload response", {
  //           response: response.data,
  //         });
  //         return {
  //           ...bill,
  //           file: {
  //             id: response.data.data.id,
  //             name: bill.file.name,
  //             size: bill.file.size,
  //             type: bill.file.type,
  //           },
  //         };
  //       })
  //     );

  //     console.log("UserAccountPage: All files uploaded", { uploadedFiles });

  //     const updatedFormData = {
  //       ...formData,
  //       bills: uploadedFiles.map((file) => ({
  //         fileId: file.file.id,
  //         amount: file.amount,
  //       })),
  //     };

  //     console.log("UserAccountPage: Creating expense with updated form data", {
  //       updatedFormData,
  //     });
  //     const newExpense = await createExpense(updatedFormData);
  //     console.log("UserAccountPage: New expense created", { newExpense });

  //     setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  //     toast.success(
  //       `${
  //         formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
  //       } erfolgreich erstellt`
  //     );
  //   } catch (error) {
  //     console.error("UserAccountPage: Error creating expense:", error);
  //     if (error instanceof Error) {
  //       toast.error(
  //         `Fehler beim Erstellen der ${
  //           formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
  //         }: ${error.message}`
  //       );
  //     } else {
  //       toast.error(
  //         `Fehler beim Erstellen der ${
  //           formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
  //         }`
  //       );
  //     }
  //   }
  // };
  const handleFormSubmit = async (formData: any) => {
    console.log(
      "UserAccountPage: Form submit triggered",
      JSON.stringify(formData, null, 2)
    );
    try {
      console.log("UserAccountPage: Processing bills");
      if (!formData.bills || !Array.isArray(formData.bills)) {
        console.error(
          "UserAccountPage: formData.bills is not an array",
          formData.bills
        );
        throw new Error("Invalid bills data");
      }

      const processedBills = formData.bills.map((bill: any, index: number) => {
        console.log(
          `UserAccountPage: Processing bill ${index}`,
          JSON.stringify(bill, null, 2)
        );
        if (
          !bill ||
          !bill.files ||
          !Array.isArray(bill.files) ||
          bill.files.length === 0
        ) {
          console.error(
            `UserAccountPage: Invalid bill at index ${index}`,
            bill
          );
          throw new Error(`Invalid bill data at index ${index}`);
        }

        const file = bill.files[0]; // Assuming we're only dealing with the first file
        return {
          id: bill.id, // Include the bill id
          fileId: file.id,
          amount: bill.amount,
          fileName: file.filename,
          fileSize: file.size,
          fileType: file.mimeType,
        };
      });

      console.log(
        "UserAccountPage: All bills processed",
        JSON.stringify(processedBills, null, 2)
      );

      const updatedFormData = {
        ...formData,
        bills: processedBills,
      };

      console.log(
        "UserAccountPage: Creating expense with updated form data",
        JSON.stringify(updatedFormData, null, 2)
      );
      const newExpense = await createExpense(updatedFormData);
      console.log(
        "UserAccountPage: New expense created",
        JSON.stringify(newExpense, null, 2)
      );

      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
      toast.success(
        `${
          formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
        } erfolgreich erstellt`
      );
    } catch (error) {
      console.error("UserAccountPage: Error creating expense:", error);
      if (error instanceof Error) {
        toast.error(
          `Fehler beim Erstellen der ${
            formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
          }: ${error.message}`
        );
      } else {
        toast.error(
          `Fehler beim Erstellen der ${
            formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
          }`
        );
      }
    }
  };
  const handleDelete = async (expenseId: string) => {
    console.log("UserAccountPage: Delete expense triggered", { expenseId });
    try {
      await deleteExpense(expenseId);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId)
      );
      console.log("UserAccountPage: Expense deleted successfully");
      toast.success("Eintrag erfolgreich gelöscht");
    } catch (error) {
      console.error("UserAccountPage: Error deleting expense:", error);
      toast.error("Fehler beim Löschen des Eintrags");
    }
  };

  console.log("UserAccountPage: Rendering component", {
    activeTab,
    expenses,
    isLoading,
    showDetails,
    showBills,
  });

  return (
    <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
      <Tabs
        value={activeTab}
        onValueChange={(value: string) => {
          console.log("UserAccountPage: Tab changed", { newTab: value });
          setActiveTab(value as "dashboard" | "expenses" | "travel");
        }}
        className="w-full"
      >
        <TabsList className="flex border-b">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">Auslagen</TabsTrigger>
          <TabsTrigger value="travel">Reisekosten</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardCardsUser
            openExpensesCount={openExpensesCount}
            approvedExpensesCount={approvedExpensesCount}
            rejectedExpensesCount={rejectedExpensesCount}
            openTravelsCount={openTravelsCount}
            approvedTravelsCount={approvedTravelsCount}
            rejectedTravelsCount={rejectedTravelsCount}
          />
        </TabsContent>

        <TabsContent value="expenses">
          <SharedExpenseTable
            category="reimbursement"
            expenses={expenses.filter(
              (item) => item.category === "reimbursement"
            )}
            isLoading={isLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleAddNewClick={handleAddNewClick}
            handleViewDetails={handleViewDetails}
            handleFormSubmit={handleFormSubmit}
            handleDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="travel">
          <SharedExpenseTable
            category="travel"
            expenses={expenses.filter((item) => item.category === "travel")}
            isLoading={isLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleAddNewClick={handleAddNewClick}
            handleViewDetails={handleViewDetails}
            handleFormSubmit={handleFormSubmit}
            handleDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      {showDetails && selectedItem && (
        <DetailsModal
          selectedItem={selectedItem}
          setShowDetails={setShowDetails}
        />
      )}

      {showBills && selectedItem && (
        <BillsModal selectedItem={selectedItem} setShowDetails={setShowBills} />
      )}
    </div>
  );
}
