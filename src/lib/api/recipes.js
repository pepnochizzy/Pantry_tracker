//fetches POST route

export async function CreateRecipeCall(body) {
  const res = await fetch(`/api/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    //avoid crashes if API returns non-json/empty object by catching the error and returning err = {}, then you return either the error given OR the fallback message
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create new recipe");
  }
  const json = await res.json();
  return json.data;
}
