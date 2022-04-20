import React from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "./utils/firebase";
import { Accordion } from "react-bootstrap";
import { deleteDoc, doc } from "firebase/firestore";

function RecipeList() {
  const { currentUser, displayName, recipes } = useAuth();

  async function deleteRecipe(id) {
    await deleteDoc(doc(db, "Recipes", id));
  }

  function handleDelete(e) {
    e.preventDefault();
    console.log(e.target.id);
    deleteRecipe(e.target.id);
  }

  let eventKey = -1;
  const recipeList = recipes.map((doc) => {
    const recipe = doc.data();
    eventKey++;

    return (
      <Accordion.Item eventKey={eventKey} className="bg-light">
        <Accordion.Header>{recipe.title}</Accordion.Header>
        <Accordion.Body>
          <ul className="mb-0">
            {recipe.ingredients.map((ingredient) => {
              return <li>{ingredient}</li>;
            })}
          </ul>
          <div className="text-center">
            <button
              id={doc.id}
              className="mt-2 btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    );
  });

  return (
    <>
      <div className="recipeList text-center">
        {currentUser && <p>Welcome {displayName}!</p>}
        {!currentUser && <h2>Log in to view recipes</h2>}
      </div>
      <div className="container">
        <Accordion>{currentUser && recipeList}</Accordion>
      </div>
    </>
  );
}

export default RecipeList;
