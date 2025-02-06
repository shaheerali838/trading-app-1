import React, { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import AnimatedHeading from "./AnimateHeading";

const Faqs = () => {
  const [open, setOpen] = useState(0);
  const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  return (
    <section className="faqs min-h-screen bg-gradient-reverse w-full text-white flex flex-col justify-center text-start">
      <AnimatedHeading>
        <h2 className="text-4xl font-bold mb-24 text-white text-center">
          Frequently Asked Questions
        </h2>
      </AnimatedHeading>
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
  );
};

export default Faqs;
