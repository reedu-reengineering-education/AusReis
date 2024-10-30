// __tests__/Button.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";
import { describe, it, expect, jest } from "@jest/globals";
import { mount } from "cypress/react";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    // @ts-ignore
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick prop when clicked", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
