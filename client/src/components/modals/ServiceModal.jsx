/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlexCardContainer from "../../components/ui/FlexCardContainer";
import GridCardContainer from "../ui/GridCardContainer";

const ServiceModal = ({ title, cards = [], gridCard = [], onClose }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const tabs = gridCard.map((item) => item?.title);
  const [currentTab, setCurrentTab] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const touchStateRef = useRef({
    startY: 0,
  });

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const modalVariants = {
    hidden: {
      y: "100%",
      scale: 0.9,
      opacity: 0,
    },
    visible: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4,
      },
    },
    exit: {
      y: "100%",
      scale: 0.9,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        duration: 0.3,
      },
    },
  };

  const desktopModalVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 400,
        duration: 0.4,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  useEffect(() => {
    // Save the current scroll position
    scrollPositionRef.current =
      window.pageYOffset ||
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    // Add styles to prevent background scrolling
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.width = "100%";

    // Add event listener for escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    // Focus the content area to enable mouse wheel scrolling
    if (contentRef.current) {
      contentRef.current.focus();
    }

    return () => {
      // Get the saved scroll position from ref
      const savedScroll = scrollPositionRef.current;

      // Remove fixed positioning first
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      // Restore scroll position with multiple techniques for reliability
      window.scrollTo(0, savedScroll);
      document.documentElement.scrollTop = savedScroll;
      document.body.scrollTop = savedScroll;

      // Double RAF for reliability
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, savedScroll);
          document.documentElement.scrollTop = savedScroll;
          document.body.scrollTop = savedScroll;
        });
      });

      // Fallback timeout
      setTimeout(() => {
        window.scrollTo(0, savedScroll);
        document.documentElement.scrollTop = savedScroll;
        document.body.scrollTop = savedScroll;
      }, 10);

      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Handle drag gestures for mobile
  const isInteractionInsideContent = (target) => {
    if (!contentRef.current) return false;
    return contentRef.current.contains(target);
  };

  const handleDragStart = (e) => {
    if (isInteractionInsideContent(e.target)) {
      return;
    }

    setIsDragging(true);
    dragStartY.current =
      e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;

    const currentY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    const dragDistance = currentY - dragStartY.current;

    // Only allow dragging down to close
    if (dragDistance > 0) {
      const modal = modalRef.current;
      if (modal) {
        modal.style.transform = `translateY(${dragDistance}px)`;
        modal.style.opacity = `${1 - dragDistance / 300}`;
      }
    }
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;

    setIsDragging(false);
    const currentY =
      e.type === "touchend" ? e.changedTouches[0].clientY : e.clientY;
    const dragDistance = currentY - dragStartY.current;

    if (dragDistance > 100) {
      onClose();
    } else {
      // Reset modal position
      const modal = modalRef.current;
      if (modal) {
        modal.style.transform = "translateY(0)";
        modal.style.opacity = "1";
      }
    }
  };

  const handleContentTouchStart = (e) => {
    e.stopPropagation();
    if (!contentRef.current) return;
    touchStateRef.current.startY = e.touches[0].clientY;
  };

  const handleContentTouchMove = (e) => {
    if (!contentRef.current) return;

    const content = contentRef.current;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStateRef.current.startY;
    const atTop = content.scrollTop <= 0;
    const atBottom =
      Math.ceil(content.scrollTop + content.clientHeight) >=
      content.scrollHeight;

    const pullingDown = deltaY > 0;
    const pullingUp = deltaY < 0;

    if ((pullingDown && atTop) || (pullingUp && atBottom)) {
      e.stopPropagation();
      e.preventDefault();
    } else {
      e.stopPropagation();
    }
  };

  // Enhanced wheel handling with momentum
  const handleWheel = (e) => {
    if (contentRef.current) {
      e.stopPropagation();

      const newScrollTop = contentRef.current.scrollTop + e.deltaY;
      const maxScroll =
        contentRef.current.scrollHeight - contentRef.current.clientHeight;

      if (newScrollTop >= 0 && newScrollTop <= maxScroll) {
        contentRef.current.scrollTop = newScrollTop;
        e.preventDefault();
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="modal-overlay"
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/30 backdrop-blur-sm"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className="relative w-full md:w-[1020px] h-[87vh] md:h-[620px] bg-[#FAF2F4] rounded-t-3xl md:rounded-2xl shadow-2xl py-4 sm:py-6 md:py-8 lg:py-[60px] pl-2 sm:pl-3 md:pl-4 lg:pl-6 pr-1 sm:pr-2 md:pr-2 lg:pr-2 flex flex-col mx-0 md:mx-2 lg:mx-4 overflow-hidden"
          variants={
            window.innerWidth < 768 ? modalVariants : desktopModalVariants
          }
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          onWheel={handleWheel}
          // Drag handlers for mobile
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {/* Enhanced Drag Handle Indicator - Mobile Only */}
          <div
            className="md:hidden absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-400/60 rounded-full cursor-grab active:cursor-grabbing"
            onTouchStart={handleDragStart}
            onMouseDown={handleDragStart}
          />

          {/* Header - Sticky with enhanced styling */}
          <div className="sticky w-full top-0 bg-[#FAF2F4] z-10 pb-2 sm:pb-3 lg:pb-0 mt-4 md:mt-0 border-b border-gray-200/50">
            {/* Title Row */}
            <div className="flex justify-between items-center w-full mb-3 sm:mb-4 lg:mb-6">
              <motion.h2
                className="text-[#CC2B52] text-xl sm:text-2xl md:text-3xl lg:text-[32px] leading-tight sm:leading-relaxed lg:leading-[52px] font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {title}
              </motion.h2>
              <motion.button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close modal"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                <span className="text-lg sm:text-xl lg:text-2xl font-semibold">
                  &times;
                </span>
              </motion.button>
            </div>

            {/* Enhanced Tabs Row */}
            {gridCard.length > 0 && (
              <motion.div
                className="tabs flex flex-row items-center justify-start gap-4 sm:gap-6 lg:gap-8 text-[#CC2B52] text-sm sm:text-base md:text-lg lg:text-[20px] leading-6 sm:leading-7 lg:leading-8 font-bold font-inter overflow-x-auto no-scrollbar pb-2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {tabs.map((item, index) => (
                  <motion.div
                    key={index}
                    onClick={() => setCurrentTab(index)}
                    className={`relative py-2 sm:py-3 transition-all duration-300 ease-out cursor-pointer flex-shrink-0
                              ${
                                currentTab === index
                                  ? "text-[#CC2B52] font-bold"
                                  : "text-gray-600 font-medium hover:text-[#CC2B52]"
                              }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <h3 className="whitespace-nowrap px-2">{item}</h3>
                    {currentTab === index && (
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-[#CC2B52]"
                        layoutId="activeTab"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Content Area - Scrollable with enhanced styling */}
          <motion.div
            ref={contentRef}
            tabIndex={0}
            className="flex-1 w-full overflow-y-auto mt-4 sm:mt-6 outline-none pb-4 pr-0 custom-scrollbar"
            style={{ 
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: "#9CA3AF #F7EBEE"
            }}
            onTouchStart={handleContentTouchStart}
            onTouchMove={handleContentTouchMove}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                {/* FlexCards Section */}
                {cards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FlexCardContainer cards={cards} />
                  </motion.div>
                )}

                {/* GridCards Section */}
                {gridCard.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <GridCardContainer
                      gridCard={gridCard[currentTab].data}
                      category={gridCard[currentTab].title}
                      currentTab={currentTab}
                    />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Subtle gradient fade at bottom for mobile - indicates more content */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#FAF2F4] to-transparent pointer-events-none" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceModal;
