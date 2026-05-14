import { db } from "@/utils/dbConnection";
import cookTimeValidation from "@/utils/cookTimeValidation";

export async function DELETE(req, { params }) {
  //only needs to delete from recipe and recipe_ingredient table, ingredients can stay.
  //implementing cascade in database
  const { id } = await params;
  console.log("Deleting recipe with id:", id);

  try {
    const data = await db.query(
      `
        DELETE FROM recipes WHERE id = $1
        RETURNING *`,
      [id],
    );
    if (data.rowCount === 0) {
      return new Response(
        JSON.stringify(
          { success: false, error: "Recipe not found, cannot delete" },
          { status: 404 },
        ),
      );
    }
    return new Response(
      JSON.stringify({ success: true, data: `Rows deleted: ${data.rowCount}` }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("Failed to delete recipes and related content:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to to delete recipes and related content",
      }),
      { status: 500, headers: { "Content-type": "application/json" } },
    );
  }
}

export async function PATCH(req, { params }) {
  //update recipe
  //! as of right now, I am using user_id from client. When auth is set up use it from session/auth for safety.
  const { id } = await params;
  console.log("Updating recipe with id:", id);

  try {
    const body = await req.json();
    const { user_id, ingredients, recipe_name, cook_time, notes } = body;

    //validation

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
    validated_cook_time = cookTimeValidation(cook_time);
    //notes are optional

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Ingredients are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const validated_ingredients = [];
    for (const ingredient of ingredients) {
      if (
        typeof ingredient.quantity !== "number" ||
        Number.isNaN(ingredient.quantity)
      ) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Quantity must be a number`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
      //ensure all ingredients are always lowercase to make handling duplicates easier
      let ingName = ingredient.name?.toLowerCase().trim();
      validated_ingredients.push({
        name: ingName,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      });
    }
    await db.query("BEGIN");

    let recipe_result = await db.query(
      `
      UPDATE recipes SET
      name = $1,
      cook_time = $2,
      notes = $3,
      user_id = $4
      WHERE id = $5
      RETURNING *`,
      [recipe_name, validated_cook_time, notes, user_id, id],
    );
    let recipe_id = recipe_result.rows[0].id;

    await db.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1`, [
      recipe_id,
    ]);

    //ingredients
    for (const ingredient of validated_ingredients) {
      let result = await db.query(
        `
        INSERT INTO ingredients (name) 
        VALUES ($1)
        ON CONFLICT(name)
        DO UPDATE SET name = EXCLUDED.name
        RETURNING id`,
        [ingredient.name],
      );
      let ingredient_id = result.rows[0].id;
      await db.query(
        `
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        VALUES($1, $2, $3, $4)
        RETURNING *`,
        [recipe_id, ingredient_id, ingredient.quantity, ingredient.unit],
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

    console.error("Failed to update recipe:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to update recipe" }),
      { status: 500, headers: { "Content-type": "application/json" } },
    );
  }
}
