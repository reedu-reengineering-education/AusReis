// // Path: src/app/faq/page.tsx
// // Component: EnhancedFAQPage for displaying the FAQ page with search and accordion
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, HelpCircle, Phone, Mail, MapPin, X } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MotionWrapper } from "@/components/MotionWrapper";

const faqData = [
  {
    category: "Allgemeine Fragen",
    items: [
      {
        question: "Was ist das Expense Management System?",
        answer:
          "Das Expense Management System ist eine Webanwendung, die es Benutzern ermöglicht, Auslagen und Reisekosten zu verwalten, einzureichen und zu verfolgen. Es bietet auch Administratoren Tools zur Überwachung und Verwaltung von Ausgaben und Projekten.",
      },
      {
        question: "Wer kann das System nutzen?",
        answer:
          "Das System kann von Mitarbeitern zur Einreichung von Auslagen und Reisekosten sowie von Administratoren zur Verwaltung und Genehmigung von Ausgaben genutzt werden.",
      },
    ],
  },
  {
    category: "Benutzerkonten und Anmeldung",
    items: [
      {
        question: "Wie kann ich mich im System anmelden?",
        answer:
          "Sie können sich mit Ihrer E-Mail-Adresse anmelden. Das System verwendet Magic Links für eine sichere und passwortlose Authentifizierung.",

        gif: "/gifs/anmelden.gif",
      },
      {
        question: "Was ist ein Magic Link?",
        answer:
          "Ein Magic Link ist ein sicherer, einmaliger Link, der an Ihre E-Mail-Adresse gesendet wird. Durch Klicken auf diesen Link werden Sie automatisch angemeldet, ohne ein Passwort eingeben zu müssen.",
      },
    ],
  },
  {
    category: "Benutzeraktionen",
    items: [
      {
        question: "Wie reiche ich eine neue Auslage oder Reisekosten ein?",
        answer:
          "Folgen Sie diesen Schritten, um eine neue Auslage oder Reisekosten einzureichen:",

        gif: "/gifs/submit-expense.gif",
      },
      {
        question: "Welche Informationen muss ich bei der Einreichung angeben?",
        answer:
          "Bei der Einreichung einer Auslage oder Reisekosten müssen Sie folgende Informationen angeben:\n- Beschreibung der Ausgabe\n- Betrag\n- Zugehöriges Projekt\n- Datum der Ausgabe\n- Kategorie (Auslage oder Reisekosten)\n- Belege (als Dateianhänge)",
      },
      {
        question:
          "Wie kann ich meine eingereichten Auslagen oder Reisekosten bearbeiten?",
        answer:
          "Um eine eingereichte Auslage oder Reisekosten zu bearbeiten, folgen Sie diesen Schritten:\n1. Melden Sie sich in Ihrem Konto an\n2. Navigieren Sie zum entsprechenden Tab ('Auslagen' oder 'Reisekosten')\n3. Finden Sie den Eintrag, den Sie bearbeiten möchten\n4. Klicken Sie auf die 'Bearbeiten'-Schaltfläche neben dem Eintrag\n5. Nehmen Sie die gewünschten Änderungen vor\n6. Speichern Sie die Änderungen",
        gif: "/gifs/edit-expense.gif",
      },
      {
        question: "Wie kann ich meine Auslagen oder Reisekosten ansehen?",
        answer:
          "Um Ihre Auslagen oder Reisekosten anzusehen:\n1. Melden Sie sich in Ihrem Konto an\n2. Gehen Sie zum Tab 'Auslagen' oder 'Reisekosten'\n3. Sie sehen eine Liste aller Ihrer Einträge\n4. Klicken Sie auf 'Ansehen' neben einem Eintrag, um die Details zu sehen",
        gif: "/gifs/view-expense.gif",
      },
      {
        question: "Wie kann ich eine Auslage oder Reisekosten löschen?",
        answer:
          "Um eine Auslage oder Reisekosten zu löschen:\n1. Melden Sie sich in Ihrem Konto an\n2. Navigieren Sie zum entsprechenden Tab\n3. Finden Sie den Eintrag, den Sie löschen möchten\n4. Klicken Sie auf die 'Löschen'-Schaltfläche neben dem Eintrag\n5. Bestätigen Sie die Löschung im Bestätigungsdialog",
        gif: "/gifs/delete-expense.gif",
      },
    ],
  },
  {
    category: "Administratoraktionen",
    items: [
      {
        question: "Wie erstelle ich als Administrator ein neues Projekt?",
        answer:
          "Um ein neues Projekt zu erstellen:\n1. Melden Sie sich mit Ihrem Admin-Konto an\n2. Navigieren Sie zum 'Projekte'-Bereich\n3. Klicken Sie auf 'Neues Projekt erstellen'\n4. Füllen Sie das Projektformular aus (Name, Beschreibung, Budget, etc.)\n5. Weisen Sie Benutzer dem Projekt zu\n6. Klicken Sie auf 'Projekt erstellen'",
        gif: "/gifs/create-project.gif",
      },
      {
        question: "Wie bearbeite ich ein bestehendes Projekt?",
        answer:
          "Um ein Projekt zu bearbeiten:\n1. Gehen Sie zur Projektübersicht\n2. Finden Sie das zu bearbeitende Projekt\n3. Klicken Sie auf 'Bearbeiten'\n4. Nehmen Sie die gewünschten Änderungen vor\n5. Speichern Sie die Änderungen",
        gif: "/gifs/edit-project.gif",
      },
      {
        question: "Wie kann ich detaillierte Projektinformationen einsehen?",
        answer:
          "Um detaillierte Projektinformationen einzusehen:\n1. Navigieren Sie zur Projektliste\n2. Klicken Sie auf 'Details' neben dem gewünschten Projekt\n3. Sie sehen nun eine Übersicht mit allen relevanten Projektinformationen, einschließlich Ausgaben und zugewiesenen Benutzern",
        gif: "/gifs/view-project-details.gif",
      },
      {
        question: "Wie kann ich Ausgabendaten als CSV herunterladen?",
        answer:
          "Um Ausgabendaten als CSV herunterzuladen:\n1. Öffnen Sie die Detailansicht eines Projekts\n2. Suchen Sie nach der Option 'Ausgaben exportieren' oder einem ähnlichen Button\n3. Wählen Sie den gewünschten Datumsbereich für die Ausgaben\n4. Klicken Sie auf 'CSV herunterladen'\n5. Die CSV-Datei wird nun auf Ihr Gerät heruntergeladen",
        gif: "/gifs/download-csv.gif",
      },
      {
        question: "Wie ändere ich den Status einer Auslage?",
        answer:
          "Um den Status einer Auslage zu ändern:\n1. Gehen Sie zur Ausgabenübersicht\n2. Finden Sie die betreffende Auslage\n3. Klicken Sie auf 'Status ändern' oder ein ähnliches Dropdown-Menü\n4. Wählen Sie den neuen Status (z.B. 'processed' oder 'paid')\n5. Bestätigen Sie die Änderung",
        gif: "/gifs/change-expense-status.gif",
      },
      {
        question: "Wie lösche ich eine Auslage als Administrator?",
        answer:
          "Um eine Auslage zu löschen:\n1. Navigieren Sie zur Ausgabenübersicht\n2. Finden Sie die zu löschende Auslage\n3. Klicken Sie auf die 'Löschen'-Schaltfläche\n4. Bestätigen Sie die Löschung im Bestätigungsdialog",
        gif: "/gifs/admin-delete-expense.gif",
      },
      {
        question: "Wie kann ich Belege zu einer Auslage herunterladen?",
        answer:
          "Um Belege herunterzuladen:\n1. Öffnen Sie die Detailansicht der betreffenden Auslage\n2. Suchen Sie nach dem Abschnitt 'Belege' oder 'Anhänge'\n3. Klicken Sie auf den Dateinamen oder ein Download-Symbol neben dem Beleg\n4. Die Datei wird auf Ihr Gerät heruntergeladen",
        gif: "/gifs/download-receipt.gif",
      },
    ],
  },
  {
    category: "Genehmigungsprozess",
    items: [
      {
        question: "Wie funktioniert der Genehmigungsprozess für Ausgaben?",
        answer:
          "Der Genehmigungsprozess für Ausgaben durchläuft mehrere Stufen:",

        gif: "/gifs/approval-process.gif",
      },
    ],
  },
];

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const address = "Von-Steuben-Str. 21, 48143 Münster";

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <MotionWrapper>
      <div className="container mx-auto py-12 px-4 max-w-5xl">
        <h1 className="text-4xl text-center typewriter font-bold tracking-tighter sm:text-5xl md:text-4xl">
          Häufig gestellte Fragen (FAQ)
        </h1>

        <Card className="mb-12 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              Suchen Sie nach Antworten
            </CardTitle>
            <CardDescription className="text-lg">
              Geben Sie Ihre Frage ein, um schnell Antworten zu finden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                type="text"
                placeholder="Suchen Sie nach Fragen oder Stichwörtern..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {filteredFAQ.length === 0 ? (
          <Card className="hover:shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <HelpCircle className="w-24 h-24 text-primary mb-6" />
              <p className="text-3xl font-semibold text-primary mb-4">
                Keine Ergebnisse gefunden
              </p>
              <p className="text-xl text-gray-600 text-center max-w-md">
                Entschuldigung, wir konnten keine Antworten auf Ihre Frage
                finden. Bitte versuchen Sie es mit einem anderen Suchbegriff
                oder kontaktieren Sie unseren Support.
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[700px] rounded-lg border p-6 hover:shadow-lg">
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQ.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-10">
                  <h2 className="text-3xl font-bold mb-6 text-primary">
                    {category.category}
                  </h2>
                  {category.items.map((item, itemIndex) => (
                    <AccordionItem
                      value={`item-${categoryIndex}-${itemIndex}`}
                      key={itemIndex}
                      className="mb-4 border rounded-lg shadow-md"
                    >
                      <AccordionTrigger className="text-left p-4 hover:bg-gray-50">
                        <span className="flex items-center text-xl">
                          <Badge
                            variant="outline"
                            className="mr-3 text-lg px-3 py-1 bg-[#2B3F6B] text-white border-[#2B3F6B]"
                          >
                            F
                          </Badge>
                          {item.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 bg-gray-50">
                        <div className="flex mb-6">
                          <Badge
                            variant="outline"
                            className="mr-3 text-lg px-3 py-1 mt-1 bg-[#EB5C37] text-white border-[#EB5C37]"
                          >
                            A
                          </Badge>
                          <p className="whitespace-pre-line text-lg leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                        {item.gif && (
                          <div className="mt-6">
                            <Image
                              src={item.gif}
                              alt={`GIF für ${item.question}`}
                              width={1000}
                              height={300}
                              className="rounded-lg shadow-md"
                            />
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </div>
              ))}
            </Accordion>
          </ScrollArea>
        )}

        <Card className="mt-12 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Noch Fragen?</CardTitle>
            <CardDescription className="text-lg">
              Wenn Sie keine Antwort auf Ihre Frage gefunden haben, kontaktieren
              Sie uns gerne.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Collapsible
              open={isContactOpen}
              onOpenChange={setIsContactOpen}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button className="w-full text-lg py-6">
                  {isContactOpen
                    ? "Kontaktinformationen ausblenden"
                    : "Kontakt aufnehmen"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-6">
                <div className="space-y-6 text-lg">
                  <div className="flex items-center">
                    <Phone className="mr-4 w-6 h-6" />
                    <span>+49 251 98119797</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="mr-4 w-6 h-6" />
                    <a
                      href="mailto:kontakt@reedu.de"
                      className="text-primary hover:underline"
                    >
                      kontakt@reedu.de
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-4 w-6 h-6" />
                    <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setIsMapOpen(true)}
                          className="text-primary hover:underline cursor-pointer flex items-center"
                        >
                          {address}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[800px]">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-semibold">Standort</h2>
                        </div>
                        <div
                          className="w-full h-[450px] bg-gray-100 flex items-center justify-center text-center p-4 rounded-lg"
                          style={{
                            backgroundImage:
                              "linear-gradient(45deg, #f2f2f2 25%, #e6e6e6 25%, #e6e6e6 50%, #f2f2f2 50%, #f2f2f2 75%, #e6e6e6 75%, #e6e6e6 100%)",
                            backgroundSize: "40px 40px",
                          }}
                        >
                          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                            <p className="text-2xl font-bold mb-4">
                              <span className="text-[#4285F4]">G</span>
                              <span className="text-[#EA4335]">o</span>
                              <span className="text-[#FBBC05]">o</span>
                              <span className="text-[#4285F4]">g</span>
                              <span className="text-[#34A853]">l</span>
                              <span className="text-[#EA4335]">e</span>
                              <span className="text-gray-700"> Maps</span>
                            </p>
                            <p className="text-lg text-gray-700">
                              war zu teuer, also hier ein Platzhalter in den
                              Farben von Google
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
      <footer className="bg-muted py-6 text-center text-xs text-muted-foreground">
        <div className="container">
          &copy; {new Date().getFullYear()} Reedu GmbH & Co. KG. Alle Rechte
          vorbehalten.
        </div>
      </footer>
    </MotionWrapper>
  );
}
