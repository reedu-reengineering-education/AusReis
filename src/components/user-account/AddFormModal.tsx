import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { XIcon, UploadIcon, FileIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
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
import { useSession } from "next-auth/react"; // Verwende useSession für die Authentifizierung

interface AddFormModalProps {
  activeTab: "expenses" | "travel";
  setShowAddForm: (show: boolean) => void;
  handleFormSubmit: (formData: {
    amount: number;
    description: string;
    projectId: string;
    userId: string;
    category: string;
    bills: { file: string; amount: number }[];
  }) => void;
}

export function AddFormModal({
  activeTab,
  setShowAddForm,
  handleFormSubmit,
}: AddFormModalProps) {
  const { data: session } = useSession(); // Session verwenden, um die userId zu erhalten
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<{
    amount: number;
    description: string;
    projectId: string;
    userId: string;
    category: string;
    bills: { file: string; amount: number }[];
  }>({
    amount: 0,
    description: "",
    projectId: "",
    userId: session?.user?.id || "", // userId automatisch ausfüllen
    category: activeTab === "expenses" ? "reimbursement" : "", // category automatisch basierend auf dem Tab
    bills: [],
  });

  useEffect(() => {
    if (activeTab === "expenses") {
      setFormData((prevData) => ({
        ...prevData,
        category: "reimbursement",
      }));
    }
  }, [activeTab]);

  if (!formData) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.amount || !formData.description || !formData.projectId) {
      console.log("Alle Felder müssen ausgefüllt sein.");
      return;
    }

    if (formData.bills.length === 0) {
      console.log("Mindestens eine Datei muss hochgeladen werden.");
      return;
    }

    handleFormSubmit(formData);
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
      bills,
    }));
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();

    if (file) {
      const uploadFormData = createFormData([file]);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload/files", true);

      xhr.upload.onprogress = (e: any) => {
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsDialogOpen(true)}>
          {activeTab === "expenses" ? "Neue Auslage" : "Neue Reisekosten"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader />
        <DialogTitle>
          {activeTab === "expenses"
            ? "Auslage hinzufügen"
            : "Reisekosten hinzufügen"}
        </DialogTitle>
        <DialogDescription>
          Bitte füllen Sie die Details aus und laden Sie alle relevanten Dateien
          hoch.
        </DialogDescription>
        <form onSubmit={handleSubmit}>
          <Input
            name="description"
            placeholder="Titel"
            required
            className="mb-4"
            onChange={handleInputChange}
          />
          <Input
            name="amount"
            placeholder="Betrag"
            required
            className="mb-4"
            type="number"
            onChange={handleInputChange}
          />
          <Input
            name="projectId"
            placeholder="Projekt"
            required
            className="mb-4"
            onChange={handleInputChange}
          />
          <div className="border-2 border-gray-200 border-dashed rounded-lg p-6 dark:border-gray-700 group hover:border-primary transition-colors">
            <div className="flex flex-col items-center justify-center space-y-3">
              <UploadIcon className="h-10 w-10 text-gray-400 group-hover:text-primary" />
              <p className="text-gray-500 dark:text-gray-400 group-hover:text-primary">
                Dateien hier ablegen
              </p>
              <Button variant="outline" onClick={handleUploadClick}>
                Dateien auswählen
                <input
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </Button>
            </div>
          </div>
          {file && (
            <div className="border rounded-lg overflow-hidden mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 py-2 text-left">File</TableHead>
                    <TableHead className="px-4 py-2 text-right">Size</TableHead>
                    <TableHead className="px-4 py-2 text-right">
                      Progress
                    </TableHead>
                    <TableHead className="px-4 py-2 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b dark:border-gray-700">
                    <TableCell className="px-4 py-2 flex items-center space-x-2">
                      <FileIcon className="h-5 w-5 text-gray-500" />
                      <span>{file.name}</span>
                    </TableCell>
                    <TableCell className="px-4 py-2 text-right">
                      <span className="text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2 text-right">
                      <Progress value={uploadProgress} />
                    </TableCell>
                    <TableCell className="px-4 py-2 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setFile(null)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit">Einreichen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
