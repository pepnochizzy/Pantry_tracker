"use client";
import { useState } from "react";
import IngredientsForm from "./IngredientsForm";
import { createRecipe } from "@/lib/actions/CreateRecipe";

export default function NewRecipeForm() {
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: 0, unit: "" },
  ]);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: 0, unit: "" }]);
  };

  function handleChange(index, event) {
    const copy = [...ingredients];
    const { name, value } = event.target;
    //convert quantity to number
    copy[index][name] = name === "quantity" ? Number(value) : value;
    setIngredients(copy);
  }

  async function timeFormat(hours, mins) {
    //cookTimeValidation function expects the format 1:30 for times
    const cook_time = `${hours}:${mins}`;
    return cook_time;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const hours = formData.get("hours");
    const mins = formData.get("minutes");

    timeFormat(hours, mins);

    const body = {
      recipe_name: formData.get("name"),
      notes: formData.get("notes"),
      ingredients: ingredients,
      cook_time: await timeFormat(hours, mins),
      //this user_id will be from auth when set up, for testing I am setting it to 1
      user_id: 1,
    };
    console.log(body);
    try {
      await createRecipe(body);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Recipe Name: </label>
        <input type="text" id="name" name="name" />
      </div>
      <div>
        <p>Cook time:</p>
        <div>
          <label htmlFor="hours">Hours: </label>
          <input type="number" id="hours" name="hours" defaultValue="0" />
          <label htmlFor="minutes">Minutes: </label>
          <input
            type="number"
            id="minutes"
            name="minutes"
            max="59"
            defaultValue="0"
          />
        </div>
      </div>
      <div id="ingredientForm">
        {ingredients.map((_, index) => (
          <IngredientsForm
            key={index}
            index={index}
            handleChange={handleChange}
          />
        ))}
        <button type="button" onClick={addIngredient}>
          {" "}
          +{" "}
        </button>
      </div>
      <div>
        <label htmlFor="notes">Notes: </label>
        <textarea type="text" id="notes" name="notes"></textarea>
      </div>
      <button type="submit">Create Recipe</button>
    </form>
  );
}
