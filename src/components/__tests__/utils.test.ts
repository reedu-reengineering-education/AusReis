// __tests__/utils.test.ts
// import { formatCurrency } from "@/lib/utils";
// import { describe, it, expect } from "@jest/globals";

// describe("formatCurrency", () => {
//   it("formats currency correctly", () => {
//     console.log("Formatted output:", formatCurrency(1000));
//     console.log(
//       "Character codes:",
//       formatCurrency(1000)
//         .split("")
//         .map((c) => c.charCodeAt(0))
//     );
//     expect(formatCurrency(1000)).toEqual("1.000,00 €");
//     expect(formatCurrency(1234.56)).toEqual("1.234,56 €");
//     expect(formatCurrency(0)).toEqual("0,00 €");
//   });
// });
import { formatCurrency } from "@/lib/utils";
import { describe, it, expect } from "@jest/globals";

describe("formatCurrency", () => {
  it("formats currency correctly", () => {
    const formattedValue = formatCurrency(1000);
    console.log("Formatted output:", formattedValue);
    console.log(
      "Character codes:",
      formattedValue.split("").map((c) => c.charCodeAt(0))
    );

    // Verwenden Sie eine reguläre Ausdrucksprüfung anstelle eines exakten Vergleichs
    expect(formattedValue).toMatch(/^1\.000,00\s?€$/);
    expect(formatCurrency(1234.56)).toMatch(/^1\.234,56\s?€$/);
    expect(formatCurrency(0)).toMatch(/^0,00\s?€$/);
  });
});
