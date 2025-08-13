
/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedText = ({
  words,
  interval = 3500,
  animationDuration = 0.8,
  textStyle = "",
  highlightColor = "#CC2B52",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className={`relative block h-[1em] overflow-y-hidden ${textStyle}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{
            duration: animationDuration,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`absolute top-0 left-0 w-full ${
            highlightColor ? `text-[${highlightColor}]` : ""
          }`}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default AnimatedText;