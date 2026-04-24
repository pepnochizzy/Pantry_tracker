import { db } from "@/utils/dbConnection";

export async function DELETE(req, { params }) {
  //only needs to delete from recipe and recipe_ingredient table, ingredients can stay.
  //implementing cascade in database
  const { id } = await params;
  console.log("Deleting task with id:", id);

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
