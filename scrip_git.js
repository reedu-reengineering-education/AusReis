const { execSync } = require("child_process");

// Funktion zum Ausführen von Git-Befehlen
function runGitCommand(command, errorMessage) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(errorMessage);
    process.exit(1);
  }
}

// Main Branch initialisieren und committen
runGitCommand("git checkout main", "Error checking out main branch");
runGitCommand("git add .", "Error adding files to main branch");
runGitCommand(
  'git commit -m "Initial commit on main"',
  "Error committing to main branch"
);

// // Branch für Prisma erstellen und committen
// runGitCommand(
//   "git checkout -b feature/prisma-setup",
//   "Error creating feature/prisma-setup branch"
// );
// runGitCommand("git rm --cached prisma/*", "Error unstaging Prisma files");
// runGitCommand("git add prisma/", "Error adding Prisma files");
// runGitCommand(
//   'git commit -m "Add Prisma setup and migrations"',
//   "Error committing Prisma setup"
// );

// Branch für die App-Komponente erstellen und committen
runGitCommand(
  "git checkout -b feature/app-components",
  "Error creating feature/app-components branch"
);
runGitCommand("git add src/app/", "Error adding app files");
runGitCommand(
  'git commit -m "Add app components"',
  "Error committing app components"
);

// Branch für die UI-Komponenten erstellen und committen
runGitCommand(
  "git checkout -b feature/ui-components",
  "Error creating feature/ui-components branch"
);
runGitCommand("git add src/components/ui/", "Error adding UI components");
runGitCommand(
  'git commit -m "Add UI components"',
  "Error committing UI components"
);

// Branch für die API erstellen und committen
runGitCommand(
  "git checkout -b feature/api-setup",
  "Error creating feature/api-setup branch"
);
runGitCommand("git add src/pages/api/", "Error adding API files");
runGitCommand('git commit -m "Add API setup"', "Error committing API setup");

// Branch für die Scripte erstellen und committen
runGitCommand(
  "git checkout -b feature/scripts-setup",
  "Error creating feature/scripts-setup branch"
);
runGitCommand("git add src/scripts/", "Error adding script files");
runGitCommand('git commit -m "Add custom scripts"', "Error committing scripts");

// Branch für die Lib erstellen und committen
runGitCommand(
  "git checkout -b feature/lib-setup",
  "Error creating feature/lib-setup branch"
);
runGitCommand("git add src/lib/", "Error adding lib files");
runGitCommand(
  'git commit -m "Add library files"',
  "Error committing lib files"
);

// Branch für die Hooks erstellen und committen
runGitCommand(
  "git checkout -b feature/hooks-setup",
  "Error creating feature/hooks-setup branch"
);
runGitCommand("git add src/hooks/", "Error adding hooks files");
runGitCommand('git commit -m "Add hooks"', "Error committing hooks");

// Branch für die public Dateien erstellen und committen
runGitCommand(
  "git checkout -b feature/public-files",
  "Error creating feature/public-files branch"
);
runGitCommand("git add public/", "Error adding public files");
runGitCommand(
  'git commit -m "Add public files"',
  "Error committing public files"
);

// Branch für die TypeScript-Typdateien erstellen und committen
runGitCommand(
  "git checkout -b feature/types-setup",
  "Error creating feature/types-setup branch"
);
runGitCommand(
  "git add types/nextauth.d.ts types/react-three-fiber.d.ts",
  "Error adding TypeScript definition files"
);
runGitCommand(
  'git commit -m "Add TypeScript definition files for next-auth and react-three-fiber"',
  "Error committing TypeScript definition files"
);

// Zurück zum main Branch wechseln
runGitCommand("git checkout main", "Error checking out main branch");
