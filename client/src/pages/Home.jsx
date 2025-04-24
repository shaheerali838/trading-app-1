import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Hero from "../components/home/Hero.jsx";
import CryptoCarousel from "../components/home/CryptoCarousel.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import WhyChoosUs from "../components/home/WhyChoosUs.jsx";
import Faqs from "../components/home/Faqs.jsx";
import Slider from "../components/home/Slider.jsx";
import AnimatedSection from "../components/animation/AnimateSection.jsx";
import NewsSection from "../components/home/NewsSection.jsx";

const Home = (props) => {
  // Initialize translation for child components to access
  useTranslation();

  return (
    <>
      <div className="home">
        <AnimatedSection>
          <Hero mode={props.mode} />
          <NewsSection />
          <CryptoCarousel mode={props.mode}/>
          <Testimonials />
          <WhyChoosUs mode={props.mode}/>
          <Faqs mode={props.mode}/>
          <Slider />
        </AnimatedSection>
      </div>
    </>
  );
};
Home.propTypes = {
  mode: PropTypes.string.isRequired,
};
export default Home;
