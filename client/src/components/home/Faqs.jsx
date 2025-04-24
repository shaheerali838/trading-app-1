import React, { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import PropTypes from "prop-types";

const Faqs = (props) => {
  const [open, setOpen] = useState(0);
  const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  const faqs = [
    {
      id: 1,
      question: "What is crypto?",
      answer:
        "Cryptocurrency is a decentralized digital currency that operates on blockchain technology. Its key features include transparency, borderless transactions and immutability. Some of the most popular cryptocurrencies, by market capitalization , include Bitcoin, Ethereum, Tether, which can be traded on this platform.",
    },
    {
      id: 2,
      question: "  What is a cryptocurrency exchange?",
      answer:
        "Cryptocurrency exchanges are digital marketplaces that enable users to buy and sell cryptocurrencies like Bitcoin, Ethereum, and Tether. The Crypto Nexus exchange is the largest crypto exchange by trade volume.",
    },
    {
      id: 3,
      question:
        " How do I buy Bitcoin and other crypto currencies on this platform?",
      answer:
        "Easily buy Bitcoin or other crypto currencies within minutes with  USDT. Crypto Nexus supports payments through USDT Deposite . Want to buy, sell, or hold other coins that are gaining traction in the crypto ecosystem? Kickstart your journey with Crypto Nexus and explore prices and other information for cryptos such as Bitcoin (BTC), Ethereum (ETH) and more!",
    },
    {
      id: 4,
      question: "How to track cryptocurrency prices?",
      answer:
        "The easiest way to track the latest cryptocurrency prices, trading volumes, trending altcoins, and market cap is the Crypto Nexus Cryptocurrency Directory. Click on the coins to know historical coin prices, 24-hour trading volume, and the price of cryptocurrencies like Bitcoin, Ethereum, BNB and others in real-time.",
    },
    {
      id: 5,
      question: " How to trade cryptocurrencies on Crypto Nexus",
      answer:
        "You can trade hundreds of cryptocurrencies on Crypto Nexus via the Spot, Futures, and Options markets. To begin trading, users need to register an account, complete identity verification, buy/deposit crypto, and start trading.",
    },
  ];

  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  return (
    <section
      className={`faqs min-h-screen px-8 ${
        props.mode === "light-class" ? "bg-white" : "bg-gradient-reverse"
      } w-full text-white flex flex-col justify-center text-start`}
    >
      <AnimatedHeading>
        <h2
          className={`text-4xl font-bold mb-24 ${
            props.mode === "dark-class"
              ? "bg-transparent"
              : "bg-transparent text-black"
          } text-center`}
        >
          Frequently Asked Questions
        </h2>
      </AnimatedHeading>
      <div className="container mx-auto px-4">
        {faqs.map((faq) => (
          <Accordion
            open={open === faq.id}
            key={faq.id}
            animate={CUSTOM_ANIMATION}
          >
            <AccordionHeader
              onClick={() => handleOpen(faq.id)}
              className={` ${
                props.mode === "light-class" ? "light-class" : "bg-tertiary2"
              } ${
                faqs.length === faq.id
                  ? "rounded-b-lg"
                  : faq.id === 1
                  ? "rounded-t-lg"
                  : ""
              }  px-4`}
            >
              {faq.question}
            </AccordionHeader>
            <AccordionBody className={`${props.mode} px-4 text-2xl`}>
              {faq.answer}
            </AccordionBody>
          </Accordion>
        ))}
      </div>
    </section>
  );
};

Faqs.propTypes = {
  mode: PropTypes.string.isRequired,
};

export default Faqs;
