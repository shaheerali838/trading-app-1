import React from "react";

const Home = () => {
  return (
    <div className="min-h-[95vh]">
      <div className="heroSection bg-[#121212] flex flex-col justify-center items-center ">
        <div className="wrapper flex justify-center items-center">
          <div className="first">
            <h1 className="text-7xl font-bold">The Most Trusted Website</h1>
            <p className="text-5xl text-[#faf6a5]">
              Trade safely, quickly and easily
            </p>
            <div className="button mt-16 w-fit px-4 py-3 text-2xl rounded-full bg-cyan-600 text-black font-medium cursor-pointer">
              <button>Login/Register</button>
            </div>
          </div>
          <div className="second">
            <div className="heroImage w-[25vw]">
              <img src="https://imgproxy.attic.sh/unsafe/rs:fit:768:768:1:1/t:1:FF00FF:false:false/pngo:false:true:256/aHR0cHM6Ly9hdHRp/Yy5zaC9qNnB1ejZk/Zndrb3Rubm90eHlp/c28xbW1qMWtw.png" />
            </div>
          </div>
        </div>
        <div className="overView mt-14 w-full flex justify-evenly items-center">
          <div className="first">
            <p className="count text-4xl">73,576,384 $</p>
            <p className="text-gray-500 text-xl">24-hour trading volume</p>
          </div>
          <div className="second">
            <p className="count text-4xl">30+</p>
            <p className="text-gray-500 text-xl">
              Integrated Liquidity Provider
            </p>
          </div>
          <div className="third">
            <p className="count text-4xl">20,000,000+</p>
            <p className="text-gray-500 text-xl">Users</p>
          </div>
        </div>
      </div>
      <div className="Announcements">
        {/* add notifications */}
      </div>
      <div className="Guide">
        {/* add Carousel */}
      </div>
      <div className="faqs">
        {/* add accordians for faqs */}
      </div>
    </div>
  );
};

export default Home;
