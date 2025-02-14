import React, { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import AnimatedHeading from "../../components/animation/AnimateHeading";

const Faqs = () => {
  const [open, setOpen] = useState(0);
  const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  const faqs = [
    {
      id: 1,
      question: "What is this platform?",
      answer:
        "Our platform is a crypto trading exchange where users can buy, sell, deposit, withdraw, and manage their crypto assets in a secure environment.This website is designed to provide information and resources for individuals interested in learning about the history and culture of the African diaspora in the United States.",
    },
    {
      id: 2,
      question: "Is this platform safe?",
      answer:
        "Yes! We use secure authentication, encrypted data, and admin controls to ensure the safety of user funds and transactions.",
    },
    {
      id: 3,
      question: "How do I create an account?",
      answer:
        "Click on Register, provide your email, set a password, and verify your email to start trading.",
    },
    {
      id: 4,
      question: "What is the difference between Market and Limit orders?",
      answer:
        "Market Orders → Buy/Sell instantly at the current market price.\nLimit Orders → Buy/Sell at a specific price set by you.",
    },
    {
      id: 5,
      question: "How do I place an order?",
      answer:
        "Select the crypto pair, choose the order type (market/limit), enter the amount, and confirm your order.",
    },
  ];

  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  return (
    <section className="faqs min-h-screen px-8 bg-gradient-reverse w-full text-white flex flex-col justify-center text-start">
      <AnimatedHeading>
        <h2 className="text-4xl font-bold mb-24 text-white text-center">
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
              className={` bg-tertiary2 ${
                faqs.length === faq.id
                  ? "rounded-b-lg"
                  : faq.id === 1
                  ? "rounded-t-lg"
                  : ""
              }  px-4`}
            >
              {faq.question}
            </AccordionHeader>
            <AccordionBody className="bg-tertiary2 text-tertiary3 px-4 text-2xl">
              {faq.answer}
            </AccordionBody>
          </Accordion>
        ))}
      </div>
    </section>
  );
};

export default Faqs;
