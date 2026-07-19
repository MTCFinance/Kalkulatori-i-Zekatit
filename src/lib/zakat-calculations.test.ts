import { describe, expect, it } from "vitest";
import {
  calculateCamelZakatText,
  calculateCattleBuffaloZakatText,
  calculateNisabValue,
  calculateSheepGoatZakatDue,
  toNumber,
} from "./zakat-calculations";

describe("toNumber", () => {
  it("normalizes unsafe numeric input to zero", () => {
    expect(toNumber("")).toBe(0);
    expect(toNumber("-10")).toBe(0);
    expect(toNumber("abc")).toBe(0);
    expect(toNumber("NaN")).toBe(0);
  });

  it("accepts positive numbers and comma decimals", () => {
    expect(toNumber("12")).toBe(12);
    expect(toNumber("12,5")).toBe(12.5);
  });
});

describe("calculateSheepGoatZakatDue", () => {
  it.each([
    [39, 0],
    [40, 1],
    [120, 1],
    [121, 2],
    [200, 2],
    [201, 3],
    [300, 3],
    [400, 4],
  ])("returns %i for %i sheep/goats", (total, expected) => {
    expect(calculateSheepGoatZakatDue(total)).toBe(expected);
  });
});

describe("calculateCattleBuffaloZakatText", () => {
  const noZakat = "No Zakat";

  it("returns the provided no-zakat label under 30", () => {
    expect(calculateCattleBuffaloZakatText(29, "en", noZakat)).toBe(noZakat);
  });

  it.each([
    [30, "1 tabi’/tabi’ah"],
    [40, "1 musinnah"],
    [60, "2 tabi’/tabi’ah"],
    [70, "1 musinnah + 1 tabi’/tabi’ah"],
  ])("includes %s for %i cattle/buffalo", (total, expected) => {
    expect(calculateCattleBuffaloZakatText(total, "en", noZakat)).toContain(
      expected,
    );
  });

  it("includes valid 30/40 combinations at 120", () => {
    const result = calculateCattleBuffaloZakatText(120, "en", noZakat);

    expect(result).toContain("4 tabi’/tabi’ah");
    expect(result).toContain("3 musinnah");
    expect(result).toContain("from 120 valid animals");
  });
});

describe("calculateCamelZakatText", () => {
  const noZakat = "No Zakat";

  it("returns the provided no-zakat label under 5", () => {
    expect(calculateCamelZakatText(4, "en", noZakat)).toBe(noZakat);
  });

  it.each([
    [5, "1 dele/dhi"],
    [25, "1 bint makhad"],
    [91, "2 hiqqah"],
  ])("includes %s for %i camels", (total, expected) => {
    expect(calculateCamelZakatText(total, "en", noZakat)).toContain(expected);
  });

  it("includes a valid 40/50 combination at 121", () => {
    const result = calculateCamelZakatText(121, "en", noZakat);

    expect(result).toMatch(/bint labun|hiqqah/);
    expect(result).toContain("from 121 valid camels");
  });
});

describe("calculateNisabValue", () => {
  it("calculates gold nisab", () => {
    expect(
      calculateNisabValue({
        basis: "Ari",
        goldPrice: 70,
        silverPrice: 0,
        manualValue: 0,
      }),
    ).toBe(5950);
  });

  it("calculates silver nisab", () => {
    expect(
      calculateNisabValue({
        basis: "Argjendi",
        goldPrice: 0,
        silverPrice: 0.85,
        manualValue: 0,
      }),
    ).toBe(505.75);
  });

  it("uses manual nisab", () => {
    expect(
      calculateNisabValue({
        basis: "Vlerë manuale",
        goldPrice: 0,
        silverPrice: 0,
        manualValue: 5000,
      }),
    ).toBe(5000);
  });
});
