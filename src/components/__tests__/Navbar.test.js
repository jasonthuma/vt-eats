import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Navbar from "../Navbar";
import * as hooks from "../AuthHook";

import "@testing-library/jest-dom";

// const Provider = ({ children }) => {
//   return <AuthProvider>{children}</AuthProvider>;
// };

it("shows the login and signup buttons if there is not a user currently signed in", () => {
  jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
    signup: jest.fn(),
    login: jest.fn(),
    currentUser: null,
    displayName: "",
    logout: jest.fn(),
  }));
  render(<Navbar />);
  const loginLink = screen.getByText("Login");
  const signUpLink = screen.getByText("Sign Up");
  expect(loginLink).toBeInTheDocument();
  expect(signUpLink).toBeInTheDocument();
});

it("shows the account/logout/create recipe buttons if a user is currently signed in", async () => {
  jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
    signup: jest.fn(),
    login: jest.fn(),
    currentUser: {
      uid: "1",
      email: "test@test.com",
    },
    displayName: "test",
    logout: jest.fn(),
  }));
  render(<Navbar />);
  const logoutLink = screen.getByText("Logout");
  const accountLink = screen.getByText("Account");
  const createRecipeLink = screen.getByText("Create Recipe");

  expect(logoutLink).toBeInTheDocument();
  expect(accountLink).toBeInTheDocument();
  expect(createRecipeLink).toBeInTheDocument();
});

it("shows the account details if the account button is clicked", async () => {
  jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
    signup: jest.fn(),
    login: jest.fn(),
    currentUser: {
      uid: "1",
      email: "test@test.com",
    },
    displayName: "test",
    logout: jest.fn(),
  }));
  render(<Navbar />);

  const accountLink = screen.getByText("Account");

  fireEvent.click(accountLink);
  await waitFor(() => expect(screen.getByText("Logged in as test@test.com")));
  await waitFor(() => expect(screen.getByText("Current Display Name: test")));
  const changeDisplayNameBtn = screen.getByText("Change Display Name");
  fireEvent.click(changeDisplayNameBtn);
  await waitFor(() => expect(screen.getByText("Enter New Name")));
});
