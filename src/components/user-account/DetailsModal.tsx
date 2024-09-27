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

interface DetailsModalProps {
  selectedItem: {
    name: string;
    project: string;
    status: string;
    amount: number;
    receipts: string[];
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
          <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
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
              <TableHead>Belege</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Badge
                  className={`${
                    selectedItem.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : selectedItem.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  } text-xs`}
                >
                  {selectedItem.status}
                </Badge>
              </TableCell>
              <TableCell>${selectedItem.amount.toLocaleString()}</TableCell>
              <TableCell>
                {selectedItem.receipts.length > 0
                  ? selectedItem.receipts.map((receipt, index) => (
                      <a
                        key={index}
                        href={receipt}
                        className="underline text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Beleg {index + 1}
                      </a>
                    ))
                  : "Keine Belege hochgeladen"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
