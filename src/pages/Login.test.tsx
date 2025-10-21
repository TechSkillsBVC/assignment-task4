import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Login from "./Login";
import { AuthenticationContext } from "../context/AuthenticationContext";

describe("Login Screen", () => {
  const mockUser = {
    id: "123",
    name: { first: "Test", last: "User" },
    email: "test@example.com",
    mobile: "123-456-7890",
  };

  const mockAuthContext = {
    value: mockUser,
    setValue: jest.fn(),
  };

  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
    dispatch: jest.fn(),
    setParams: jest.fn(),
    setOptions: jest.fn(),
    isFocused: jest.fn(),
    canGoBack: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dangerouslyGetParent: jest.fn(),
    dangerouslyGetState: jest.fn(),
  };

  const mockRoute = {
    name: "Login",
  };

  const renderLogin = () =>
    render(
      <AuthenticationContext.Provider value={mockAuthContext}>
        <Login navigation={mockNavigation as any} route={mockRoute as any} />
      </AuthenticationContext.Provider>
    );

  it("shows error messages for invalid email and password", async () => {
    const { getByText, getByPlaceholderText, queryByText } = renderLogin();

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "invalid-email");
    fireEvent(emailInput, "endEditing");

    fireEvent.changeText(passwordInput, "123");
    fireEvent(passwordInput, "endEditing");

    const loginButton = getByText("Log in");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(queryByText("invalid email")).toBeTruthy();
      expect(queryByText("invalid password")).toBeTruthy();
    });
  });

  it("does not show error messages for valid input", async () => {
    const { getByText, getByPlaceholderText, queryByText } = renderLogin();

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "user@example.com");
    fireEvent(emailInput, "endEditing");

    fireEvent.changeText(passwordInput, "password");
    fireEvent(passwordInput, "endEditing");

    const loginButton = getByText("Log in");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(queryByText("invalid email")).toBeNull();
      expect(queryByText("invalid password")).toBeNull();
    });
  });
});
