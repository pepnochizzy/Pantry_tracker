"use client";
import { useEffect, useState } from "react";
import { GetRecipes } from "@/lib/api/recipes";

export function useRecipes() {
  const [recipes, setRecipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchRecipes() {
    try {
      const data = await GetRecipes();
      console.log(data);
      setRecipe(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  return { recipes, loading, error, refresh: fetchRecipes };
}
