"use client";

import React, { useEffect, useState } from "react";
import Logo from "../../public/Logo.svg";
import Image from "next/image";
import { Button, Input } from "antd";
import { actionLoginUser } from "../lib/sever-actions/auth-actions";
import { useRouter } from "next/navigation";
import { CHECK_ADMIN } from "@/lib/supabase/queries";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogIn = async () => {
    //router.replace("/dashboard");

    if (email && password) {
      const { data, error } = await CHECK_ADMIN(email);

      console.log(data);

      if (error) {
        setError(error.toString());
        return;
      }

      if (data?.length !== 0) {
        const { data, error } = await actionLoginUser(email, password);

        if (error) {
          setError(error.message);
        } else {
          router.replace("/dashboard");
        }

        if (data) {
          console.log(data);
        }
      } else {
        setError("No user found with this email.");
      }
    } else {
      setError("Please enter email and password.");
    }
  };

  //

  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [email, password]);

  //
  return (
    <>
      <Image src={Logo} alt="Logo" className="mt-10 ml-5" />
      <div className="mt-10 text-center flex items-center justify-center flex-col">
        <p className="text-5xl">Admin Dashboard</p>
        <div className="border mt-10 p-5 rounded-lg w-[500px]">
          <p className="text-2xl mb-10 font-bold">Log In</p>
          <div className="space-y-6">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="large"
              placeholder="Email"
              type="email"
            />
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="large"
              type="password"
              placeholder="Password"
            />
            {error ? <p className="text-red-400">{error}</p> : ""}
          </div>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="mt-10"
            onClick={handleLogIn}
          >
            Log In
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
