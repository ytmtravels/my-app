"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { toast } from "react-toastify";
import Login from "./Login";

export const Dashboard = () => {
  const { status, data: session } = useSession();
  console.log("dashboard page:", status);
  const handleOnclick = () => {
    toast.success("Successfully Logged Out!");
    signOut();
  };
  if (status === "authenticated") {
    return (
      <div className="grid h-screen w-full place-content-center">
        <div className="my-6 flex flex-col gap-2 bg-zinc-300/10 p-8 shadow-lg">
          <div className="">
            Name: <span className="font-bold">{session?.user?.name}</span>
          </div>
          <div className="">
            Email: <span className="font-bold">{session?.user?.email}</span>
          </div>
          <button
            onClick={handleOnclick}
            className="rounded-md border-[1px] border-red-500 bg-red-500 px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-red-500/80"
          >
            Log out
          </button>
        </div>
      </div>
    );
  } else {
    return <Login />;
  }
};
