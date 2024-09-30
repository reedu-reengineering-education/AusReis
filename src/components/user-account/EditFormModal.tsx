import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadIcon, FileIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { createFormData } from "@/helpers/fileUploadHelpers";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { useSession } from "next-auth/react";
import {
  Expense as BaseFormData,
  ExpenseCategory,
  ExpenseStatus,
} from "@prisma/client";

interface FormData extends BaseFormData {
  bills: { file: string; amount: number }[];
}

interface EditFormModalProps {
  activeTab: "expenses" | "travel";

  expenseId: string;

  handleFormSubmit: (formData: FormData) => Promise<void>;
}

const initialData: FormData = {
  amount: 0,
  description: "",
  projectId: "",
  userId: "",
  category: ExpenseCategory.reimbursement, // Assign a valid default value
  status: ExpenseStatus.pending, // Assign a valid default value
  bills: [],
  id: "",
  createdAt: new Date(),
};

export function EditFormModal(props: EditFormModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession(); // Lade die Session

  const [formData, setFormData] = useState({
    ...initialData,
    userId: session?.user?.id || "", // Benutzer-ID aus der Session laden
  });

  if (!formData) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.amount ||
      !formData.description ||
      !formData.projectId ||
      !formData.userId ||
      !formData.category ||
      !formData.status ||
      !formData.bills
    ) {
      console.log("Alle Felder müssen ausgefüllt sein.");
      return;
    }

    console.log("Form data submitted:", formData);
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const bills = files
      ? Array.from(files).map((file) => ({ file: file.name, amount: 0 }))
      : [];
    setFormData((prevData) => ({
      ...prevData,
      bills: [...prevData.bills, ...bills], // Neue Dateien hinzufügen
    }));
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleDeleteFile = (fileName: string) => {
    setFormData((prevData) => ({
      ...prevData,
      bills: prevData.bills.filter((bill) => bill.file !== fileName),
    }));
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (file) {
      const uploadFormData = createFormData([file]);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload/files", true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
          console.log(`Fortschritt: ${progress.toFixed(2)}%`);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          console.log("Datei erfolgreich hochgeladen");
        } else {
          console.error("Fehler beim Hochladen");
        }
      };

      xhr.onerror = () => {
        console.error("Fehler beim Hochladen");
      };

      xhr.send(uploadFormData);
    }
  };

  const activeTab = "expenses"; // Define activeTab variable

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsDialogOpen(true)}>
          {activeTab === "expenses"
            ? "Auslage bearbeiten"
            : "Reisekosten bearbeiten"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader />
        <DialogTitle>
          {activeTab === "expenses"
            ? "Auslage bearbeiten"
            : "Reisekosten bearbeiten"}
        </DialogTitle>
        <DialogDescription>
          Bearbeiten Sie die Details und fügen Sie neue Dateien hinzu oder
          löschen Sie vorhandene.
        </DialogDescription>
        <form onSubmit={handleSubmit}>
          <Input
            name="description"
            placeholder="Titel"
            required
            className="mb-4"
            value={formData.description}
            onChange={handleInputChange}
          />
          <Input
            name="amount"
            placeholder="Betrag"
            required
            className="mb-4"
            type="number"
            value={formData.amount}
            onChange={handleInputChange}
          />
          <Input
            name="projectId"
            placeholder="Projekt"
            required
            className="mb-4"
            value={formData.projectId}
            onChange={handleInputChange}
          />
          <div className="border-2 border-gray-200 border-dashed rounded-lg p-6 dark:border-gray-700 group hover:border-primary transition-colors">
            <div className="flex flex-col items-center justify-center space-y-3">
              <UploadIcon className="h-10 w-10 text-gray-400 group-hover:text-primary" />
              <p className="text-gray-500 dark:text-gray-400 group-hover:text-primary">
                Dateien hier ablegen
              </p>
              <Button variant="outline" onClick={handleUploadClick}>
                Neue Dateien auswählen
                <input
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </Button>
            </div>
          </div>

          {formData.bills.length > 0 && (
            <div className="border rounded-lg overflow-hidden mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 py-2 text-left">File</TableHead>
                    <TableHead className="px-4 py-2 text-right">
                      Größe
                    </TableHead>
                    <TableHead className="px-4 py-2 text-right">
                      Aktionen
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.bills.map((bill, index) => (
                    <TableRow
                      className="border-b dark:border-gray-700"
                      key={index}
                    >
                      <TableCell className="px-4 py-2 flex items-center space-x-2">
                        <FileIcon className="h-5 w-5 text-gray-500" />
                        <span>{bill.file}</span>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-right">
                        <span className="text-gray-500 dark:text-gray-400">
                          {/* Display file size if available */}
                          {(file?.size || 0) / 1024 / 1024} MB
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteFile(bill.file)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit">Speichern</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
