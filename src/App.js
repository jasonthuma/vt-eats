import React from "react";
import Navbar from "./components/Navbar";
import "bootstrap/dist/js/bootstrap.bundle";
import { AuthProvider } from "./context/AuthContext";
import RecipeList from "./components/RecipeList";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <RecipeList />
      </div>
    </AuthProvider>
  );
}

export default App;
