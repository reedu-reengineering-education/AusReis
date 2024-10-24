"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  UploadIcon,
  FileIcon,
  TrashIcon,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getProject } from "@/lib/api/projectClient";
import axios from "axios";

interface EditFormModalProps {
  expense: {
    id: string;
    amount: number;
    description: string;
    projectId: string;
    status: string;
    userId: string;
    category: string;
    bills: { file: File; amount: number; fileId?: string }[];
    travelStartDate?: string;
    travelEndDate?: string;
  };
  onUpdate: (updatedExpense: any) => void;
}

export function EditFormModal({ expense, onUpdate }: EditFormModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    ...expense,
    travelStartDate: expense.travelStartDate
      ? new Date(expense.travelStartDate)
      : undefined,
    travelEndDate: expense.travelEndDate
      ? new Date(expense.travelEndDate)
      : undefined,
  });

  useEffect(() => {
    async function fetchProjects() {
      try {
        const fetchedProjects = await getProject();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error(
          "Fehler beim Laden der Projekte. Bitte versuchen Sie es später erneut."
        );
      }
    }

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("EditFormModal: handleSubmit called", { formData });

    if (
      !formData.amount ||
      !formData.description ||
      !formData.projectId ||
      !formData.userId ||
      !formData.category ||
      !formData.status ||
      formData.bills.length === 0 ||
      (formData.category === "travel" &&
        (!formData.travelStartDate || !formData.travelEndDate))
    ) {
      toast.error(
        "Bitte füllen Sie alle Felder aus, laden Sie mindestens eine Datei hoch und wählen Sie die Reisedaten (falls zutreffend)."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("EditFormModal: Starting file upload");
      const uploadedFiles = await Promise.all(
        formData.bills.map(async (bill) => {
          if (bill.fileId) return bill; // Skip already uploaded files

          console.log("EditFormModal: Uploading file", {
            fileName: bill.file.name,
          });
          const uploadFormData = new FormData();
          uploadFormData.append("file", bill.file);
          const response = await axios.post(
            "/api/upload/files",
            uploadFormData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          console.log("EditFormModal: File upload response", {
            response: response.data,
          });

          return {
            ...bill,
            fileId: response.data.data.id,
          };
        })
      );
      console.log("EditFormModal: All files uploaded", { uploadedFiles });

      const updatedFormData = {
        ...formData,
        bills: uploadedFiles,
        travelStartDate: formData.travelStartDate
          ? formData.travelStartDate.toISOString()
          : undefined,
        travelEndDate: formData.travelEndDate
          ? formData.travelEndDate.toISOString()
          : undefined,
      };
      console.log("EditFormModal: Calling onUpdate", {
        updatedFormData,
      });
      await onUpdate(updatedFormData);

      setIsDialogOpen(false);
      toast.success("Auslage erfolgreich aktualisiert!");
    } catch (error) {
      console.error("EditFormModal: Error in handleSubmit:", error);
      toast.error(
        "Ein Fehler ist beim Aktualisieren der Auslage aufgetreten. Bitte versuchen Sie es erneut."
      );
    } finally {
      setIsSubmitting(false);
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
      toast.info(`${files.length} Datei(en) hinzugefügt.`);
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
    toast.info("Datei entfernt.");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Bearbeiten
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Auslage bearbeiten
          </DialogTitle>
          <DialogDescription>
            Bitte aktualisieren Sie die Details und laden Sie bei Bedarf neue
            Dateien hoch.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Zweck</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Zweck der Ausgabe"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Betrag</Label>
                <Input
                  id="amount"
                  name="amount"
                  placeholder="Betrag in €"
                  required
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Projekt</Label>
              <Select
                onValueChange={handleProjectChange}
                value={formData.projectId}
                required
              >
                <SelectTrigger id="project">
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
            </div>
            {formData.category === "travel" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reisebeginn</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.travelStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.travelStartDate ? (
                          format(formData.travelStartDate, "PPP")
                        ) : (
                          <span>Datum wählen</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.travelStartDate}
                        onSelect={(date) =>
                          setFormData((prev) => ({
                            ...prev,
                            travelStartDate: date || undefined,
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Reiseende</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.travelEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.travelEndDate ? (
                          format(formData.travelEndDate, "PPP")
                        ) : (
                          <span>Datum wählen</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.travelEndDate}
                        onSelect={(date) =>
                          setFormData((prev) => ({
                            ...prev,
                            travelEndDate: date || undefined,
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
          <Separator />
          <div className="space-y-4">
            <Label>Belege hochladen</Label>
            <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors">
              <div className="flex flex-col items-center justify-center space-y-3">
                <UploadIcon className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Dateien hier ablegen oder klicken zum Auswählen
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
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datei</TableHead>
                      <TableHead className="text-right">Größe</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.bills.map((bill, index) => (
                      <TableRow key={index}>
                        <TableCell className="flex items-center space-x-2">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{bill.file.name}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-muted-foreground">
                            {(bill.file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird aktualisiert...
                </>
              ) : (
                "Aktualisieren"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
