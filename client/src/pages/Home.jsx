import React, { useState } from "react";
import CountUp from "react-countup";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCoverflow,
} from "swiper/modules";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

const Home = () => {
  const [open, setOpen] = useState(0);
  const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  return (
    <div className="min-h-[95vh]">
      <section className="heroSection bg-gradient to flex flex-col justify-center items-center py-16">
        <div className="wrapper flex flex-col md:flex-row justify-center items-center">
          <div className="first text-center md:text-left md:mr-8">
            <div className="heading flex flex-col items-end">
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                The Most Trusted Website
              </h1>
              <p className="text-3xl md:text-5xl text-primary mt-4">
                Trade safely, quickly and easily
              </p>
            </div>
            <div className="button mt-8 md:mt-16 w-fit px-4 py-3 text-2xl rounded-full bg-[#007BFF] text-white font-medium cursor-pointer">
              <button>Login/Register</button>
            </div>
          </div>
          <div className="second mt-8 md:mt-0">
            <div className="heroImage w-[50vw] md:w-[25vw] rotate-[-27deg] animate-up-down">
              <img src="hero.png" alt="Hero" />
            </div>
          </div>
        </div>
        <div className="overView mt-14 w-full flex flex-col md:flex-row justify-evenly items-center text-center md:text-left">
          <div className="first mb-8 md:mb-0">
            <p className="count text-4xl text-primary">
              <CountUp end={73576384} duration={2} separator="," /> $
            </p>
            <p className="text-tertiary3 text-xl">24-hour trading volume</p>
          </div>
          <div className="second mb-8 md:mb-0">
            <p className="count text-4xl text-primary">
              <CountUp end={30} duration={2} />+
            </p>
            <p className="text-tertiary3 text-xl">
              Integrated Liquidity Provider
            </p>
          </div>
          <div className="third">
            <p className="count text-4xl text-primary">
              <CountUp end={20000000} duration={2} separator="," />+
            </p>
            <p className="text-tertiary3 text-xl">Users</p>
          </div>
        </div>
      </section>

      <section className="cryptoCarousel pt-12 py-16 bg-gradient text-white text-center">
        <h2 className="text-3xl font-bold mb-8 text-primary">
          Crypto Trading Pairs
        </h2>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
              <img
                src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
                alt="BTC"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-primary">BTC/USDT</h3>
              <p className="mt-2 text-[#00FF7F]">+2.5%</p>
              <p className="mt-2 text-[#F5F5F5]">24h Volume: $50M</p>
              <div className="mt-4">
                <button className="px-4 py-2 bg-[#1E90FF] text-white rounded-full hover:bg-[#00FF7F] transition-colors duration-300">
                  Trade Now
                </button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
              <img
                src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                alt="ETH"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-primary">ETH/USDT</h3>
              <p className="mt-2 text-[#D32F2F]">-1.2%</p>
              <p className="mt-2 text-[#F5F5F5]">24h Volume: $30M</p>
              <div className="mt-4">
                <button className="px-4 py-2 bg-[#1E90FF] text-white rounded-full hover:bg-[#00FF7F] transition-colors duration-300">
                  Trade Now
                </button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
              <img
                src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png"
                alt="BNB"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-primary">BNB/USDT</h3>
              <p className="mt-2 text-[#00FF7F]">+3.8%</p>
              <p className="mt-2 text-[#F5F5F5]">24h Volume: $20M</p>
              <div className="mt-4">
                <button className="px-4 py-2 bg-[#1E90FF] text-white rounded-full hover:bg-[#00FF7F] transition-colors duration-300">
                  Trade Now
                </button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
              <img
                src="https://cryptologos.cc/logos/cardano-ada-logo.png"
                alt="ADA"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-primary">ADA/USDT</h3>
              <p className="mt-2 text-[#D32F2F]">-0.5%</p>
              <p className="mt-2 text-[#F5F5F5]">24h Volume: $10M</p>
              <div className="mt-4">
                <button className="px-4 py-2 bg-[#1E90FF] text-white rounded-full hover:bg-[#00FF7F] transition-colors duration-300">
                  Trade Now
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <section className="testimonials py-16 bg-gradient-reverse text-white text-center">
        <h2 className="text-3xl font-bold mb-8 text-[#1E90FF]">Testimonials</h2>
        <Swiper
          effect={"coverflow"}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: true,
          }}
          modules={[EffectCoverflow, Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="max-w-[50vw] p-6 bg-[#2A2A2A] rounded-lg shadow-md">
              <img src="/images/slide1.jpg" alt="Slide 1" className="w-full h-auto rounded-lg" />
              <div className="mt-4">
                <button className="px-4 py-2 bg-[#1E90FF] text-white rounded-full hover:bg-[#00FF7F] transition-colors duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
              <img src="/images/slide2.jpg" alt="Slide 2" className="w-full h-auto rounded-lg" />
              <div className="mt-4">
                <button className="px-4 py-2 bg-[#1E90FF] text-white rounded-full hover:bg-[#00FF7F] transition-colors duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
              <img src="/images/slide3.jpg" alt="Slide 3" className="w-full h-auto rounded-lg" />
              <div className="mt-4">
                <button className="px-4 py-2 bg-[#1E90FF] text-white rounded-full hover:bg-[#00FF7F] transition-colors duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
              <img src="/images/slide4.jpg" alt="Slide 4" className="w-full h-auto rounded-lg" />
              <div className="mt-4">
                <button className="px-4 py-2 bg-[#1E90FF] text-white rounded-full hover:bg-[#00FF7F] transition-colors duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
      <section className=" whyChooseUs flex flex-col justify-center items-center bg-gradient-reverse py-28">
        <h2 className="text-3xl font-bold text-primary">Why Choose Us?</h2>

        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="text-left w-[25vw] md:mr-8 mb-4 md:mb-0">
            <div className="flex justify-center items-center mb-4"></div>
            <h3 className="mt-4 text-xl font-semibold text-primary">
              Secure Trading
            </h3>
            <p className="mt-2 text-[#F5F5F5]">
              Our platform offers the most secure trading environment with
              bank-level encryption and cold wallets.
            </p>
          </div>
          <div className="image mx-4 animate-up-down">
            <img src="/whyChooseUs.png" alt="Why Choose Us" />
          </div>
          <div className="text-right w-[25vw] md:ml-8 mt-4 md:mt-0">
            <h3 className="mt-4 text-xl font-semibold text-primary">
              Fast Transactions
            </h3>
            <p className="text-xl text-[#F5F5F5]">
              Experience fast transactions with instant deposits and
              withdrawals, ensuring zero downtime.
            </p>
          </div>
        </div>
        <div className="mt-8 w-[25vw] text-center">
          <h3 className="mt-4 text-xl font-semibold text-primary">
            Live Market Insights
          </h3>
          <p className="text-xl text-[#F5F5F5]">
            Stay ahead with real-time price tracking and analytics, providing
            you with the latest market insights.
          </p>
        </div>
      </section>

      <section className="faqs bg-gradient w-full pt-12 py-16 bg-[#1A1A1A] text-white text-start">
        <h2 className="text-3xl font-bold mb-8 text-[#1E90FF] text-center">
          Frequently Asked Questions
        </h2>
        <div className="container mx-auto px-4">
          <Accordion open={open === 1} animate={CUSTOM_ANIMATION}>
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="bg-tertiary2 rounded-t-lg px-4 hover:bg-[#1E90FF] hover:text-white transition-colors duration-300"
            >
              What is Material Tailwind?
            </AccordionHeader>
            <AccordionBody className="bg-tertiary2 text-tertiary3 px-4 text-2xl">
              We&apos;re constantly growing. We&apos;re constantly making
              mistakes. We&apos;re constantly trying to express ourselves and
              actualize our dreams.
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 2} animate={CUSTOM_ANIMATION}>
            <AccordionHeader
              onClick={() => handleOpen(2)}
              className="bg-tertiary2 px-4 hover:bg-[#1E90FF] hover:text-white transition-colors duration-300"
            >
              How to use Material Tailwind?
            </AccordionHeader>
            <AccordionBody className="bg-tertiary2 text-tertiary3 px-4 text-2xl">
              We&apos;re not always in the position that we want to be at.
              We&apos;re constantly growing. We&apos;re constantly making
              mistakes. We&apos;re constantly trying to express ourselves and
              actualize our dreams.
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 3} animate={CUSTOM_ANIMATION}>
            <AccordionHeader
              onClick={() => handleOpen(3)}
              className="bg-tertiary2 px-4 hover:bg-[#1E90FF] hover:text-white transition-colors duration-300"
            >
              What can I do with Material Tailwind?
            </AccordionHeader>
            <AccordionBody className="bg-tertiary2 text-tertiary3 rounded-b-lg px-4 text-2xl">
              We&apos;re not always in the position that we want to be at.
              We&apos;re constantly growing. We&apos;re constantly making
              mistakes. We&apos;re constantly trying to express ourselves and
              actualize our dreams.
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 3} animate={CUSTOM_ANIMATION}>
            <AccordionHeader
              onClick={() => handleOpen(3)}
              className="bg-tertiary2 px-4 hover:bg-[#1E90FF] hover:text-white transition-colors duration-300"
            >
              What can I do with Material Tailwind?
            </AccordionHeader>
            <AccordionBody className="bg-tertiary2 text-tertiary3 rounded-b-lg px-4 text-2xl">
              We&apos;re not always in the position that we want to be at.
              We&apos;re constantly growing. We&apos;re constantly making
              mistakes. We&apos;re constantly trying to express ourselves and
              actualize our dreams.
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 3} animate={CUSTOM_ANIMATION}>
            <AccordionHeader
              onClick={() => handleOpen(3)}
              className="bg-tertiary2 px-4 hover:bg-[#1E90FF] hover:text-white transition-colors duration-300"
            >
              What can I do with Material Tailwind?
            </AccordionHeader>
            <AccordionBody className="bg-tertiary2 text-tertiary3 rounded-b-lg px-4 text-2xl">
              We&apos;re not always in the position that we want to be at.
              We&apos;re constantly growing. We&apos;re constantly making
              mistakes. We&apos;re constantly trying to express ourselves and
              actualize our dreams.
            </AccordionBody>
          </Accordion>
        </div>
      </section>
      <section className="bg-gradient-reverse ">
        <div className="heading flex justify-center">
          <h2 className="w-[60vw] text-center text-5xl py-20 font-bold">
            The Only Crypt Exchange To Buy , Sell, and Trade Cryptocurrency
          </h2>
        </div>
        <div className="overflow-hidden whitespace-nowrap h-20 bg-transparent text-secondary py-3 flex justify-center items-center text-3xl font-bold border-t-[.5px] border-[#EAEAEA]">
          <marquee behavior="scroll" direction="left">
            <span className="px-16">Bitcoin (BTC)</span>
            <span className="px-16">Ethereum (ETH)</span>
            <span className="px-16">Tether (USDT)</span>
            <span className="px-16">USD Coin (USDC)</span>
            <span>Binance Coin (BNB)</span>
            <span className="px-16">Ripple (XRP)</span>
            <span className="px-16">Cardano (ADA)</span>
            <span className="px-16">Binance USD (BUSD)</span>
          </marquee>
        </div>
      </section>
    </div>
  );
};

export default Home;
