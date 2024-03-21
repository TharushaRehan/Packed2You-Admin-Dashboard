"use server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const actionLoginUser = async (email: string, password: string) => {
  const supabase = createRouteHandlerClient({ cookies });
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return response;
};

export const actionCreateAdmin = async (email: string, password: string) => {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data: data, error: error };
};
