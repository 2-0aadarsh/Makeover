
import { useState, useEffect } from "react";
import GImage1 from "../../../assets/Gallery/GImage1.jpg";
import GImage2 from "../../../assets/Gallery/GImage2.jpg";
import GImage3 from "../../../assets/Gallery/GImage3.jpg";

const tabData = [
  {
    title: "Quick Grooming",
    image: GImage1,
    description: "Quick grooming to enhance your look in minutes."
  },
  {
    title: "Bridal Makeup",
    image: GImage2,
    description: "Elegant bridal makeup for your special day."
  },
  {
    title: "Mehendi Stories",
    image: GImage3,
    description: "Beautiful mehendi designs to complete your look."
  }
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
    <div className="flex flex-col items-center min-h-screen pt-24 p-4 md:p-8 overflow-x-auto">
      {/* First Container: Heading Section */}
      <div className="w-full text-center">
        <h2 className="text-2xl font-bold mb-4">
          We have created amazing stories for our customers!
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          100% Satisfaction Rate. We always want you to look fabulous and thrive to be the best.
        </p>
      </div>

      {/* Second Container: Split Section */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6 overflow-x-auto">
        {/* Left Section: Tabs, Paragraph, and Button */}
        <div className="flex flex-col w-full md:w-2/3 gap-6">
          <div className="flex flex-row md:flex-col gap-4 items-center md:items-start justify-around md:justify-start">
            {tabData.map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${index === activeIndex ? 'text-pink-500 border-b-2 md:border-l-2 border-pink-500' : 'text-gray-400'}`}
                onClick={() => setActiveIndex(index)}
              >
                {tab.title}
              </button>
            ))}
          </div>
          <div className="pt-6 lg:pt-60 text-lg text-textBlack300 font-medium ">
            <p>
              Transform your look and boost your confidence with our premium at-home makeover and makeup services. Whether it's a glam evening look, bridal makeup, or a flawless everyday glow – our professional artists bring the salon experience to your doorstep, using top-quality products and personalized technique. Ready to feel your best without stepping out? Tap the button above to enquire now.
            </p>
            <h3 className="font-bold mt-4">Your perfect makeover is just a click away!</h3>
          </div>
          <div className="w-full px-4 mb-4">
            <button className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-all duration-200">
              Get In Touch For Personal Assistance
            </button>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="w-full md:w-1/3 bg-pink-100 flex items-center justify-center rounded-lg overflow-hidden relative h-[380px] lg:h-[800px] py-20 lg:bg-[#F7EBEE]">
         <img 
              src={tabData[activeIndex].image} 
              alt={tabData[activeIndex].title} 
              className="object-cover w-full h-full lg:w-[640px] lg:h-[640px] my-[80px] absolute" 
         />
        </div>

      </div>
    </div>
  );
};

export default GalleryPage;
