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
  expect(screen.getByText("Logged in as test@test.com")).toBeInTheDocument();
  expect(screen.getByText("Current Display Name: test")).toBeInTheDocument();
  const changeDisplayNameBtn = screen.getByText("Change Display Name");
  fireEvent.click(changeDisplayNameBtn);
  expect(screen.getByText("Enter New Name")).toBeInTheDocument();
});

it("shows the create recipe modal if the create recipe button is clicked", async () => {
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

  const createLink = screen.getByText("Create Recipe");

  fireEvent.click(createLink);
  expect(screen.getByText("Create New Recipe")).toBeInTheDocument();

  const addIngredient = screen.getByText("Add Ingredient");
  expect(addIngredient).toBeInTheDocument();
});

it("adds a new ingredient input each time the add ingredient button is clicked", async () => {
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

  const createLink = screen.getByText("Create Recipe");
  fireEvent.click(createLink);
  const addIngredient = screen.getByText("Add Ingredient");
  expect(screen.queryByTestId("ingredient1")).toBeNull();
  fireEvent.click(addIngredient);
  expect(screen.getByTestId("ingredient1")).toBeInTheDocument();
  fireEvent.click(addIngredient);
  expect(screen.getByTestId("ingredient2")).toBeInTheDocument();
});

it("clears and resets the ingredients when the clear ingredients button is clicked", async () => {
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

  const createLink = screen.getByText("Create Recipe");
  fireEvent.click(createLink);
  const addIngredient = screen.getByText("Add Ingredient");
  fireEvent.click(addIngredient);
  fireEvent.click(addIngredient);
  expect(screen.getByTestId("ingredient2")).toBeInTheDocument();
  const clearIngredients = screen.getByText("Clear Ingredients");
  fireEvent.click(clearIngredients);
  expect(screen.queryByTestId("ingredient2")).toBeNull();
});
