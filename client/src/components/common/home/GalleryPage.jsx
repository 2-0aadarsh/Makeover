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
    <section
      id="gallery"
      className="w-full py-4 sm:py-6 md:py-8 lg:py-[60px] px-4 sm:px-8 md:px-12 lg:px-20"
    >
      <div className="flex flex-col gap-8 sm:gap-12 lg:gap-20 items-start">
        {/* First Container: Heading Section */}
        <div className="w-full flex flex-col items-start justify-between gap-3">
          <SectionTitle title="Wemakeover Gallery" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-tight sm:leading-relaxed lg:leading-[62.4px] text-[#212121] font-sans font-normal">
            We have created amazing stories for our customers!
          </h2>
          <p className="text-sm sm:text-base lg:text-[18px] text-[#6E6E6E] font-normal leading-relaxed lg:leading-7 font-sans">
            100% Satisfaction Rate. We always want you to look fabulous and
            thrive to be the best.
          </p>
        </div>

        {/* Second Container: Split Section - Responsive Layout */}
        <div className="w-full min-h-[400px] sm:min-h-[500px] lg:h-[847px] flex flex-col lg:flex-row gap-6 lg:gap-6">
          {/* Left Section - Mobile: Full width, Desktop: 1/3 */}
          <div className="flex flex-col items-center justify-between w-full lg:w-1/3 gap-8 sm:gap-12 lg:gap-20">
            {/* Navigation Tabs - Responsive */}
            <div className="flex flex-row lg:flex-col gap-2 sm:gap-4 items-center justify-between lg:items-start w-full lg:justify-start">
              {tabData.map((tab, index) => (
                <div
                  key={index}
                  className={`text-sm sm:text-lg md:text-xl lg:text-[28px] leading-tight sm:leading-relaxed lg:leading-[48px] font-normal py-2 cursor-pointer transition-all duration-300 ${
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

            {/* Content and Button - Responsive - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex flex-col justify-between gap-16">
              <div className="font-normal font-sans text-[18px] leading-[36px]">
                <p>
                  Transform your look and boost your confidence with our premium
                  at home. Wemakeover and makeup services. Whether it&#39;s a
                  glam evening look, bridal makeup, or a flawless everyday glow
                  , our professional artists bring the salon experience to your
                  doorstep, using top-quality products and personalized
                  technique. Ready to feel your best without stepping out? Tap
                  the button above to enquire now.
                  <span className="font-semibold ml-1">
                    Your perfect Wemakeover is just a click away!
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

          {/* Right Section: Animated Image - Mobile: Full width, Desktop: 2/3 */}
          <div className="w-full lg:w-2/3 bg-[#F7EBEE] p-4 sm:p-8 md:p-16 lg:p-28 flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:h-auto">
            <div className="w-full h-full relative overflow-hidden shadow-lg">
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

        {/* Mobile/Tablet: Content and Button Section - Shows below image on small screens */}
        <div className="flex lg:hidden flex-col gap-8 sm:gap-12">
          <div className="font-normal font-sans text-sm sm:text-base leading-relaxed">
            <p>
              Transform your look and boost your confidence with our premium
              at-home Wemakeover and makeup services. Whether it&#39;s a glam
              evening look, bridal makeup, or a flawless everyday glow, our
              professional artists bring the salon experience to your doorstep,
              using top-quality products and personalized technique. Ready to
              feel your best without stepping out? Tap the button above to
              enquire now.
              <span className="font-semibold ml-1">
                Your perfect Wemakeover is just a click away!
              </span>
            </p>
          </div>

          <Button
            css="font-semibold text-xs sm:text-sm w-full sm:w-[85%]"
            content="Get In Touch For Personal Assistance"
            icon={<FaArrowRightLong />}
            scrollTo="contact-us"
          />
        </div>
      </div>
    </section>
  );
};

export default GalleryPage;
