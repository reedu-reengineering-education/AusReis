// path: cypress/e2e/navigation.cy.ts
/// <reference types="cypress" />

describe("Navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("sollte die Startseite korrekt anzeigen", () => {
    cy.contains("Willkommen bei Aus:Reis").should("be.visible");
    cy.contains(
      "Verwalten Sie Ihre Auslagen und Reisekosten einfach und effizient."
    ).should("be.visible");
  });

  it("sollte zur Login-Seite navigieren", () => {
    // Änderung hier: Suchen Sie nach dem Link zur Login-Seite
    cy.get('a[href="/login"]').click();
    cy.url().should("include", "/login");
  });

  it("sollte zur Konto-Seite navigieren, wenn authentifiziert", () => {
    // Simulieren Sie eine authentifizierte Sitzung
    cy.window().then((win) => {
      win.sessionStorage.setItem("user", JSON.stringify({ isLoggedIn: true }));
    });
    cy.visit("/");
    cy.contains("a", "Zum Benutzerkonto").click();
    cy.url().should("include", "/account");
  });

  it("sollte zur Admin-Seite navigieren, wenn als Admin authentifiziert", () => {
    // Simulieren Sie eine authentifizierte Admin-Sitzung
    cy.window().then((win) => {
      win.sessionStorage.setItem(
        "user",
        JSON.stringify({ isLoggedIn: true, role: "admin" })
      );
    });
    cy.visit("/");
    cy.contains("a", "Admin-Bereich").click();
    cy.url().should("include", "/admin");
  });

  it("sollte zur FAQ-Seite navigieren", () => {
    cy.visit("/faq");
    cy.contains("Häufig gestellte Fragen (FAQ)").should("be.visible");
    cy.get(
      'input[placeholder="Suchen Sie nach Fragen oder Stichwörtern..."]'
    ).should("be.visible");
  });

  it("sollte die Fehlerseite für ungültige Authentifizierung anzeigen", () => {
    cy.visit("/auth/error?error=InvalidEmail");
    cy.contains("Ungültige E-Mail-Adresse").should("be.visible");
    cy.contains("Bitte geben Sie eine gültige E-Mail-Adresse ein.").should(
      "be.visible"
    );
  });
});
