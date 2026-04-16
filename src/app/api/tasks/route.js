import { db } from "@/utils/dbConnections";
import cookTimeValidation from "@/utils/cookTimeValidation";
//todo: Check the notes column in table to ensure it is able to take NULL and then do validation here

//GET route
export async function GET() {
  try {
    const res = await db.query(`SELECT * FROM recipes ORDER BY name`);
    //handle empty db
    const result = res.rows || [];

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to fetch recipes:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch task" }),
      { status: 500, headers: { "Content-type": "application/json" } },
    );
  }
}

//create new recipe
export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, ingredients, recipe_name, cook_time, notes } = body;

    //ingredients = array

    //handle empty values
    if (!user_id) {
      //although this should have been caught before adding a new recipe, we want it to be secure.
      return new Response(
        JSON.stringify({
          success: false,
          error: `Must be logged in to add a recipe`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (ingredients.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Ingredients are required`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!recipe_name || recipe_name.trim() === "") {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Recipe name is required and cannot be empty`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!cook_time) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Cook time is required`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    let validated_cook_time;
    //function to validate time
    cookTimeValidation(cook_time);
    //notes are optional

    await db.query("BEGIN");

    let recipe_result = await db.query(
      `INSERT INTO recipes (name, cook_time, notes, user_id)
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [recipe_name, validated_cook_time, notes, user_id],
    );
    let recipe_id = recipe_result.rows[0].id;
    for (const ingredient of ingredients) {
      //ensure all ingredients are always lowercase to make handling duplicates easier
      let ing = ingredient.toLowerCase().trim();
      //Database checks if an ingredient exists, returns id of ingredient.
      let result = await db.query(
        `
        INSERT INTO ingredients (name) 
        VALUES ($1)
        ON CONFLICT(name)
        DO UPDATE SET name = EXCLUDED.name
        RETURNING id`,
        [ing.name],
      );
      let ingredient_id = result.rows[0].id;
      await db.query(
        `
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        VALUES($1, $2, $3, $4)
        RETURNING *`,
        [recipe_id, ingredient_id, ing.quantity, ing.unit],
      );
    }

    await db.query("COMMIT");

    return new Response(
      JSON.stringify({ success: true, data: recipe_result.rows[0].name }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    await db.query("ROLLBACK");

    console.error("Failed to create recipe:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to create new recipe" }),
      { status: 500, headers: { "Content-type": "application/json" } },
    );
  }
}
