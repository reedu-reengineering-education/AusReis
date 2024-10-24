// Path: src/components/user-account/BillsModal.tsx
// Component: BillsModal for displaying bills and upload functionality in the user account page
import { useState, useRef } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadIcon, XIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { createFormData } from "@/helpers/fileUploadHelpers";

interface BillsModalProps {
  selectedItem: {
    title: string;
    project: string;
    status: string;
    amount: number;
    bills: { file: string; amount: number }[];
  } | null;
  setShowDetails: (show: boolean) => void;
}

export function BillsModal({ selectedItem, setShowDetails }: BillsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // Fortschritt des Uploads
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedItem) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      console.log("Datei ausgewählt:", event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async (event: any) => {
    event.preventDefault();

    if (file) {
      const formData = createFormData([file]);

      // Verwende XMLHttpRequest, um den Upload-Fortschritt zu überwachen
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload/files", true);

      // Fortschritts-Event, um den Upload-Fortschritt zu berechnen
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
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

      xhr.send(formData); // Sende die Datei
    } else {
      console.error("Keine Datei ausgewählt");
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDetails(false)}
          >
            <XIcon className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-muted-foreground mb-4">
          Projekt: {selectedItem.project}
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Betrag</TableHead>
              <TableHead>Rechnungen</TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Badge
                  className={`${
                    selectedItem.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : selectedItem.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  } text-xs`}
                >
                  {selectedItem.status}
                </Badge>
              </TableCell>
              <TableCell>{selectedItem.amount.toLocaleString()}€</TableCell>
              <TableCell>
                {selectedItem.bills && selectedItem.bills.length > 0
                  ? selectedItem.bills.map((bill, index) => (
                      <a
                        key={index}
                        href={bill.file}
                        className="underline text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Rechnung {index + 1}: ${bill.amount.toLocaleString()}
                      </a>
                    ))
                  : "Keine Rechnungen hochgeladen"}
              </TableCell>
              <TableCell>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  onClick={handleUploadClick}
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  Datei auswählen
                </Button>
                {file && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{file.name}</p>
                    <Button onClick={handleUpload} variant="outline" size="sm">
                      <UploadIcon className="w-4 h-4 mr-auto" />
                    </Button>
                    <div className="mt-2">
                      <Progress value={uploadProgress} max={100} />
                    </div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
