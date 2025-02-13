import { ImSpinner2 } from "react-icons/im";
import React from "react";

const Loader = () => {
  return (
    <>
      <div className="min-w-screen min-h-screen opacity-0.5 top-0 relative flex items-center justify-center">
      <ImSpinner2 className="text-5xl animate-spin text-primary" />
      </div>
    </>
  );
};

export default Loader;
