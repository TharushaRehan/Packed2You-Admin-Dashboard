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

// export const =  actionSignUpUser({
//   email,
//   password,
// }) => {
// const supabase = createRouteHandlerClient({ cookies });
// const { data } = await supabase
//   .from("profiles")
//   .select("*")
//   .eq("email", email);

// if (data?.length) return { error: { message: "User already exists", data } };

// const response = await supabase.auth.signUp({
//   email,
//   password,
//   options: {
//     emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
//   },
// });

// return response;
// }
