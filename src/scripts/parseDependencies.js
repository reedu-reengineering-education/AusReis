const fs = require("fs");

// Funktion, um die Abhängigkeiten zu durchlaufen und in ein D3-kompatibles Format umzuwandeln
const parseDependencies = (json, projectName) => {
  let nodes = [];
  let links = [];

  // Rekursive Funktion, um die Abhängigkeiten zu durchlaufen
  const traverse = (name, dependencies) => {
    if (!nodes.find((n) => n.id === name)) {
      nodes.push({ id: name });
    }

    // Durch alle Abhängigkeiten durchlaufen
    if (dependencies) {
      Object.keys(dependencies).forEach((dep) => {
        if (!nodes.find((n) => n.id === dep)) {
          nodes.push({ id: dep });
        }
        links.push({ source: name, target: dep });
        traverse(dep, dependencies[dep].dependencies); // Rekursion für tiefere Abhängigkeiten
      });
    }
  };

  // Beginne mit dem Hauptprojekt
  traverse(projectName, json.dependencies);

  return { nodes, links };
};

// Lese die dep.json Datei
fs.readFile("dependencies.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const json = JSON.parse(data);
  const result = parseDependencies(json, json.name);

  // Speichere das Ergebnis in einer Datei
  fs.writeFile(
    "d3Data.json",
    JSON.stringify(result, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("D3.js data written to d3Data.json");
      }
    }
  );
});
