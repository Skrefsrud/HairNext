import { toPostgresInterval } from "../lib/databaseHelpers";

describe("toPostgresInterval", () => {
  test('should return "0 minutes" when input is 0', () => {
    expect(toPostgresInterval(0)).toBe("0 minutes");
  });

  test("should return correct interval for multiples of 60", () => {
    expect(toPostgresInterval(60)).toBe("1 hour");
    expect(toPostgresInterval(120)).toBe("2 hours");
  });

  test("should return correct interval for non-multiples of 60", () => {
    expect(toPostgresInterval(45)).toBe("45 minutes");
    expect(toPostgresInterval(90)).toBe("1 hour 30 minutes");
  });
});
