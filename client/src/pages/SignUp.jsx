import React from "react";
import ImgSrc from "../assets/whyChooseUs.png";
import AnimatedHeading from "../components/AnimateHeading";

const LogIn = () => {
  return (
    <div className="min-h-screen bg-gradient flex flex-col justify-center items-center">
      <AnimatedHeading>
        <h1 className="text-4xl font-bold">SignUp</h1>
      </AnimatedHeading>
      <div className="flex flex-col md:flex-row justify-evenly">
        <div className="hidden md:block  img w-[40vw] ">
          <img src={ImgSrc} alt="" />
        </div>
        <form action="" className="w-[40vw] mt-20">
          <input
            type="text"
            placeholder="Enter Your First Name"
            className="w-full bg-transparent focus:border-none rounded-md px-3 py-2 my-3 border-primary"
          />
          <input
            type="text"
            placeholder="Enter Your Last Name"
            className="w-full bg-transparent focus:border-none rounded-md px-3 py-2 my-3 border-primary"
          />
          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full bg-transparent focus:border-none rounded-md px-3 py-2 my-3 border-primary"
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            className="w-full bg-transparent active:border-none rounded-md px-3 py-2 my-3 border-primary"
          />
          <p className="px-2 py-1 bg-secondary rounded-md text-tertiary2 font-medium hover:scale- cursor-pointer text-center">
            Register
          </p>
          <p className="px-2 py-1 my-4 bg-primary rounded-md text-tertiary3  font-medium hover:scale- cursor-pointer text-center">
            Continue With Google
          </p>

          <p className="w-full text-center text-gray-500">
            Already Have an account?{" "}
            <a href="" className="text-white">
              LogIn
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
