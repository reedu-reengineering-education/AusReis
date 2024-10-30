// Path: src/components/user-account/DetailsModal.tsx
// Component: DetailsModal for displaying expense details
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
import { XIcon } from "lucide-react";
import { Bill, Expense, Project, File as PrismaFile } from "@prisma/client";

interface DetailsModalProps {
  selectedItem: Expense & {
    project: Project;
    bills: Bill & { files: PrismaFile[] }[];
  };
  setShowDetails: (show: boolean) => void;
}

export function DetailsModal({
  selectedItem,
  setShowDetails,
}: DetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{selectedItem.description}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDetails(false)}
          >
            <XIcon className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-muted-foreground mb-4">
          Projekt: {selectedItem.project.name}
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zweck</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Brutto Betrag</TableHead>
              <TableHead>Netto Betrag</TableHead>
              <TableHead>Belege</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{selectedItem.description}</TableCell>
              <TableCell>
                <Badge
                  className={`${
                    selectedItem.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : selectedItem.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedItem.status === "processed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  } text-xs`}
                >
                  {selectedItem.status}
                </Badge>
              </TableCell>
              <TableCell>
                {selectedItem.grossAmount.toLocaleString()} €
              </TableCell>
              <TableCell>{selectedItem.netAmount.toLocaleString()} €</TableCell>
              <TableCell>
                {selectedItem.bills.length > 0 ? (
                  <div className="space-y-2">
                    {selectedItem.bills.map((bill, index) => (
                      <div key={index}>
                        {bill.files.map((file, fileIndex) => (
                          <a
                            key={fileIndex}
                            href={`/api/download/${file.id}`}
                            className="block underline text-blue-500 hover:text-blue-700"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file.filename || `File ${fileIndex + 1}`}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  "Keine Belege hochgeladen"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
