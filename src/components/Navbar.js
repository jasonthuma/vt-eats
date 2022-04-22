import logo from "../img/logo.png";
import React, { useRef } from "react";
import { useAuth } from "../components/AuthHook";
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

  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();
  const signUpEmailRef = useRef();
  const signUpDisplayNameRef = useRef();
  const signUpPasswordRef = useRef();
  const createTitleRef = useRef();
  const changeDisplayNameRef = useRef();

  const [ingredients, setIngredients] = React.useState({ 0: "" });

  async function handleSignup(e) {
    e.preventDefault();
    const email = signUpEmailRef.current.value;
    const password = signUpPasswordRef.current.value;
    const display = signUpDisplayNameRef.current.value;
    //sign up the user

    if (signUpDisplayNameRef.current.value === "") {
      setSignupAlert("Display Name must be provided");
      return;
    }

    await signup(email, password)
      .then(async (userCredential) => {
        handleSignupClose();
        signUpEmailRef.value = "";
        signUpPasswordRef.value = "";
        signUpDisplayNameRef.value = "";
        setSignupAlert("");
        await setDoc(doc(db, "users", userCredential.user.uid), {
          displayName: display,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("code:", errorCode);

        if (errorCode === "auth/invalid-email") {
          setSignupAlert("Invalid Email, try again");
        } else if (errorCode === "auth/email-already-in-use") {
          setSignupAlert("User already exists, try login instead");
        } else if (errorCode === "auth/weak-password") {
          setSignupAlert("Password must be 8 characters minimum");
        }
      });
  }

  async function handleLogin(e) {
    e.preventDefault();
    const email = loginEmailRef.current.value;
    const password = loginPasswordRef.current.value;
    await login(email, password)
      .then((credential) => {
        handleLoginClose();
        loginEmailRef.value = "";
        loginPasswordRef.value = "";
        setLoginAlert("");
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("code:", errorCode);
        if (
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/invalid-email"
        ) {
          setLoginAlert("Incorrect Username/Password, try again");
        } else if (errorCode === "auth/user-not-found") {
          setLoginAlert("User not found, click Sign Up to create an account");
        }
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
    let ingredientList = [];
    for (const ingredient in ingredients) {
      ingredientList.push(ingredients[ingredient]);
    }
    try {
      await addDoc(collection(db, "Recipes"), {
        title: createTitleRef.current.value,
        ingredients: ingredientList,
        user: currentUser.uid,
      });
      handleCreateClose();
      createTitleRef.value = "";
      setIngredients({ 0: "" });
    } catch (e) {
      console.error("Error adding recipe: ", e);
    }
  }

  function handleAddIngredient(e) {
    e.preventDefault();
    setIngredients({ ...ingredients, [Object.keys(ingredients).length]: "" });
  }

  function handleClearIngredients(e) {
    e.preventDefault();
    setIngredients({ 0: "" });
  }

  function handleIngredientChange(e) {
    setIngredients({ ...ingredients, [e.target.id]: e.target.value });
  }

  async function handleChangeDisplayName(e) {
    e.preventDefault();
    const newName = changeDisplayNameRef.current.value;
    await updateDoc(doc(db, "users", currentUser.uid), {
      displayName: newName,
    });
    handleChangeDisplayNameClose();
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <button className="logo navbar-brand">
          <img src={logo} alt="logo" style={{ width: "100px" }} />
        </button>
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
              <li className="nav-item logged-in" key="1">
                <button className="nav-link" onClick={handleAccountShow}>
                  Account
                </button>
              </li>
            )}
            {currentUser && (
              <li className="nav-item logged-in" key="2">
                <button id="logout" className="nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
            {currentUser && (
              <li className="nav-item logged-in" key="3">
                <button className="nav-link" onClick={handleCreateShow}>
                  Create Recipe
                </button>
              </li>
            )}
            {!currentUser && (
              <li className="nav-item logged-out" key="4">
                <button className="nav-link" onClick={handleLoginShow}>
                  Login
                </button>
              </li>
            )}
            {!currentUser && (
              <li className="nav-item logged-out" key="5">
                <button className="nav-link" onClick={handleSignupShow}>
                  Sign Up
                </button>
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
              <input
                type="text"
                className="form-control"
                id="title"
                ref={createTitleRef}
                required
              />
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
                  <ul key="ingredientslist">
                    {Object.keys(ingredients).map((i) => (
                      <li key={i + 35}>
                        <input
                          type="text"
                          className="ingredientInput"
                          key={i}
                          id={"ingredient" + i}
                          data-testid={"ingredient" + i}
                          onChange={handleIngredientChange}
                        />
                      </li>
                    ))}
                  </ul>
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
                ref={loginEmailRef}
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
                ref={loginPasswordRef}
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
                ref={signUpEmailRef}
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
                ref={signUpDisplayNameRef}
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
                ref={signUpPasswordRef}
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
                ref={changeDisplayNameRef}
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
