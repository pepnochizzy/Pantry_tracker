import { db } from "@/utils/dbConnection";

//delete user account - cascades to users pantry
//Don't want recipes to be deleted, future feature will be other users being able to save recipes from others. If a user deletes their account, we want the recipe to remain.

//edit pantry
export async function PATCH(req, { params }) {
  //update pantry
  const { user_id } = await params;
}
