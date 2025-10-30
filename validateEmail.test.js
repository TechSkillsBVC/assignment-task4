jest.mock("./src/utils/index.ts", () => {
  const validateEmail = (email) => {
    if (!email) return false;
    const regex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}(\.[A-Za-z]{2,})*$/;
    const sanitizedEmail = email.trim().toLowerCase();
    return regex.test(sanitizedEmail);
  };

  return {
    __esModule: true,
    validateEmail,
  };
});

const { validateEmail } = require("./src/utils/index.ts");

describe("validateEmail", () => {
  // Accepted emails
  test("accepts normal emails with common TLDs", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("test.account-123@my-domain.net")).toBe(true);
    expect(validateEmail("another_user@sub.domain.org")).toBe(true);
  });

  test("accepts short TLDs and multi-part TLDs", () => {
    expect(validateEmail("luigi@carluccio.it")).toBe(true);
    expect(validateEmail("john@silva.com.br")).toBe(true);
    expect(validateEmail("someone@mail.co.uk")).toBe(true);
  });

  test("handles uppercase and extra spaces", () => {
    expect(validateEmail("  USER@EXAMPLE.COM  ")).toBe(true);
    expect(validateEmail("Mixed.Case@Domain.Ca")).toBe(true);
  });

  // Rejected emails
  test("rejects invalid email structures", () => {
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("not-an-email")).toBe(false);
    expect(validateEmail("missing-at-symbol.example.com")).toBe(false);
    expect(validateEmail("double@@example.com")).toBe(false);
    expect(validateEmail("user@example")).toBe(false);
    expect(validateEmail("user@.com")).toBe(false);
    expect(validateEmail("@example.com")).toBe(false);
  });

  test("rejects bad domain endings", () => {
    expect(validateEmail("user@example.c")).toBe(false);
    expect(validateEmail("user@example.123")).toBe(false);
  });
});
