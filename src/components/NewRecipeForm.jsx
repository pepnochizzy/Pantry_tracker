import { useState } from "react";
import IngredientsForm from "./IngredientsForm";

export default function NewRecipeForm() {
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);

  const addIngredient = () => {
    setIngredients([...ingredients, {}]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Recipe Name: </label>
        <input type="text" id="name" />
      </div>
      <div id="ingredientForm">
        {ingredients.map((_, index) => (
          <IngredientsForm key={index} index={index} />
        ))}
        <button type="button" onClick={addIngredient}>
          {" "}
          +{" "}
        </button>
      </div>
    </form>
  );
}
