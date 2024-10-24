// Path: src/components/user-account/UserTabs.tsx
// Component: TabsComponent for displaying tabs for expenses and travel costs on the user account page
import { useMemo, Dispatch, SetStateAction } from "react";
import { expenses, travels } from "../../../data"; // Importiere die Daten
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TabsComponentProps {
  activeTab: "expenses" | "travels";
  setActiveTab: Dispatch<SetStateAction<"expenses" | "travels">>;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  debouncedSearchTerm: string;
  handleAddNewClick: () => void;
  handleViewDetails: (item: any) => void;
}

export function TabsComponent({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  debouncedSearchTerm,
  handleAddNewClick,
  handleViewDetails,
}: TabsComponentProps) {
  const filteredItems = useMemo(() => {
    const data = activeTab === "expenses" ? expenses : travels;
    return data.filter(
      (item) =>
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.project.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, activeTab]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value: string) =>
        setActiveTab(value as "expenses" | "travels")
      }
      className="w-full"
    >
      <TabsList className="flex border-b">
        <TabsTrigger value="expenses">Auslagen</TabsTrigger>
        <TabsTrigger value="travels">Reisekosten</TabsTrigger>
      </TabsList>
      <TabsContent value="expenses">
        <Card>
          <CardHeader>
            <CardTitle>Ihre Auslagen</CardTitle>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Suchen nach Auslagen oder Projekten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background"
              />
              <Button onClick={handleAddNewClick}>Neue Auslage</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Betrag</TableHead>
                  <TableHead>Projekt</TableHead>
                  <TableHead>
                    <span className="sr-only">Aktionen</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          item.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        } text-xs`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.submissionDate}</TableCell>
                    <TableCell>${item.amount.toLocaleString()}</TableCell>
                    <TableCell>{item.project}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(item)}
                      >
                        Ansehen
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="travels">
        <Card>
          <CardHeader>
            <CardTitle>Ihre Reisekosten</CardTitle>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Suchen nach Reisekosten oder Projekten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background"
              />
              <Button onClick={handleAddNewClick}>Neue Reisekosten</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Betrag</TableHead>
                  <TableHead>Projekt</TableHead>
                  <TableHead>
                    <span className="sr-only">Aktionen</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          item.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        } text-xs`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.submissionDate}</TableCell>
                    <TableCell>${item.amount.toLocaleString()}</TableCell>
                    <TableCell>{item.project}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(item)}
                      >
                        Ansehen
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
