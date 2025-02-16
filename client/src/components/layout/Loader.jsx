import { ImSpinner2 } from "react-icons/im";
import React from "react";

const Loader = () => {
  return (
    <>
      {/* position absolute kr k full screen pr phela do or bg opacity bohot km ker do. or loader internet se utha lo. */}
      <div className="min-w-screen min-h-screen opacity-0.5 top-0 relative flex items-center justify-center">
      <ImSpinner2 className="text-5xl text-white animate-spin text-primary" />
      </div>
    </>
  );
};

export default Loader;
