import React from "react";
import CountUp from "react-countup";
import HeroImgSrc from "../../assets/hero.png";

const Hero = () => {
  const counts = [
    {
      index: 1,
      end: 73576384,
      symbol: "$",
      text: "24-hour trading volume",
    },
    {
      index: 2,
      end: 30,
      symbol: "+",
      text: "Integrated Trade",
    },
    {
      index: 3,
      end: 20000000,
      symbol: "+",
      text: "Users",
    },
  ];
  return (
    <section className="heroSection min-h-[98vh] bg-gradient flex flex-col justify-center items-center">
      <div className="wrapper flex flex-col md:flex-row justify-center items-center">
        <div className="first text-center md:text-left md:mr-8">
          <div className="heading flex flex-col items-end">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              The Most Trusted Website
            </h1>
            <p className="text-4xl md:text-5xl text-primary mt-4">
              Trade safely, quickly and easily
            </p>
          </div>
        </div>
        <div className="second mt-8 md:mt-0">
          <div className="heroImage w-[50vw] md:w-[25vw] rotate-[-27deg] animate-up-down">
            <img src={HeroImgSrc} alt="Hero" />
          </div>
        </div>
      </div>
      <div className="overView mt-14 w-full flex flex-col md:flex-row justify-evenly items-center text-center md:text-left">
        {counts.map((count) => (
          <div className="first mb-8 md:mb-0" key={count.index}>
            <p className="count text-2xl text-primary">
              <CountUp end={count.end} duration={2} /> {count.symbol}
            </p>
            <p className="text-tertiary3">{count.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
