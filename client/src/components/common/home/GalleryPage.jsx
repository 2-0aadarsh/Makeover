import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import GImage1 from "../../../assets/Gallery/GImage1.svg";
import GImage2 from "../../../assets/Gallery/bridal.svg";
import GImage3 from "../../../assets/Gallery/Mehendi.svg";
import SectionTitle from "../../ui/SectionTitle";
import Button from "../../ui/Button";
import { FaArrowRightLong } from "react-icons/fa6";
import { fetchPublicSiteSettings } from "../../../features/admin/siteSettings/siteSettingsThunks";

const defaultTabData = [
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
  const dispatch = useDispatch();
  const { publicSettings } = useSelector((state) => state.adminSiteSettings);
  
  const [activeIndex, setActiveIndex] = useState(0);
  // Start empty so we never show inactive/default tabs before API returns; only show API slides
  const [tabData, setTabData] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch site settings for gallery slides on mount and when page becomes visible
  useEffect(() => {
    dispatch(fetchPublicSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        dispatch(fetchPublicSiteSettings());
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [dispatch]);

  // Update gallery slides when settings are loaded (dynamic: any number including 0)
  useEffect(() => {
    if (publicSettings?.gallery) {
      setHasLoaded(true);
      const slides = publicSettings.gallery.slides || [];
      setTabData(slides.map((slide, index) => ({
        title: slide.title,
        image: slide.imageUrl || defaultTabData[index]?.image || GImage1,
        description: slide.description || defaultTabData[index]?.description || '',
      })));
      setActiveIndex(0);
    }
  }, [publicSettings]);

  // Auto-rotate only when we have more than one slide
  useEffect(() => {
    if (tabData.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % tabData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tabData.length]);

  return (
    <section
      id="gallery"
      className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 md:px-10 lg:px-20 flex flex-col gap-8 sm:gap-12 lg:gap-16"
    >
      {/* First Container: Section Title */}
      <SectionTitle title="Stories that inspire us" />

      {/* Loading State */}
      {!hasLoaded ? (
        <div className="w-full flex flex-col items-center justify-center py-16 px-6 bg-[#F7EBEE] rounded-xl border border-gray-200 min-h-[400px]">
          <div className="animate-pulse w-full max-w-[300px] h-[400px] bg-gray-200 rounded-lg" />
          <p className="text-gray-500 text-sm mt-4">Loading gallery...</p>
        </div>
      ) : hasLoaded && tabData.length === 0 ? (
        /* Empty State */
        <div className="w-full flex flex-col items-center justify-center py-16 px-6 bg-[#F7EBEE] rounded-xl border border-gray-200">
          <p className="text-gray-600 text-center text-lg font-medium">No gallery images at the moment.</p>
          <p className="text-gray-500 text-sm mt-2 text-center max-w-md">
            Check back soon for our latest work and stories.
          </p>
        </div>
      ) : (
        /* Gallery Content */
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

            {/* Content and Button - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex flex-col justify-between gap-16">
              <div className="font-normal font-sans text-[18px] leading-[36px]">
                <p>
                  Transform your look and boost your confidence with our premium
                  at home. Wemakeover and makeup services. Whether it&#39;s a
                  glam evening look, bridal makeup, or a flawless everyday glow,
                  our professional artists bring the salon experience to your
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
          <div className="w-full lg:w-2/3 bg-[#F7EBEE] p-4 sm:p-6 md:p-8 lg:p-12 flex items-center justify-center">
            <div className="w-full max-w-[500px] lg:max-w-none h-full relative overflow-hidden shadow-lg">
              <AnimatePresence mode="wait">
                {tabData.length > 0 && tabData[activeIndex] && (
                  <motion.div
                    key={tabData[activeIndex].title}
                    className="w-full h-full flex items-center justify-center"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    {/* Consistent Portrait Image Container */}
                    <div className="w-full aspect-[3/4] max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] relative overflow-hidden">
                      <img
                        src={tabData[activeIndex].image}
                        alt={tabData[activeIndex].title}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          const defaultImage = defaultTabData[activeIndex]?.image || GImage1;
                          e.target.src = defaultImage;
                        }}
                        style={{ objectPosition: "center top" }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile CTA Button */}
          <div className="lg:hidden w-full flex justify-center">
            <Button
              css="font-semibold text-xs sm:text-sm w-full sm:w-[85%]"
              content="Get In Touch For Personal Assistance"
              icon={<FaArrowRightLong />}
              scrollTo="contact-us"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default GalleryPage;
