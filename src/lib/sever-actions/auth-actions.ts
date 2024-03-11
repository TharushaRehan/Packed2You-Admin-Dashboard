"use server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { adminAuthClient } from "../supabase/db";

export const actionLoginUser = async (email: string, password: string) => {
  const supabase = createRouteHandlerClient({ cookies });

  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return response;
};

export const actionCreateAdmin = async (email: string, password: string) => {
  const { data, error } = await adminAuthClient.createUser({
    email,
    password,
    role: "authenticated",
  });

  return { data: data, error: error };
};
