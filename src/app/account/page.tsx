"use client";

import { useState, useEffect, useMemo, SetStateAction, Key } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";

export default function UserAccountPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("expenses");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    title: string;
    project: string;
    status: string;
    amount: number;
    submissionDate: string;
    receipts: string[];
  } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setShowSuggestions(!!searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const expenses = useMemo(
    () => [
      {
        id: 1,
        title: "Hotel Stay",
        project: "Project A",
        status: "Approved",
        amount: 200,
        submissionDate: "2023-08-01",
        receipts: ["/receipt1.pdf"],
      },
      {
        id: 2,
        title: "Flight Ticket",
        project: "Project B",
        status: "Pending",
        amount: 450,
        submissionDate: "2023-07-15",
        receipts: ["/ticket.pdf"],
      },
    ],
    []
  );

  const travels = useMemo(
    () => [
      {
        id: 1,
        title: "Train Ticket",
        project: "Project A",
        status: "Approved",
        amount: 100,
        submissionDate: "2023-06-01",
        receipts: ["/receipt2.pdf"],
      },
      {
        id: 2,
        title: "Taxi Fare",
        project: "Project C",
        status: "Pending",
        amount: 50,
        submissionDate: "2023-07-20",
        receipts: [],
      },
    ],
    []
  );

  const filteredItems = useMemo(() => {
    const data = activeTab === "expenses" ? expenses : travels;
    return data.filter(
      (item) =>
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.project.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, activeTab, expenses, travels]);

  const handleViewDetails = (item: {
    id: number;
    title: string;
    project: string;
    status: string;
    amount: number;
    submissionDate: string;
    receipts: string[];
  }) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleAddNewClick = () => {
    setShowAddForm(true);
  };

  const handleFormSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Logik zur Einreichung neuer Auslagen oder Reisekosten
    setShowAddForm(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 py-12 md:py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Benutzer-Account
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Verwalten Sie Ihre Auslagen und Reisekosten.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
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
                            <TableCell>
                              ${item.amount.toLocaleString()}
                            </TableCell>
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
                      <Button onClick={handleAddNewClick}>
                        Neue Reisekosten
                      </Button>
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
                            <TableCell>
                              ${item.amount.toLocaleString()}
                            </TableCell>
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
          </div>
        </section>
      </main>

      {showDetails && selectedItem && (
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
                      ? selectedItem.receipts.map(
                          (receipt: string | undefined, index: number) => (
                            <a
                              key={index}
                              href={receipt}
                              className="underline text-blue-500"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Beleg {index + 1}
                            </a>
                          )
                        )
                      : "Keine Belege hochgeladen"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                Neue {activeTab === "expenses" ? "Auslage" : "Reisekosten"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddForm(false)}
              >
                <XIcon className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <Input placeholder="Titel" required className="mb-4" />
              <Input
                placeholder="Betrag"
                required
                className="mb-4"
                type="number"
              />
              <Input placeholder="Projekt" required className="mb-4" />
              <Input
                placeholder="Belege (optional)"
                type="file"
                multiple
                className="mb-4"
              />
              <Button type="submit">Einreichen</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
