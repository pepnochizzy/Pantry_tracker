"use client";
//TODO get all recipes from db and render them
import { useRecipes } from "@/hooks/useRecipes";

export default function RecipeList() {
  const { recipes, loading, error, refresh } = useRecipes();

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main>
      <div>
        {recipes.map((recipe) => {
          return (
            <section key={recipe.name}>
              <div>
                <p>{recipe.name}</p>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
