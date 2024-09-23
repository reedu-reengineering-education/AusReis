import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import background from "/public/background.svg"; // Pfad zur SVG-Datei

export default function Component() {
  return (
    <Card
      className="w-full max-w-md mx-auto bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 bg-white bg-opacity-75">
        <h2 className="text-2xl font-bold text-center">NFZ-Zahlungen</h2>
        <p className="text-center text-gray-600">
          Einfache und sichere Zahlungen für Nutzfahrzeuge
        </p>
      </CardContent>
    </Card>
  );
}
