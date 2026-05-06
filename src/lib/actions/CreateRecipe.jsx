import { createRecipeCall } from "../api/recipes";

export async function createRecipe(body) {
  try {
    return await createRecipeCall(body);
  } catch (err) {
    console.error("Failed to create new recipe:", err.message);
    throw err;
  }
}
