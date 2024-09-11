const { execSync } = require("child_process");

// Funktion, um Git-Befehle auszuführen
function runGitCommand(command) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
}

// Main Branch initialisieren und committen
runGitCommand("git checkout main");
runGitCommand("git add .");
runGitCommand('git commit -m "Initial commit on main"');

// Branch für Frontend erstellen und committen
runGitCommand("git checkout -b feature/frontend");
runGitCommand("git add src/frontend/*");
runGitCommand('git commit -m "Add frontend files"');

// Branch für Backend erstellen und committen
runGitCommand("git checkout -b feature/backend");
runGitCommand("git add src/backend/*");
runGitCommand('git commit -m "Add backend files"');

// Branch für Auth erstellen und committen
runGitCommand("git checkout -b feature/auth");
runGitCommand("git add src/auth/*");
runGitCommand('git commit -m "Add auth files"');
