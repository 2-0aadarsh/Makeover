import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GImage1 from "../../../assets/Gallery/GImage1.jpg";
import GImage2 from "../../../assets/Gallery/GImage2.jpg";
import GImage3 from "../../../assets/Gallery/GImage3.jpg";
import SectionTitle from "../../ui/SectionTitle";
import Button from "../../ui/Button";
import { FaArrowRightLong } from "react-icons/fa6";

const tabData = [
  {
    title: "Quick Grooming",
    image: GImage1,
    description: "Quick grooming to enhance your look in minutes.",
  },
  {
    title: "Bridal Makeup",
    image: GImage2,
    description: "Elegant bridal makeup for your special day.",
  },
  {
    title: "Mehendi Stories",
    image: GImage3,
    description: "Beautiful mehendi designs to complete your look.",
  },
];

const GalleryPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % tabData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-[60px] px-20">
      <div className="flex flex-col gap-20 items-start">
        {/* First Container: Heading Section */}
        <div className="w-full flex flex-col items-start justify-between gap-3">
          <SectionTitle title="Makeover Gallery" />
          <h2 className="text-[48px] leading-[62.4px] text-[#212121] font-sans font-normal">
            We have created amazing stories for our customers!
          </h2>
          <p className="text-[18px] text-[#6E6E6E] font-normal leading-7 font-sans">
            100% Satisfaction Rate. We always want you to look fabulous and
            thrive to be the best.
          </p>
        </div>

        {/* Second Container: Split Section */}
        <div className="w-full h-[847px] flex gap-6">
          {/* Left Section */}
          <div className="flex flex-col justify-between w-1/3 gap-20">
            <div className="flex flex-row md:flex-col gap-4 items-center md:items-start justify-around md:justify-start">
              {tabData.map((tab, index) => (
                <div
                  key={index}
                  className={`text-[28px] leading-[48px] font-normal py-2 cursor-pointer transition-all duration-300 ${
                    index === activeIndex
                      ? "text-[#CC2B52] border-b-2 border-[#CC2B52]"
                      : "text-[#E2B6C1]"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  {tab.title}
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-between gap-16">
              <div className="font-normal font-sans text-[18px] leading-[36px]">
                <p>
                  Transform your look and boost your confidence with our premium
                  at-home makeover and makeup services. Whether it&#39;s a glam
                  evening look, bridal makeup, or a flawless everyday glow – our
                  professional artists bring the salon experience to your
                  doorstep, using top-quality products and personalized
                  technique. Ready to feel your best without stepping out? Tap
                  the button above to enquire now.
                  <span className="font-semibold ml-1">
                    Your perfect makeover is just a click away!
                  </span>
                </p>
              </div>

              <Button
                css="font-semibold text-[14px] w-[85%]"
                content="Get In Touch For Personal Assistance"
                icon={<FaArrowRightLong />}
                scrollTo="contact-us"
              />
            </div>
          </div>

          {/* Right Section: Animated Image */}
          <div className="w-2/3 bg-[#F7EBEE] p-28 flex items-center justify-center">
            <div className="w-full h-full relative overflow-hidden  shadow-lg">
              <AnimatePresence mode="wait">
                <motion.img
                  key={tabData[activeIndex].title}
                  src={tabData[activeIndex].image}
                  alt={tabData[activeIndex].title}
                  className="w-full h-full object-cover object-center"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryPage;
