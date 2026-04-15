import { db } from "@/utils/dbConnections";

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
  } catch (err) {}
}
