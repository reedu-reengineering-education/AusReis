// import { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { X } from "lucide-react";

// export default function ProjectForm({
//   onSave,
//   onClose,
//   availableUsers, // Benutzerliste als Prop
// }: {
//   onSave: (project: any) => void;
//   onClose: () => void;
//   availableUsers: { id: string; name: string }[]; // Benutzerliste
// }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     status: "",
//     budget: "",
//     actualSpend: "",
//     userIds: [] as string[], // Benutzer-IDs werden hier gespeichert
//   });

//   const [error, setError] = useState<string | null>(null); // Fehlerzustand

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // Validierung von Budget und Actual Spend
//     const parsedBudget = parseFloat(formData.budget);
//     const parsedActualSpend = parseFloat(formData.actualSpend);

//     if (isNaN(parsedBudget) || isNaN(parsedActualSpend)) {
//       setError("Please enter valid numbers for budget and actual spend.");
//       return;
//     }

//     if (!formData.userIds.length) {
//       setError("Please select at least one user for the project.");
//       return;
//     }

//     // Wenn alles in Ordnung ist, rufe die onSave-Funktion auf
//     onSave({
//       ...formData,
//       budget: parsedBudget,
//       actualSpend: parsedActualSpend,
//     });
//   };

//   const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedUserIds = Array.from(
//       e.target.selectedOptions,
//       (option) => option.value
//     );
//     setFormData({ ...formData, userIds: selectedUserIds });
//   };

//   return (
//     <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
//       <Card className="max-w-4xl w-full">
//         <CardHeader className="flex items-center justify-between">
//           <CardTitle>Add New Project</CardTitle>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={onClose}
//             className="ml-auto"
//           >
//             <X />
//           </Button>
//         </CardHeader>
//         <CardContent>
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           <form onSubmit={handleSubmit}>
//             <Input
//               name="name"
//               placeholder="Project Name"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               required
//               className="mb-4"
//             />
//             <Input
//               name="status"
//               placeholder="Status"
//               value={formData.status}
//               onChange={(e) =>
//                 setFormData({ ...formData, status: e.target.value })
//               }
//               required
//               className="mb-4"
//             />
//             <Input
//               name="budget"
//               placeholder="Budget"
//               value={formData.budget}
//               onChange={(e) =>
//                 setFormData({ ...formData, budget: e.target.value })
//               }
//               type="number"
//               required
//               className="mb-4"
//             />
//             <Input
//               name="actualSpend"
//               placeholder="Actual Spend"
//               value={formData.actualSpend}
//               onChange={(e) =>
//                 setFormData({ ...formData, actualSpend: e.target.value })
//               }
//               type="number"
//               required
//               className="mb-4"
//             />

//             {/* Multi-Select für Benutzer */}
//             <label htmlFor="userSelect" className="block mb-2">
//               Select Users:
//             </label>
//             <select
//               id="userSelect"
//               name="userIds"
//               multiple
//               value={formData.userIds}
//               onChange={handleUserChange}
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
//             >
//               {availableUsers.map((user) => (
//                 <option key={user.id} value={user.id}>
//                   {user.name}
//                 </option>
//               ))}
//             </select>

//             <Button type="submit">Save Project</Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ProjectForm({
  onSave,
  availableUsers, // Benutzerliste als Prop
}: {
  onSave: (project: any) => void;
  availableUsers: { id: string; name: string }[]; // Benutzerliste
}) {
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    budget: "",
    actualSpend: "",
    userIds: [] as string[], // Benutzer-IDs werden hier gespeichert
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false); // Steuerung des Dialogs
  const [error, setError] = useState<string | null>(null); // Fehlerzustand

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validierung von Budget und Actual Spend
    const parsedBudget = parseFloat(formData.budget);
    const parsedActualSpend = parseFloat(formData.actualSpend);
    const formattedStatus = formData.status.toUpperCase();

    if (isNaN(parsedBudget) || isNaN(parsedActualSpend)) {
      setError("Please enter valid numbers for budget and actual spend.");
      return;
    }

    if (!formData.userIds.length) {
      setError("Please select at least one user for the project.");
      return;
    }

    // Wenn alles in Ordnung ist, rufe die onSave-Funktion auf
    onSave({
      ...formData,
      status: formattedStatus,
      budget: parsedBudget,
      actualSpend: parsedActualSpend,
    });
    setIsDialogOpen(false); // Dialog schließen
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, userIds: selectedUserIds });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          Add New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Enter the details for the new project. Please fill out all fields
            and click save when done.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-500">{error}</p>} {/* Fehleranzeige */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Project Name"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Input
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                placeholder="Status"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Budget
              </Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                placeholder="Budget"
                type="number"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="actualSpend" className="text-right">
                Actual Spend
              </Label>
              <Input
                id="actualSpend"
                value={formData.actualSpend}
                onChange={(e) =>
                  setFormData({ ...formData, actualSpend: e.target.value })
                }
                placeholder="Actual Spend"
                type="number"
                className="col-span-3"
                required
              />
            </div>

            {/* Multi-Select für Benutzer */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userSelect" className="text-right">
                Users
              </Label>
              <select
                id="userSelect"
                name="userIds"
                multiple
                value={formData.userIds}
                onChange={handleUserChange}
                className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
