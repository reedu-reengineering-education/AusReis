"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Cookie,
  Mail,
  UserCircle,
  MessageSquare,
  ShoppingCart,
  Youtube,
  BarChart,
  FileText,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MotionWrapper } from "@/components/MotionWrapper";

const Section = ({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn("transition-all duration-300 hover:shadow-lg", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon
              className={cn(
                "w-5 h-5 transition-all duration-300",
                isHovered ? "text-primary" : "text-primary/70"
              )}
            />
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default function Component() {
  const sections = [
    {
      icon: Shield,
      title: "1. Information über die Erhebung personenbezogener Daten",
      content: [
        {
          title: "1.1 Allgemeine Information",
          content:
            "Wir freuen uns, dass Sie unsere Website besuchen und bedanken uns für Ihr Interesse. Im Folgenden informieren wir Sie über den Umgang mit Ihren personenbezogenen Daten bei Nutzung unserer Website. Personenbezogene Daten sind hierbei alle Daten, mit denen Sie persönlich identifiziert werden können.",
        },
        {
          title: "1.2 Verantwortlicher",
          content:
            "Verantwortlicher für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist Reedu GmbH & Co. KG, Von-Steuben-Str. 21, 48143 Münster, Deutschland, Tel.: +49 (0) 251 98119797, E-Mail: kontakt@reedu.de.",
        },
        {
          title: "1.3 Datensicherheit",
          content:
            "Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung personenbezogene Daten und anderer vertraulicher Inhalte eine SSL-bzw. TLS-Verschlüsselung.",
        },
      ],
    },
    {
      icon: Cookie,
      title: "2. Datenerfassung beim Besuch unserer Website",
      content: [
        {
          title: "Server-Logfiles",
          content:
            "Bei der bloß informatorischen Nutzung unserer Website erheben wir nur solche Daten, die Ihr Browser an unseren Server übermittelt (Server-Logfiles).",
        },
      ],
    },
    {
      icon: Cookie,
      title: "3. Cookies",
      content: [
        {
          title: "Cookie-Nutzung",
          content:
            "Um den Besuch unserer Website attraktiv zu gestalten und die Nutzung bestimmter Funktionen zu ermöglichen, verwenden wir auf verschiedenen Seiten sogenannte Cookies.",
        },
      ],
    },
    {
      icon: MessageSquare,
      title: "4. Kontaktaufnahme",
      content: [
        {
          title: "Kontaktdaten",
          content:
            "Im Rahmen der Kontaktaufnahme mit uns werden personenbezogene Daten erhoben. Welche Daten im Falle eines Kontaktformulars erhoben werden, ist aus dem jeweiligen Kontaktformular ersichtlich.",
        },
      ],
    },
    {
      icon: UserCircle,
      title: "5. Kundenkonto",
      content: [
        {
          title: "Kontoverwaltung",
          content:
            "Gemäß Art. 6 Abs. 1 lit. b DSGVO werden personenbezogene Daten weiterhin erhoben und verarbeitet, wenn Sie uns diese zur Durchführung eines Vertrages oder bei der Eröffnung eines Kundenkontos mitteilen.",
        },
      ],
    },
    {
      icon: Mail,
      title: "6. Direktwerbung",
      content: [
        {
          title: "6.1 Newsletter",
          content:
            "Wenn Sie sich zu unserem E-Mail Newsletter anmelden, übersenden wir Ihnen regelmäßig Informationen zu unseren Angeboten.",
        },
        {
          title: "6.2 MailChimp",
          content:
            "Der Versand unserer E-Mail-Newsletter erfolgt über den technischen Dienstleister MailChimp.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto py-16 px-4 max-w-5xl">
        <MotionWrapper>
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl typewriter font-bold tracking-tighter sm:text-5xl md:text-4xl">
              Datenschutzerklärung
            </h1>
            <p className="max-w-[800px] typewriter text-muted-foreground md:text-xl/relaxed">
              Informationen zum Schutz Ihrer persönlichen Daten
            </p>
          </div>

          <div className="grid gap-6">
            {sections.map((section, index) => (
              <Section icon={section.icon} title={section.title}>
                <Accordion type="single" collapsible className="w-full">
                  {section.content.map((item, itemIndex) => (
                    <AccordionItem
                      key={itemIndex}
                      value={`section-${index}-${itemIndex}`}
                      className="border-none"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                          <span className="text-left">{item.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Section>
            ))}
          </div>

          <Section icon={FileText} title="10. Ihre Rechte" className="mt-8">
            <div className="space-y-6">
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">
                  Sie haben folgende Rechte:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Auskunftsrecht (Art. 15 DSGVO)</li>
                  <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
                  <li>Recht auf Löschung (Art. 17 DSGVO)</li>
                  <li>
                    Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
                  </li>
                  <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                  <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
                </ul>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Widerspruchsrecht</h3>
                <p className="text-muted-foreground">
                  Sie haben das Recht, aus Gründen, die sich aus Ihrer
                  besonderen Situation ergeben, jederzeit gegen die Verarbeitung
                  Sie betreffender personenbezogener Daten Widerspruch
                  einzulegen.
                </p>
              </div>
            </div>
          </Section>

          <div className="flex justify-center mt-12">
            <Button asChild>
              <a
                href="mailto:kontakt@reedu.de"
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Kontaktieren Sie uns bei Fragen
              </a>
            </Button>
          </div>
        </MotionWrapper>
      </div>
      <footer className="bg-muted py-6 text-center text-xs text-muted-foreground">
        <div className="container">
          &copy; {new Date().getFullYear()} Reedu GmbH & Co. KG. Alle Rechte
          vorbehalten.
        </div>
      </footer>
    </div>
  );
}
