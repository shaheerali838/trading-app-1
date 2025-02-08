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
      question: "What is the purpose of this website?",
      answer:
        "This website is designed to provide information and resources for individuals interested in learning about the history and culture of the African diaspora in the United States.",
    },
    {
      id: 2,
      question: "Who is the target audience for this website?",
      answer:
        "This website is intended for individuals of all ages and backgrounds who are interested in learning about the African diaspora in the United States.",
    },
    {
      id: 3,
      question: "How can I contribute to this website?",
      answer:
        "You can contribute by submitting information, resources, or stories about the African diaspora in the United States. You can also help us improve the website by providing feedback or suggestions.",
    },
    {
      id: 4,
      question: "How can I contact the website administrators?",
      answer:
        "You can contact the website administrators by sending an email to info@africandiasporainamerica.com.",
    },
    {
      id: 5,
      question: "What is the African diaspora?",
      answer:
        "The African diaspora refers to the communities of people of African descent who have migrated from Africa to other parts of the world, including the United States.",
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
