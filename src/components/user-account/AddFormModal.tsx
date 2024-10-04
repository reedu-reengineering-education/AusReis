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
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProject } from "@/lib/api/projectClient";

interface AddFormModalProps {
  activeTab: "expenses" | "travel";
  setShowAddForm: (show: boolean) => void;
  handleFormSubmit: (formData: {
    amount: number;
    description: string;
    projectId: string;
    status: string;
    userId: string;
    category: string;
    bills: { file: File; amount: number }[];
  }) => void;
}

export function AddFormModal({
  activeTab,
  setShowAddForm,
  handleFormSubmit,
}: AddFormModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projects, setProject] = useState<any[]>([]);
  const { data: session } = useSession();

  const [formData, setFormData] = useState<{
    status: string;
    amount: number;
    description: string;
    projectId: string;
    userId: string;
    category: string;
    bills: { file: File; amount: number }[];
  }>({
    status: "pending",
    amount: 0,
    description: "",
    projectId: "",
    userId: session?.user?.id || "",
    category: activeTab === "expenses" ? "reimbursement" : "travel",
    bills: [],
  });

  useEffect(() => {
    async function fetchProjects() {
      try {
        const fetchedProjects = await getProject();
        setProject(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.amount ||
      !formData.description ||
      !formData.projectId ||
      !formData.userId ||
      !formData.category ||
      !formData.status ||
      formData.bills.length === 0
    ) {
      console.log(
        "Alle Felder müssen ausgefüllt sein und mindestens eine Datei muss hochgeladen werden."
      );
      return;
    }

    try {
      const uploadedFiles = await Promise.all(
        formData.bills.map(async (bill) => {
          const uploadFormData = createFormData([bill.file]);
          const response = await fetch("/api/upload/files", {
            method: "POST",
            body: uploadFormData,
          });

          if (!response.ok) {
            throw new Error(`Failed to upload file: ${bill.file.name}`);
          }

          const result = await response.json();
          return { ...bill, fileId: result.fileId };
        })
      );

      const updatedFormData = {
        ...formData,
        bills: uploadedFiles,
      };

      console.log("Form data submitted:", updatedFormData);
      handleFormSubmit(updatedFormData);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error during file upload or form submission:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleProjectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      projectId: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newBills = Array.from(files).map((file) => ({ file, amount: 0 }));
      setFormData((prevData) => ({
        ...prevData,
        bills: [...prevData.bills, ...newBills],
      }));
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      bills: prevData.bills.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsDialogOpen(true)}>
          {activeTab === "expenses" ? "Neue Auslage" : "Neue Reisekosten"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {activeTab === "expenses"
              ? "Auslage hinzufügen"
              : "Reisekosten hinzufügen"}
          </DialogTitle>
          <DialogDescription>
            Bitte füllen Sie die Details aus und laden Sie alle relevanten
            Dateien hoch.
          </DialogDescription>
        </DialogHeader>
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
          <Select onValueChange={handleProjectChange} required>
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Projekt auswählen" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  multiple
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
                    <TableHead className="px-4 py-2 text-right">Size</TableHead>
                    <TableHead className="px-4 py-2 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.bills.map((bill, index) => (
                    <TableRow
                      key={index}
                      className="border-b dark:border-gray-700"
                    >
                      <TableCell className="px-4 py-2 flex items-center space-x-2">
                        <FileIcon className="h-5 w-5 text-gray-500" />
                        <span>{bill.file.name}</span>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-right">
                        <span className="text-gray-500 dark:text-gray-400">
                          {(bill.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveFile(index)}
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
            <Button type="submit">Einreichen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
