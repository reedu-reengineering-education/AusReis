// cypress/support/commands.ts

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      loginAsAdmin(email?: string, password?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  "login",
  (email = "user@example.com", password = "password") => {
    // Implementieren Sie hier die Login-Logik
    // Dies ist ein Beispiel und sollte an Ihre spezifische Authentifizierungsmethode angepasst werden
    cy.visit("/login");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    // Warten Sie auf die Umleitung oder ein Element, das anzeigt, dass der Benutzer eingeloggt ist
    cy.url().should("include", "/account");
  }
);

Cypress.Commands.add(
  "loginAsAdmin",
  (email = "admin@example.com", password = "adminpassword") => {
    // Implementieren Sie hier die Admin-Login-Logik
    // Dies ist ein Beispiel und sollte an Ihre spezifische Authentifizierungsmethode angepasst werden
    cy.visit("/login");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    // Warten Sie auf die Umleitung oder ein Element, das anzeigt, dass der Admin eingeloggt ist
    cy.url().should("include", "/admin");
  }
);

export {};
