import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as hooks from "../AuthHook";
import "@testing-library/jest-dom";
import RecipeList from "../RecipeList";

it("shows the message telling the user to login in place of the recipe list when no one is signed in", () => {
  jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
    currentUser: null,
    displayName: "",
    recipes: [],
  }));
  render(<RecipeList />);

  expect(screen.getByText("Log in to view recipes")).toBeInTheDocument();
});

it("shows the welcome message along with the current display name when a user is signed in", () => {
  jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
    currentUser: {
      uid: "1",
      email: "test@test.com",
    },
    displayName: "test",
    recipes: [],
  }));
  render(<RecipeList />);

  expect(screen.getByText("Welcome test!")).toBeInTheDocument();
});
