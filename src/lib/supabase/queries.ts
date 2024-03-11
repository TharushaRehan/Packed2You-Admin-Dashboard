"use server";

import db from "./db";
import { categories } from "../../../migrations/schema";
import { Category } from "./supabase.types";

export const CREATE_CATEGORY = async (category: Category) => {
  try {
    await db.insert(categories).values(category);

    return { error: null };
  } catch (error) {
    return { error: error };
  }
};

export const GET_CATEGORIES = async () => {
  try {
    const results = await db.select().from(categories);

    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};
