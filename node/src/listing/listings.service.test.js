import ListingsService from "./listings.service";

describe("ListingsService", () => {
  describe("cleanDisplayPrice", () => {
    test("'$500 Per week' returns '500'", () => {
      expect(ListingsService.cleanDisplayPrice("$500 Per week")).toBe("500");
    });

    test("'$300PW to $350PW' returns '300'", () => {
      expect(ListingsService.cleanDisplayPrice("$300PW to $350PW")).toBe("300");
    });

    test("'$400-$450PW' returns '400'", () => {
      expect(ListingsService.cleanDisplayPrice("$400-$450PW")).toBe("400");
    });

    test("'Leased in 3 days - $600PW' returns '600'", () => {
      expect(ListingsService.cleanDisplayPrice("Leased in 3 days - $600PW")).toBe("600");
    });

    test("'Leased by AGENT 1 - $1000PW' returns '1000'", () => {
      expect(ListingsService.cleanDisplayPrice("Leased by AGENT 1 - $1000PW")).toBe("1000");
    });

    test("'Deposit Taken' returns empty string", () => {
      expect(ListingsService.cleanDisplayPrice("Deposit Taken")).toBe("");
    });
  })
});