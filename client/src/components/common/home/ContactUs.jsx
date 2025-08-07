import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FormSection from "../forms/FormSection";

const ContactUs = () => {
  const inputData = [
    {
      id: "name",
      labelName: "Name",
      type: "text",
      placeholder: "Enter your name",
    },
    {
      id: "email",
      labelName: "Email",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      id: "phoneNumber",
      labelName: "Phone",
      type: "tel",
      placeholder: "Enter your phone number",
    },
    {
      id: "message",
      labelName: "Message",
      type: "textarea",
      placeholder: "Enter your message",
    },
  ];
  const words = ["Bridal", "Party", "Engagement"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 3500); // Rotate every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="contact-us flex justify-between items-start w-full min-h-[706px] py-[60px] px-20">
      <div className="message font-normal text-[54px] leading-[72px] text-[#212121] w-[728px]">
        <h3 className="text-[#CC2B52] text-xl mb-4">Connect</h3>
        
        <h4 className="flex items-start min-h-[80px]">
          Your
          <span className="text-[#CC2B52] ml-2 relative block h-[72px]  ">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentIndex}
                initial={{ y: 72, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -72, opacity: 0 }}
                transition={{
                  duration: 2,
                  ease: [0.16, 1, 0.3, 1], // Custom easing for smooth bounce
                }}
                className="absolute top-0 left-0 w-full"
              >
                {words[currentIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h4>

        <h4>makeover is just a message away</h4>
      </div>

      <div className="form-container w-[522px] p-8 shadow-xl rounded-lg bg-white transition-all duration-300 hover:shadow-2xl">
        <FormSection
          inputData={inputData}
          buttonText="Contact Us"
          inputcss="px-4 py-3 rounded-[6px] transition-all focus:ring-2 focus:ring-[#CC2B52]/50"
          labelcss="text-[#3B486E] text-[16px]"
          buttoncss="mt-6 hover:bg-[#CC2B52]/90 transition-colors"
        />
      </div>
    </div>
  );
};

export default ContactUs;