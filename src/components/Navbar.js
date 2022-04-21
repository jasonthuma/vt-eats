import logo from "../img/logo.png";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "./utils/firebase";
import { collection, addDoc, setDoc, updateDoc, doc } from "firebase/firestore";
import { Alert, Modal } from "react-bootstrap";

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

  const [changeDisplayNameShow, setChangeDisplayNameShow] =
    React.useState(false);
  const handleChangeDisplayNameClose = () => setChangeDisplayNameShow(false);
  const handleChangeDisplayNameShow = () => setChangeDisplayNameShow(true);

  const [signupAlert, setSignupAlert] = React.useState("");
  const [loginAlert, setLoginAlert] = React.useState("");
  const { signup, login, currentUser, displayName, logout } = useAuth();

  let errorAlert = "";
  async function handleSignup(e) {
    e.preventDefault();

    const signupForm = document.querySelector("#signup-form");
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;
    const display = signupForm["signup-display-name"].value;
    //sign up the user

    await signup(email, password)
      .then(async (userCredential) => {
        handleSignupClose();
        signupForm.reset();
        setSignupAlert("");
        await setDoc(doc(db, "users", userCredential.user.uid), {
          displayName: display,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("code:", errorCode);

        if (errorCode === "auth/invalid-email") {
          errorAlert = "Invalid Email, try again";
        } else if (errorCode === "auth/email-already-in-use") {
          errorAlert = "User already exists, try login instead";
        } else if (errorCode === "auth/weak-password") {
          errorAlert = "Password must be 8 characters minimum";
        }
        setSignupAlert(errorAlert);
      });
  }

  async function handleLogin(e) {
    e.preventDefault();
    const loginForm = document.querySelector("#login-form");
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;
    await login(email, password)
      .then((credential) => {
        handleLoginClose();
        loginForm.reset();
        setLoginAlert("");
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("code:", errorCode);
        if (
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/invalid-email"
        ) {
          errorAlert = "Incorrect Username/Password, try again";
        } else if (errorCode === "auth/user-not-found") {
          errorAlert = "User not found, click Sign Up to create an account";
        }
        setLoginAlert(errorAlert);
      });
  }

  function handleLogout() {
    logout()
      .then(() => {})
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });
  }

  async function handleCreateRecipe(e) {
    e.preventDefault();
    const createForm = document.querySelector("#create-form");
    let userIngredientList = document.querySelectorAll(
      ".createIngredientsList li"
    );
    let ingredientList = [];
    for (let i = 1; i <= userIngredientList.length; i++) {
      let ingredient = document.getElementById(`ingredient${i}`).value;
      ingredientList.push(ingredient);
    }
    try {
      await addDoc(collection(db, "Recipes"), {
        title: createForm["title"].value,
        ingredients: ingredientList,
        user: currentUser.uid,
      });
      console.log("Recipe written to db");
      handleCreateClose();
      createForm.reset();
      //const recipeSnapshot = await getDocs(collection(db, "Recipes"));
      //setupRecipes(recipeSnapshot);
    } catch (e) {
      console.error("Error adding recipe: ", e);
    }
  }
  let ingredientCount = 1;
  function handleAddIngredient(e) {
    e.preventDefault();
    ingredientCount++;
    const ingredientList = document.querySelector(".createIngredientsList");
    const li = document.createElement("li");
    li.innerHTML = `<input type="text" class="ingredientInput" id="ingredient${ingredientCount}"/>`;
    ingredientList.appendChild(li);
  }

  function handleClearIngredients(e) {
    e.preventDefault();
    ingredientCount = 1;
    document.getElementById("ingList").innerHTML = "";
    const ingredientList = document.querySelector(".createIngredientsList");
    const li = document.createElement("li");
    li.innerHTML = `<input type="text" class="ingredientInput" id="ingredient${ingredientCount}"/>`;
    ingredientList.appendChild(li);
  }

  async function handleChangeDisplayName(e) {
    e.preventDefault();
    const changeNameForm = document.querySelector("#change-name-form");
    const newName = changeNameForm["new-name"].value;
    await updateDoc(doc(db, "users", currentUser.uid), {
      displayName: newName,
    });
    handleChangeDisplayNameClose();
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid mx-5">
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
            {currentUser && (
              <li className="nav-item logged-in">
                <a href="#" className="nav-link" onClick={handleAccountShow}>
                  Account
                </a>
              </li>
            )}
            {currentUser && (
              <li className="nav-item logged-in">
                <a
                  href="#"
                  id="logout"
                  className="nav-link"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </li>
            )}
            {currentUser && (
              <li className="nav-item logged-in">
                <a href="#" className="nav-link" onClick={handleCreateShow}>
                  Create Recipe
                </a>
              </li>
            )}
            {!currentUser && (
              <li className="nav-item logged-out">
                <a href="#" className="nav-link" onClick={handleLoginShow}>
                  Login
                </a>
              </li>
            )}
            {!currentUser && (
              <li className="nav-item logged-out">
                <a href="#" className="nav-link" onClick={handleSignupShow}>
                  Sign Up
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <Modal show={createShow} onHide={handleCreateClose}>
        <Modal.Header closeButton>Create New Recipe</Modal.Header>
        <Modal.Body>
          <form id="create-form">
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
                    <button
                      className="btn btn-success addIngredient"
                      onClick={handleAddIngredient}
                    >
                      Add Ingredient
                    </button>
                    <button
                      className="btn btn-danger clearIngredients"
                      onClick={handleClearIngredients}
                    >
                      Clear Ingredients
                    </button>
                  </div>
                  <ol className="createIngredientsList" id="ingList">
                    <li>
                      <input
                        type="text"
                        id="ingredient1"
                        className="ingredientInput"
                        required
                      />
                    </li>
                  </ol>
                </div>
              </fieldset>
            </div>
            <button className="btn btn-secondary" onClick={handleCreateRecipe}>
              Create
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={accountShow} onHide={handleAccountClose}>
        <Modal.Header closeButton>Account Details</Modal.Header>
        <Modal.Body className="text-center">
          <div className="account-details">
            {currentUser && <p>Logged in as {currentUser.email}</p>}
            {currentUser && <p>Current Display Name: {displayName}</p>}
          </div>
          <button
            className="btn btn-dark"
            onClick={handleChangeDisplayNameShow}
          >
            Change Display Name
          </button>
        </Modal.Body>
      </Modal>

      <Modal show={loginShow} onHide={handleLoginClose}>
        <Modal.Header closeButton>Login</Modal.Header>
        <Modal.Body>
          {loginAlert && <Alert variant="danger">{loginAlert}</Alert>}
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
            <button
              className="btn btn-secondary"
              type="submit"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={signupShow} onHide={handleSignupClose}>
        <Modal.Header closeButton>Sign up</Modal.Header>
        <Modal.Body>
          {signupAlert && <Alert variant="danger">{signupAlert}</Alert>}
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
                minLength={8}
                required
              />
            </div>
            <button
              className="btn btn-secondary"
              type="submit"
              onClick={handleSignup}
            >
              Sign up
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={changeDisplayNameShow} onHide={handleChangeDisplayNameClose}>
        <Modal.Header closeButton>Change Display Name</Modal.Header>
        <Modal.Body className="text-center">
          <form id="change-name-form">
            <div className="input-field mb-3">
              <label htmlFor="new-name">Enter New Name</label>
              <input
                type="text"
                id="new-name"
                className="form-control"
                required
              />
            </div>
            <button
              className="btn btn-secondary"
              type="submit"
              onClick={handleChangeDisplayName}
            >
              Submit
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </nav>
  );
}

export default Navbar;
