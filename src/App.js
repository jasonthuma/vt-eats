import React from "react";
import Navbar from "./components/Navbar";
import "bootstrap/dist/js/bootstrap.bundle";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <div className="text-center container">
          <p className="display-name" style={{ marginTop: "40px" }}></p>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
