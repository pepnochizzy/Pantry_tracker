//backend tests for recipes
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/recipes/route";
import * as dbModule from "@/utils/dbConnection";
console.log(process.cwd());
console.log(__dirname);

//POST route tests
function mockReq(body) {
  return new Request("http://localhost/api/recipes", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

//TODO test that it fails if the following are missing: user_id, ingredients (name, quantity and unit), recipe name, cook_time.
//TODO test if these are caught in validation: ingredient quantity is not a number and time is not a number/wrong format
//TODO test success if all values are valid.

//user_id missing, expect fail
describe("POST /api/recipes", () => {
  it("should reject empty user_id", async () => {
    const req = mockReq({
      recipe_name: "Pasta",
      notes: "notes",
      ingredients: {
        name: "tomato",
        quantity: 20,
        unit: "grams",
      },
      cook_time: "2:20",
      user_id: "",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(`Must be logged in to add a recipe`);
  });
});
