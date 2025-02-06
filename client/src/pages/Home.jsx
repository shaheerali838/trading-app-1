import React, { useState } from "react";
import Hero from "../components/Hero.jsx";
import CryptoCarousel from "../components/CryptoCarousel.jsx";
import Testimonials from "../components/Testimonials.jsx";
import WhyChoosUs from "../components/WhyChoosUs.jsx";
import Faqs from "../components/Faqs.jsx";
import Slider from "../components/Slider.jsx";

const Home = () => {
  return (
    <>
      <div className="home">
        <Hero />
        <CryptoCarousel />
        <Testimonials />
        <WhyChoosUs />
        <Faqs />
        <Slider />
      </div>
    </>
  );
};

export default Home;
