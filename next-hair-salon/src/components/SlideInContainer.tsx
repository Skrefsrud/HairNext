"use client";
import { motion } from "framer-motion";

const SlideInContainer = ({ children, direction = "top" }) => {
  const initialY = direction === "top" ? -100 : 100; // Offscreen distance

  const variants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: initialY, opacity: 0 },
  };

  return (
    <motion.div
      variants={variants}
      initial='hidden'
      animate='visible'
      transition={{ duration: 0.4, ease: [0.6, 0.05, 0.2, 0.95] }}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </motion.div>
  );
};

export default SlideInContainer;
