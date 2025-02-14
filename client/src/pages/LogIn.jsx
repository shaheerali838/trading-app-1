import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImgSrc from "../assets/whyChooseUs.png";
import AnimatedHeading from "../components/animation/AnimateHeading";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/userSlice";
import { toast } from "react-toastify";

const LogIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user && user.role === "user") {
      navigate(-1); // Redirect to te previous page
    } else if (user && user.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = dispatch(loginUser({ email, password }));
    
    if (res) {
      toast.success(res.msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient flex flex-col justify-center items-center">
      <AnimatedHeading>
        <h1 className="text-4xl font-bold">Login</h1>
      </AnimatedHeading>
      <div className="flex justify-evenly">
        <div className="w-[40vw] mt-20">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent focus:border-none rounded-md px-3 py-2 my-3 border-primary"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent active:border-none rounded-md px-3 py-2 my-3 border-primary"
            />
            <button
              type="submit"
              className="w-full px-2 py-1 bg-secondary rounded-md text-tertiary2 font-medium hover:scale- cursor-pointer text-center"
            >
              Login
            </button>
            <p className="w-full px-2 py-1 my-4 bg-primary rounded-md text-tertiary3  font-medium hover:scale- cursor-pointer text-center">
              Continue With Google
            </p>
          </form>
          <p className="w-full text-center text-gray-500">
            Don't Have an account?{" "}
            <a href="/signup" className="text-white">
              Sign Up
            </a>
          </p>
        </div>
        <div className="img w-[40vw]">
          <img src={ImgSrc} alt="" />
        </div>
      </div>
    </div>
  );
};

export default LogIn;
