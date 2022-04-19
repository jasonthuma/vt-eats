import { db, auth } from "./utils/firebase";
import logo from "../img/logo.png";
import Modal from "react-bootstrap/Modal";
import React from "react";

function Navbar() {
  const [loginShow, setLoginShow] = React.useState(false);
  const handleLoginClose = () => setLoginShow(false);
  const handleLoginShow = () => setLoginShow(true);

  const [signupShow, setSignupShow] = React.useState(false);
  const handleSignupClose = () => setSignupShow(false);
  const handleSignupShow = () => setSignupShow(true);

  const [accountShow, setAccountShow] = React.useState(false);
  const handleAccountClose = () => setAccountShow(false);
  const handleAccountShow = () => setAccountShow(true);

  const [createShow, setCreateShow] = React.useState(false);
  const handleCreateClose = () => setCreateShow(false);
  const handleCreateShow = () => setCreateShow(true);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <a href="#" className="logo navbar-brand">
          <img src={logo} alt="logo" style={{ width: "100px" }} />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-collapse collapse" id="navbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item logged-in">
              <a href="#" className="nav-link" onClick={handleAccountShow}>
                Account
              </a>
            </li>
            <li className="nav-item logged-in">
              <a href="#" id="logout" className="nav-link">
                Logout
              </a>
            </li>
            <li className="logged-in">
              <a href="#" className="nav-link" onClick={handleCreateShow}>
                Create Recipe
              </a>
            </li>
            <li className="logged-out">
              <a href="#" className="nav-link" onClick={handleLoginShow}>
                Login
              </a>
            </li>
            <li className="logged-out">
              <a href="#" className="nav-link" onClick={handleSignupShow}>
                Sign Up
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Modal show={createShow} onHide={handleCreateClose}>
        <Modal.Header closeButton>Create New Recipe</Modal.Header>
        <Modal.Body>
          <form>
            <div className="input-field mb-3">
              <label htmlFor="title" className="form-label">
                Recipe Name
              </label>
              <input type="text" className="form-control" id="title" required />
            </div>
            <div className="input-field mb-3">
              <fieldset className="form-group border">
                <div className="form-group">
                  <div className="d-flex pb-3 justify-content-between">
                    <legend className="w-auto px-2">Ingredients</legend>
                    <button className="btn btn-success addIngredient">
                      Add Ingredient
                    </button>
                    <button className="btn btn-danger clearIngredients">
                      Clear Ingredients
                    </button>
                  </div>
                  <ol className="createIngredientsList" id="ingList">
                    <li>
                      <input type="text" id="ingredient1" required />
                    </li>
                  </ol>
                </div>
              </fieldset>
            </div>
            <button className="btn btn-secondary">Create</button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={accountShow} onHide={handleAccountClose}>
        <Modal.Header closeButton>Account Details</Modal.Header>
        <Modal.Body>
          <div className="account-details"></div>
          <button className="btn btn-dark">Change Display Name</button>
        </Modal.Body>
      </Modal>

      <Modal show={loginShow} onHide={handleLoginClose}>
        <Modal.Header closeButton>Login</Modal.Header>
        <Modal.Body>
          <form id="login-form">
            <div className="input-field mb-3">
              <label htmlFor="login-email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="login-email"
                required
              />
            </div>
            <div className="input-field mb-3">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="login-password"
                required
              />
            </div>
            <button className="btn btn-secondary" type="submit">
              Login
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={signupShow} onHide={handleSignupClose}>
        <Modal.Header closeButton>Sign up</Modal.Header>
        <Modal.Body>
          <form id="signup-form">
            <div className="input-field mb-3">
              <label htmlFor="signup-email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="signup-email"
                required
              />
            </div>
            <div className="input-field mb-3">
              <label htmlFor="signup-display-name" className="form-label">
                Display Name
              </label>
              <input
                type="text"
                className="form-control"
                id="signup-display-name"
                required
              />
            </div>
            <div className="input-field mb-3">
              <label htmlFor="signup-password" className="form-label">
                Choose password (min 8 characters)
              </label>
              <input
                type="password"
                id="signup-password"
                className="form-control"
                minLength="8"
                required
              />
            </div>
            <button className="btn btn-secondary" type="submit">
              Sign up
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </nav>
  );
}

export default Navbar;
