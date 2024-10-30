// path: cypress/component/Page.cy.tsx
// path: cypress/component/Page.cy.tsx
import React from "react";
import Page from "../../src/app/page";

describe("<Page />", () => {
  beforeEach(() => {
    // @ts-ignore
    cy.mount(<Page />);
  });

  it("should render the home page with correct title", () => {
    cy.get("h1").should("exist").and("contain.text", "Home");
  });

  it("should have the correct page structure", () => {
    cy.get("div").should("exist");
    cy.get("h1").should("exist");
  });

  // Fügen Sie hier weitere Tests hinzu, die spezifisch für Ihre Startseite sind
  it("should display expected content", () => {
    // Beispiel: Überprüfen Sie, ob ein bestimmter Text oder Element vorhanden ist
    cy.contains("Welcome to our app").should("be.visible");
  });
});
