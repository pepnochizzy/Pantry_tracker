//backend tests for recipes
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/recipes/route";
import { db } from "@/utils/dbConnection";
console.log(process.cwd());
console.log(__dirname);

//mock
vi.mock("@/utils/dbConnection", () => ({
  db: {
    query: vi.fn(),
  },
}));

//POST route tests
function mockReq(body) {
  return new Request("http://localhost/api/recipes", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

//user_id missing, expect fail
describe("POST /api/recipes", () => {
  it("should reject empty user_id", async () => {
    db.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Pasta",
            notes: "notes",
            user_id: "1",
          },
        ],
      }) // recipe insert
      .mockResolvedValueOnce({
        rows: [{ id: 10 }],
      }) // ingredient insert
      .mockResolvedValueOnce({
        rows: [{}],
      }) // recipe_ingredient insert
      .mockResolvedValueOnce({}); // COMMIT

    const req = mockReq({
      recipe_name: "Pasta",
      notes: "notes",
      ingredients: [
        {
          name: "tomato",
          quantity: 20,
          unit: "grams",
        },
      ],
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

//missing ingredient name - fail
describe("POST /api/recipes", () => {
  it("should reject missing ingredient name", async () => {
    db.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Pasta",
            notes: "notes",
            user_id: "1",
          },
        ],
      }) // recipe insert
      .mockResolvedValueOnce({
        rows: [{ id: 10 }],
      }) // ingredient insert
      .mockResolvedValueOnce({
        rows: [{}],
      }) // recipe_ingredient insert
      .mockResolvedValueOnce({}); // COMMIT

    const req = mockReq({
      recipe_name: "macaroni",
      notes: "test",
      ingredients: [
        {
          name: "",
          quantity: 20,
          unit: "grams",
        },
      ],
      cook_time: "2:20",
      user_id: "1",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(`Ingredients must have a name`);
  });
});

//missing ingredient unit - fail
describe("POST /api/recipes", () => {
  it("should reject missing ingredient unit", async () => {
    db.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Pasta",
            notes: "notes",
            user_id: "1",
          },
        ],
      }) // recipe insert
      .mockResolvedValueOnce({
        rows: [{ id: 10 }],
      }) // ingredient insert
      .mockResolvedValueOnce({
        rows: [{}],
      }) // recipe_ingredient insert
      .mockResolvedValueOnce({}); // COMMIT

    const req = mockReq({
      recipe_name: "macaroni",
      notes: "test",
      ingredients: [
        {
          name: "pasta",
          quantity: 20,
          unit: "",
        },
      ],
      cook_time: "2:20",
      user_id: "1",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(`Ingredients must have a valid unit`);
  });
});

//ingredient quantity missing - fail
describe("POST /api/recipes", () => {
  it("should reject missing quantity", async () => {
    db.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Pasta",
            notes: "notes",
            user_id: "1",
          },
        ],
      }) // recipe insert
      .mockResolvedValueOnce({
        rows: [{ id: 10 }],
      }) // ingredient insert
      .mockResolvedValueOnce({
        rows: [{}],
      }) // recipe_ingredient insert
      .mockResolvedValueOnce({}); // COMMIT

    const req = mockReq({
      recipe_name: "macaroni",
      notes: "test",
      ingredients: [
        {
          name: "pasta",
          quantity: "",
          unit: "grams",
        },
      ],
      cook_time: "2:20",
      user_id: "1",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(`Ingredients must have a quantity`);
  });
});

//missing recipe name - fail
describe("POST /api/recipes", () => {
  it("should reject empty recipe name", async () => {
    db.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Pasta",
            notes: "notes",
            user_id: "1",
          },
        ],
      }) // recipe insert
      .mockResolvedValueOnce({
        rows: [{ id: 10 }],
      }) // ingredient insert
      .mockResolvedValueOnce({
        rows: [{}],
      }) // recipe_ingredient insert
      .mockResolvedValueOnce({}); // COMMIT

    const req = mockReq({
      recipe_name: "",
      notes: "test",
      ingredients: [
        {
          name: "tomato",
          quantity: 20,
          unit: "grams",
        },
      ],
      cook_time: "2:20",
      user_id: "1",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(`Recipe name is required and cannot be empty`);
  });
});

//cook_time missing - fail
describe("POST /api/recipes", () => {
  it("should reject empty cook_time", async () => {
    db.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Pasta",
            notes: "notes",
            user_id: "1",
          },
        ],
      }) // recipe insert
      .mockResolvedValueOnce({
        rows: [{ id: 10 }],
      }) // ingredient insert
      .mockResolvedValueOnce({
        rows: [{}],
      }) // recipe_ingredient insert
      .mockResolvedValueOnce({}); // COMMIT

    const req = mockReq({
      recipe_name: "Pasta",
      notes: "notes",
      ingredients: [
        {
          name: "tomato",
          quantity: 20,
          unit: "grams",
        },
      ],
      cook_time: "",
      user_id: "1",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(`Cook time is required`);
  });
});

//ingredient quantity not a number - fail
describe("POST /api/recipes", () => {
  it("should reject quantity not being a number", async () => {
    db.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Pasta",
            notes: "notes",
            user_id: "1",
          },
        ],
      }) // recipe insert
      .mockResolvedValueOnce({
        rows: [{ id: 10 }],
      }) // ingredient insert
      .mockResolvedValueOnce({
        rows: [{}],
      }) // recipe_ingredient insert
      .mockResolvedValueOnce({}); // COMMIT

    const req = mockReq({
      recipe_name: "macaroni",
      notes: "test",
      ingredients: [
        {
          name: "pasta",
          quantity: "20",
          unit: "grams",
        },
      ],
      cook_time: "2:20",
      user_id: "1",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(`Quantity must be a number`);
  });
});

//cook_time not a number
describe("POST /api/recipes", () => {
  it("should reject invalid cook_time", async () => {
    db.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Pasta",
            notes: "notes",
            user_id: "1",
          },
        ],
      }) // recipe insert
      .mockResolvedValueOnce({
        rows: [{ id: 10 }],
      }) // ingredient insert
      .mockResolvedValueOnce({
        rows: [{}],
      }) // recipe_ingredient insert
      .mockResolvedValueOnce({}); // COMMIT

    const req = mockReq({
      recipe_name: "Pasta",
      notes: "notes",
      ingredients: [
        {
          name: "tomato",
          quantity: 20,
          unit: "grams",
        },
      ],
      cook_time: "test",
      user_id: "1",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(
      `Invalid cook time. Expected a number (minutes) or hh:mm format`,
    );
  });
});

//cook_time minutes >59 - fail
describe("POST /api/recipes", () => {
  it("should reject wrong format of cook_time", async () => {
    db.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Pasta",
            notes: "notes",
            user_id: "1",
          },
        ],
      }) // recipe insert
      .mockResolvedValueOnce({
        rows: [{ id: 10 }],
      }) // ingredient insert
      .mockResolvedValueOnce({
        rows: [{}],
      }) // recipe_ingredient insert
      .mockResolvedValueOnce({}); // COMMIT

    const req = mockReq({
      recipe_name: "Pasta",
      notes: "notes",
      ingredients: [
        {
          name: "tomato",
          quantity: 20,
          unit: "grams",
        },
      ],
      cook_time: "2:60",
      user_id: "1",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(`Minutes need to be 0-59`);
  });
});

//cook_time hours -0< - fail
describe("POST /api/recipes", () => {
  it("should reject hour less than 0", async () => {
    db.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Pasta",
            notes: "notes",
            user_id: "1",
          },
        ],
      }) // recipe insert
      .mockResolvedValueOnce({
        rows: [{ id: 10 }],
      }) // ingredient insert
      .mockResolvedValueOnce({
        rows: [{}],
      }) // recipe_ingredient insert
      .mockResolvedValueOnce({}); // COMMIT

    const req = mockReq({
      recipe_name: "Pasta",
      notes: "notes",
      ingredients: [
        {
          name: "tomato",
          quantity: 20,
          unit: "grams",
        },
      ],
      cook_time: "-1:30",
      user_id: "1",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(`Hours cannot be less than 0`);
  });
});

//hours is not a number but mins is - fail
describe("POST /api/recipes", () => {
  it("should reject hour less than 0", async () => {
    db.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Pasta",
            notes: "notes",
            user_id: "1",
          },
        ],
      }) // recipe insert
      .mockResolvedValueOnce({
        rows: [{ id: 10 }],
      }) // ingredient insert
      .mockResolvedValueOnce({
        rows: [{}],
      }) // recipe_ingredient insert
      .mockResolvedValueOnce({}); // COMMIT

    const req = mockReq({
      recipe_name: "Pasta",
      notes: "notes",
      ingredients: [
        {
          name: "tomato",
          quantity: 20,
          unit: "grams",
        },
      ],
      cook_time: "test:30",
      user_id: "1",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(`Invalid cook time format. Expected hh:mm`);
  });
});

//success
describe("POST /api/recipes", () => {
  it("should succeed", async () => {
    db.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Pasta",
            notes: "notes",
            user_id: "1",
          },
        ],
      }) // recipe insert
      .mockResolvedValueOnce({
        rows: [{ id: 10 }],
      }) // ingredient insert
      .mockResolvedValueOnce({
        rows: [{}],
      }) // recipe_ingredient insert
      .mockResolvedValueOnce({}); // COMMIT

    const req = mockReq({
      recipe_name: "Pasta",
      notes: "notes",
      ingredients: [
        {
          name: "tomato",
          quantity: 20,
          unit: "grams",
        },
      ],
      cook_time: "1:30",
      user_id: "1",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.name).toBe("Pasta");
    expect(data.data.user_id).toBe("1");
    expect(data.data.notes).toBe("notes");
  });
});
