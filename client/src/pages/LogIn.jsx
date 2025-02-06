import React from "react";
import ImgSrc from "../assets/whyChooseUs.png";
import AnimatedHeading from "../components/AnimateHeading";

const LogIn = () => {
  return (
    <div className="min-h-screen bg-gradient flex flex-col justify-center items-center">
      <AnimatedHeading>
        <h1 className="text-4xl font-bold">Login</h1>
      </AnimatedHeading>
      <div className="flex justify-evenly">
        <form action="" className="w-[40vw] mt-20">
          <input
            type="text"
            placeholder="Enter Your Email"
            className="w-full bg-transparent focus:border-none rounded-md px-3 py-2 my-3 border-primary"
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            className="w-full bg-transparent active:border-none rounded-md px-3 py-2 my-3 border-primary"
          />
          <p className="px-2 py-1 bg-secondary rounded-md text-tertiary2 font-medium hover:scale- cursor-pointer text-center">
            Login
          </p>
          <p className="px-2 py-1 my-4 bg-primary rounded-md text-tertiary3  font-medium hover:scale- cursor-pointer text-center">
            Continue With Google
          </p>

          <p className="w-full text-center text-gray-500">
            Don't Have an account?{" "}
            <a href="" className="text-white">
              Sign Up
            </a>
          </p>
        </form>
        <div className="img w-[40vw]">
          <img src={ImgSrc} alt="" />
        </div>
      </div>
    </div>
  );
};

export default LogIn;
