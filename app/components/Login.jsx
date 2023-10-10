"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorEmail("Enetr your Email address.");
      setErrorPassword("");
      return;
    }
    if (!password) {
      setErrorEmail("");
      setErrorPassword("Please choose a password.");
      return;
    }
    setLoading(true);

    try {
      const id = toast.loading("Logging you in...");
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log("res: ", res);
      if (res.error) {
        setLoading(false);
        toast.update(id, {
          render: "Login failed.",
          type: "error",
          isLoading: false,
          autoClose: true,
        });
        // toast.error("Login failed.");

        setErrorEmail("Invalid Credentials.");
        setErrorPassword("Invalid Credentials.");
        return;
      }
      setLoading(false);
      toast.update(id, {
        render: "Successfully Logged in!",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      // toast.success("Successfully Logged in! Redirecting...");
      router.push("/dashboard");
    } catch (error) {
      console.log("Something went wrong.", error);
    }
  };
  return (
    <div className="flex  items-center justify-center bg-darkGray  md:justify-start md:bg-login-gradient md:bg-cover md:bg-no-repeat md:pl-40">
      <div className="flex w-[360px] flex-col items-center rounded-[22px] bg-darkGreen  p-5 shadow-login md:m-5 md:w-[440px] md:rounded-[32px]  md:bg-white/10 md:px-10 md:pb-10">
        <Image
          src="/assets/logo.png"
          width={50}
          height={50}
          alt="Logo"
          className="mb-3 rounded-full"
        />
        <h2 className="text-center text-2xl font-medium capitalize text-white">
          Log In Into Your Account
        </h2>
        <p className="text-center text-sm text-white/60">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-base capitalize text-white">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Ex: company123@gmail.com"
              className={`w-full appearance-none rounded-[9px] border-[1px]  bg-white/10 p-3 text-[#999] shadow outline-none placeholder:text-[15px] placeholder:capitalize placeholder:text-[#999999] placeholder:opacity-60   ${
                errorEmail ? "border-red-500" : "border-[#00000017]"
              }`}
            />
            <p className="mt-2 text-xs italic text-red-500">{errorEmail}</p>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-base capitalize text-white"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter Password"
              className={`w-full rounded-[9px]  border-[1px]  bg-white/10 p-3 text-[#999] outline-none placeholder:text-[15px] placeholder:capitalize placeholder:text-[#999999] placeholder:opacity-60  ${
                errorPassword ? "border-red-500" : "border-[#00000017]"
              } `}
            />
            <p className="mt-2 text-xs italic text-red-500">{errorPassword}</p>
          </div>
          <p className="text-sm capitalize text-white">
            By Logging In, you'll be agreeing to our{" "}
            <span className="text-primaryGreen underline">
              terms & conditions
            </span>{" "}
            and <span className="text-primaryGreen">privacy policy</span>
          </p>
          <button
            onClick={handleSubmit}
            className={`flex w-full items-center justify-center rounded-[9px] border border-primaryGreen bg-primaryGreen py-4 text-[15px] font-medium capitalize text-white transition-opacity duration-300 ${
              isLoading ? "opacity-50" : "opacity-100"
            }`}
            disabled={isLoading}
          >
            {/* {isLoading && (
              <svg
                class="mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )} */}
            {isLoading ? "processing..." : "Log In Now"}
          </button>
          {/* Separator between social media sign in and email/password sign in */}

          <div className="flex items-center justify-center before:mt-0.5 before:w-10 before:border-t before:border-white/10 after:mt-0.5 after:w-10 after:border-t after:border-white/10">
            <p className="mx-1 text-center text-sm capitalize text-white/40">
              or continue with
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => signIn("google")}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-[1px] border-white/10 bg-transparent  py-3 text-[15px] font-medium capitalize text-white transition-colors duration-300 hover:bg-primaryGreen"
            >
              <Image
                src={"/assets/google.png"}
                width={21}
                height={21}
                alt="Google"
                className=""
              />
              Google
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border-[1px] border-white/10 bg-transparent py-3 text-[15px] font-medium capitalize text-white transition-colors duration-300 hover:bg-primaryGreen">
              <Image
                src={"/assets/facebook.png"}
                width={21}
                height={21}
                alt="Facebook"
                className=""
              />
              Facebook
            </button>
          </div>
          <p className="text-center text-sm capitalize text-white/60">
            Don't have an account?{" "}
            <Link
              href={"/register"}
              className="font-medium capitalize text-white underline"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
