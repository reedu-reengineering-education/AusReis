// Path: src/app/faq/page.tsx
// Component: EnhancedFAQPage for displaying the FAQ page with search and accordion
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
import { Search, HelpCircle, Phone, Mail, MapPin } from "lucide-react";
import Mermaid from "@/components/MermaidComponent";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
        diagram: `
          sequenceDiagram
            participant B as Benutzer
            participant S as System
            participant E as E-Mail
            B->>S: E-Mail-Adresse eingeben
            S->>E: Magic Link senden
            E->>B: Magic Link empfangen
            B->>S: Auf Magic Link klicken
            S->>B: Authentifizieren und einloggen
        `,
        gif: "/gifs/login-process.gif",
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
        diagram: `
          graph TD
            A[Anmelden] --> B[Zum Tab 'Auslagen' oder 'Reisekosten' navigieren]
            B --> C[Auf 'Neue Auslage' oder 'Neue Reisekosten' klicken]
            C --> D[Formular ausfüllen]
            D --> E[Belege hochladen]
            E --> F[Auf 'Einreichen' klicken]
        `,
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
        diagram: `
          graph TD
            A[Mitarbeiter reicht Ausgabe ein] --> B[Status: Ausstehend]
            B --> C{Administrator überprüft}
            C -->|Genehmigt| D[Status: Genehmigt]
            C -->|Abgelehnt| E[Status: Abgelehnt]
            D --> F[Zur Zahlung freigegeben]
            E --> G[Zurück an Mitarbeiter zur Überarbeitung]
        `,
        gif: "/gifs/approval-process.gif",
      },
    ],
  },
];
export default function EnhancedFAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);

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
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">
        Häufig gestellte Fragen (FAQ)
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Suchen Sie nach Antworten</CardTitle>
          <CardDescription>
            Geben Sie Ihre Frage ein, um schnell Antworten zu finden.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Suchen Sie nach Fragen oder Stichwörtern..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {filteredFAQ.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-600 mb-2">
              Keine Ergebnisse gefunden
            </p>
            <p className="text-gray-500 text-center">
              Entschuldigung, wir konnten keine Antworten auf Ihre Frage finden.
              Bitte versuchen Sie es mit einem anderen Suchbegriff oder
              kontaktieren Sie unseren Support.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px] rounded-md border p-4">
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQ.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {category.category}
                </h2>
                {category.items.map((item, itemIndex) => (
                  <AccordionItem
                    value={`item-${categoryIndex}-${itemIndex}`}
                    key={itemIndex}
                  >
                    <AccordionTrigger className="text-left">
                      <span className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          F
                        </Badge>
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex mb-4">
                        <Badge variant="outline" className="mr-2 mt-1">
                          A
                        </Badge>
                        <p className="whitespace-pre-line">{item.answer}</p>
                      </div>
                      {item.diagram && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <Mermaid chart={item.diagram} />
                        </div>
                      )}
                      {item.gif && (
                        <div className="mt-4">
                          <Image
                            src={item.gif}
                            alt={`GIF für ${item.question}`}
                            width={500}
                            height={300}
                            className="rounded-lg"
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

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Noch Fragen?</CardTitle>
          <CardDescription>
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
              <Button className="w-full">
                {isContactOpen
                  ? "Kontaktinformationen ausblenden"
                  : "Kontakt aufnehmen"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="mr-2" />
                  <span>+49 251 98119797</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2" />
                  <a
                    href="mailto:kontakt@reedu.de"
                    className="text-blue-600 hover:underline"
                  >
                    kontakt@reedu.de
                  </a>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2" />
                  <span>Von-Steuben-Str. 21, 48143 Münster</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
// export default function EnhancedFAQPage() {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredFAQ = faqData
//     .map((category) => ({
//       ...category,
//       items: category.items.filter(
//         (item) =>
//           item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.answer.toLowerCase().includes(searchTerm.toLowerCase())
//       ),
//     }))
//     .filter((category) => category.items.length > 0);

//   return (
//     <div className="container mx-auto py-12 px-4 max-w-4xl">
//       <h1 className="text-4xl font-bold text-center mb-8">
//         Häufig gestellte Fragen (FAQ)
//       </h1>

//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>Suchen Sie nach Antworten</CardTitle>
//           <CardDescription>
//             Geben Sie Ihre Frage ein, um schnell Antworten zu finden.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <Input
//               type="text"
//               placeholder="Suchen Sie nach Fragen oder Stichwörtern..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {filteredFAQ.length === 0 ? (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <HelpCircle className="w-16 h-16 text-gray-400 mb-4" />
//             <p className="text-xl font-semibold text-gray-600 mb-2">
//               Keine Ergebnisse gefunden
//             </p>
//             <p className="text-gray-500 text-center">
//               Entschuldigung, wir konnten keine Antworten auf Ihre Frage finden.
//               Bitte versuchen Sie es mit einem anderen Suchbegriff oder
//               kontaktieren Sie unseren Support.
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <ScrollArea className="h-[600px] rounded-md border p-4">
//           <Accordion type="single" collapsible className="w-full">
//             {filteredFAQ.map((category, categoryIndex) => (
//               <div key={categoryIndex} className="mb-6">
//                 <h2 className="text-2xl font-semibold mb-4">
//                   {category.category}
//                 </h2>
//                 {category.items.map((item, itemIndex) => (
//                   <AccordionItem
//                     value={`item-${categoryIndex}-${itemIndex}`}
//                     key={itemIndex}
//                   >
//                     <AccordionTrigger className="text-left">
//                       <span className="flex items-center">
//                         <Badge variant="outline" className="mr-2">
//                           F
//                         </Badge>
//                         {item.question}
//                       </span>
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       <div className="flex mb-4">
//                         <Badge variant="outline" className="mr-2 mt-1">
//                           A
//                         </Badge>
//                         <p className="whitespace-pre-line">{item.answer}</p>
//                       </div>
//                       {item.diagram && (
//                         <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//                           <Mermaid chart={item.diagram} />
//                         </div>
//                       )}
//                       {item.gif && (
//                         <div className="mt-4">
//                           <Image
//                             src={item.gif}
//                             alt={`GIF für ${item.question}`}
//                             width={500}
//                             height={300}
//                             className="rounded-lg"
//                           />
//                         </div>
//                       )}
//                     </AccordionContent>
//                   </AccordionItem>
//                 ))}
//               </div>
//             ))}
//           </Accordion>
//         </ScrollArea>
//       )}

//       <Card className="mt-8">
//         <CardHeader>
//           <CardTitle>Noch Fragen?</CardTitle>
//           <CardDescription>
//             Wenn Sie keine Antwort auf Ihre Frage gefunden haben, kontaktieren
//             Sie uns gerne.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Button className="w-full">Kontakt aufnehmen</Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
