import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as hooks from "../AuthHook";
import "@testing-library/jest-dom";
import RecipeList from "../RecipeList";

it("shows the login and signup buttons if there is not a user currently signed in", () => {
  jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
    currentUser: null,
    displayName: "",
    recipes: [],
  }));
  render(<RecipeList />);

  expect(screen.getByText("Log in to view recipes")).toBeInTheDocument();
});
