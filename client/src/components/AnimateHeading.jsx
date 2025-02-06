import { motion } from "framer-motion";

const AnimatedHeading = ({ children }) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="text-3xl font-bold"
    >
      {children}
    </motion.h2>
  );
};

export default AnimatedHeading;
