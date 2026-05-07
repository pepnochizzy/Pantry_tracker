//For IngredientsForm component. Calls createRecipeCall

import { CreateRecipeCall } from "../api/recipes";

export async function CreateRecipe(body) {
  try {
    return await createRecipeCall(body);
  } catch (err) {
    console.error("Failed to create new recipe:", err.message);
    throw err;
  }
}
