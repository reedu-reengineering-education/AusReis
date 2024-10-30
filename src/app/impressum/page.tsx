"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Scale,
  Shield,
  Copyright,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const ContactLink = ({
  icon: Icon,
  href,
  children,
}: {
  icon: any;
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
  >
    <Icon className="w-4 h-4" />
    <span className="underline-offset-4 group-hover:underline">{children}</span>
  </a>
);

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto py-16 px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl typewriter font-bold tracking-tighter sm:text-5xl md:text-4xl">
              Impressum
            </h1>
            <p className="max-w-[800px] typewriter text-muted-foreground md:text-xl/relaxed">
              Rechtliche Informationen & Kontaktdaten
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Section
              icon={Building2}
              title="Unternehmensdetails"
              className="md:col-span-2"
            >
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    Reedu GmbH & Co. KG
                  </h3>
                  <p className="text-muted-foreground">Von-Steuben-Str. 21</p>
                  <p className="text-muted-foreground">48143 Münster</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Vertreten durch:</h3>
                  <p className="text-muted-foreground">
                    Reedu Verwaltungs GmbH, vertreten durch die Geschäftsführer
                    Dr. Thomas Bartoschek und Umut Tas
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Kontakt:</h3>
                  <div className="space-y-2">
                    <ContactLink icon={Phone} href="tel:+4925198119797">
                      +49 251 98119797
                    </ContactLink>
                    <ContactLink icon={Mail} href="mailto:kontakt@reedu.de">
                      kontakt@reedu.de
                    </ContactLink>
                    <ContactLink icon={MapPin} href="#">
                      Von-Steuben-Str. 21, 48143 Münster
                    </ContactLink>
                  </div>
                </div>
              </div>
            </Section>

            <Section icon={FileText} title="Registereintrag">
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground">
                    Eintragung im Handelsregister
                  </p>
                  <p className="text-muted-foreground">
                    Registergericht: Amtsgericht Münster
                  </p>
                  <p className="font-medium">Registernummer: HRA 10639</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Umsatzsteuer-ID</h3>
                  <p className="text-muted-foreground">
                    Umsatzsteuer-Identifikationsnummer gemäß §27 a
                    Umsatzsteuergesetz:
                  </p>
                  <p className="font-medium">DE317828779</p>
                </div>
              </div>
            </Section>

            <Section icon={Scale} title="Streitschlichtung">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Die Europäische Kommission stellt eine Plattform zur
                  Online-Streitbeilegung (OS) bereit:
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between"
                  >
                    <span>EU-Streitschlichtung</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Wir sind nicht bereit oder verpflichtet, an
                  Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </Section>

            <Section icon={Shield} title="Verantwortlicher Inhalt">
              <div className="space-y-2">
                <p className="font-medium">
                  Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p>Umut Tas</p>
                  <p className="text-muted-foreground">Von-Steuben-Str. 21</p>
                  <p className="text-muted-foreground">48143 Münster</p>
                </div>
              </div>
            </Section>
          </div>

          <div className="space-y-8 mt-12">
            {[
              {
                title: "Haftung für Inhalte",
                content: `Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.`,
              },
              {
                title: "Haftung für Links",
                content: `Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.`,
              },
              {
                title: "Urheberrecht",
                content: `Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.`,
              },
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-primary" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Separator className="my-12" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">Site Notice</h2>
              <p className="text-muted-foreground">
                Information provided according to Sec. 5 German Telemedia Act
                (TMG)
              </p>
            </div>
          </motion.div>
        </motion.div>
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
