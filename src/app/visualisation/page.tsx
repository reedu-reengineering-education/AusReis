import React from "react";
import { readJsonFile } from "../../../readJsonFile";
import { createHierarchy } from "../../../createHierarchie";
import DependencyGraph from "@/components/visualisation/DependencyGraph";

// Lese die package.json-Datei
const packageJson = readJsonFile("./package.json");

// Erstelle die hierarchische Datenstruktur
const data = createHierarchy(packageJson.dependencies);

const App: React.FC = () => (
  <div>
    <h1>Dependency Graph</h1>
    <DependencyGraph data={data} width={800} height={600} />
  </div>
);

export default App;
