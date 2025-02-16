import React from "react";
import ImgSrc from "../../assets/whyChooseUs.png";
import AnimatedHeading from "../../components/animation/AnimateHeading";

const WhyChoosUs = () => {
  return (
    <section className=" whyChooseUs min-h-screen flex flex-col justify-center items-center bg-gradient">
      <AnimatedHeading>
        <h2 className="text-4xl font-bold text-white mb-10">Why Choose Us?</h2>
      </AnimatedHeading>

      <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="text-center w-[70vw] md:text-left md:w-[25vw] md:mr-8 mb-4 md:mb-0">
          <div className="flex justify-center items-center mb-4"></div>
          <h3 className="mt-4 font-semibold text-primary">Secure Trading</h3>
          <p className="mt-2 text-[#F5F5F5]">
            Our platform offers the most secure trading environment with
            bank-level encryption and cold wallets.
          </p>
        </div>
        <div className=" image mx-4 animate-up-down">
          <img src={ImgSrc} alt="Why Choose Us" />
        </div>
        <div className="w-[70vw] text-center md:text-right md:w-[25vw] md:ml-8 mt-4 md:mt-0">
          <h3 className="mt-4  font-semibold text-primary">
            Fast Transactions
          </h3>
          <p className="  text-[#F5F5F5]">
            Experience fast transactions with instant deposits and withdrawals,
            ensuring zero downtime.
          </p>
        </div>
      </div>
      <div className="w-[70vw] mt-8 md:w-[25vw] text-center">
        <h3 className="mt-4  font-semibold text-primary">
          Live Market Insights
        </h3>
        <p className=" text-[#F5F5F5]">
          Stay ahead with real-time price tracking and analytics, providing you
          with the latest market insights.
        </p>
      </div>
    </section>
  );
};

export default WhyChoosUs;
