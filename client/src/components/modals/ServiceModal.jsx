/* eslint-disable react/prop-types */
/**
 * SERVICE MODAL LAYOUT STRUCTURE
 * ===============================
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │ AnimatePresence                                         │
 * │ ┌───────────────────────────────────────────────────┐   │
 * │ │ motion.div (OVERLAY)                              │   │
 * │ │ - Background overlay with backdrop blur           │   │
 * │ │ - Handles click outside to close                  │   │
 * │ │ ┌─────────────────────────────────────────────┐   │   │
 * │ │ │ motion.div (MODAL CONTAINER)                 │   │   │
 * │ │ │ - Main modal box (ref: modalRef)             │   │   │
 * │ │ │ - Handles drag gestures                       │   │   │
 * │ │ │                                               │   │   │
 * │ │ │ ┌─────────────────────────────────────────┐   │   │   │
 * │ │ │ │ Drag Handle (Mobile Only)               │   │   │   │
 * │ │ │ │ - Top drag indicator bar                 │   │   │   │
 * │ │ │ └─────────────────────────────────────────┘   │   │   │
 * │ │ │                                               │   │   │
 * │ │ │ ┌─────────────────────────────────────────┐   │   │   │
 * │ │ │ │ Header (STICKY)                         │   │   │   │
 * │ │ │ │ - Stays at top when scrolling            │   │   │   │
 * │ │ │ │ ┌───────────────────────────────────┐   │   │   │   │
 * │ │ │ │ │ Title Row                         │   │   │   │   │
 * │ │ │ │ │ - Title (motion.h2)               │   │   │   │   │
 * │ │ │ │ │ - Close Button (X)                │   │   │   │   │
 * │ │ │ │ └───────────────────────────────────┘   │   │   │   │
 * │ │ │ │                                         │   │   │   │
 * │ │ │ │ ┌───────────────────────────────────┐   │   │   │   │
 * │ │ │ │ │ Tabs Row (if gridCard exists)     │   │   │   │   │
 * │ │ │ │ │ - Tab buttons (Regular/Premium)   │   │   │   │   │
 * │ │ │ │ │ - Active tab indicator            │   │   │   │   │
 * │ │ │ │ └───────────────────────────────────┘   │   │   │   │
 * │ │ │ └─────────────────────────────────────────┘   │   │   │
 * │ │ │                                               │   │   │
 * │ │ │ ┌─────────────────────────────────────────┐   │   │   │
 * │ │ │ │ Content Area (SCROLLABLE)               │   │   │   │
 * │ │ │ │ - Scrollable container (ref: contentRef)│   │   │   │
 * │ │ │ │ ┌───────────────────────────────────┐   │   │   │   │
 * │ │ │ │ │ AnimatePresence                   │   │   │   │   │
 * │ │ │ │ │ ┌─────────────────────────────┐   │   │   │   │   │
 * │ │ │ │ │ │ motion.div (Tab Content)    │   │   │   │   │   │
 * │ │ │ │ │ │ - Animates on tab change    │   │   │   │   │   │
 * │ │ │ │ │ │                             │   │   │   │   │   │
 * │ │ │ │ │ │ ┌───────────────────────┐   │   │   │   │   │   │
 * │ │ │ │ │ │ │ FlexCards Section     │   │   │   │   │   │   │
 * │ │ │ │ │ │ │ (if cards.length > 0) │   │   │   │   │   │   │
 * │ │ │ │ │ │ │ - FlexCardContainer   │   │   │   │   │   │   │
 * │ │ │ │ │ │ └───────────────────────┘   │   │   │   │   │   │
 * │ │ │ │ │ │                             │   │   │   │   │   │
 * │ │ │ │ │ │ ┌───────────────────────┐   │   │   │   │   │   │
 * │ │ │ │ │ │ │ GridCards Section     │   │   │   │   │   │   │
 * │ │ │ │ │ │ │ (if gridCard.length>0)│   │   │   │   │   │   │
 * │ │ │ │ │ │ │ - GridCardContainer   │   │   │   │   │   │   │
 * │ │ │ │ │ │ └───────────────────────┘   │   │   │   │   │   │
 * │ │ │ │ │ └─────────────────────────────┘   │   │   │   │   │
 * │ │ │ │ └───────────────────────────────────┘   │   │   │   │
 * │ │ │ └─────────────────────────────────────────┘   │   │   │
 * │ │ │                                               │   │   │
 * │ │ │ ┌─────────────────────────────────────────┐   │   │   │
 * │ │ │ │ Gradient Fade (Mobile Only)             │   │   │   │
 * │ │ │ │ - Bottom fade indicator                 │   │   │   │
 * │ │ │ └─────────────────────────────────────────┘   │   │   │
 * │ │ └─────────────────────────────────────────────┘   │   │
 * │ └───────────────────────────────────────────────────┘   │
 * └─────────────────────────────────────────────────────────┘
 *
 * WHERE TO ADD NEW ELEMENTS:
 * ===========================
 *
 * 1. NEW HEADER ELEMENT (above/below title):
 *    → Add in "Title Row" div (line ~300)
 *
 * 2. NEW TAB:
 *    → Modify 'tabs' array (line ~11)
 *    → Tabs render automatically in "Tabs Row" (line ~327)
 *
 * 3. NEW CONTENT SECTION (in scrollable area):
 *    → Add in "Tab Content" motion.div (line ~392)
 *    → Can add before/after FlexCards or GridCards sections
 *
 * 4. NEW FOOTER/BOTTOM ELEMENT:
 *    → Add new div after "Content Area" (after line ~427)
 *    → Before "Gradient Fade" div
 *
 * 5. NEW BUTTON/ACTION BAR:
 *    → Add in Header section OR after Content Area
 *    → Use sticky positioning if needed in header
 *
 * 6. NEW SIDEBAR/ADJACENT CONTENT:
 *    → Modify modal container to use grid/flex layout
 *    → Add as sibling to "Header" or "Content Area"
 */

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoInformationCircleOutline, IoChevronDown } from "react-icons/io5";
import { HiShoppingCart } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import FlexCardContainer from "../../components/ui/FlexCardContainer";
import GridCardContainer from "../ui/GridCardContainer";

const ServiceModal = ({
  title,
  cards = [],
  gridCard = [],
  infoContent = null,
  onClose,
  services = [],
  currentServiceId = null,
  onServiceChange = null,
}) => {
  const navigate = useNavigate();
  const { totalServices } = useCart();
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const tabs = gridCard.map((item) => item?.title);
  const [currentTab, setCurrentTab] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const infoIconRef = useRef(null);
  const dropdownRef = useRef(null);
  const dragStartY = useRef(0);
  const touchStateRef = useRef({
    startY: 0,
  });

  const handleCartClick = () => {
    onClose();
    navigate("/cart");
  };

  const handleServiceSelect = (serviceId) => {
    if (onServiceChange && serviceId !== currentServiceId) {
      onServiceChange(serviceId);
    }
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showDropdown]);

  // Check if desktop on mount and resize
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

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
      {/* ======================================== */}
      {/* SECTION 1: OVERLAY (Background backdrop) */}
      {/* ======================================== */}
      <motion.div
        key="modal-overlay"
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/30 backdrop-blur-sm"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        {/* ======================================== */}
        {/* SECTION 2: MODAL CONTAINER (Main box) */}
        {/* ======================================== */}
        <motion.div
          ref={modalRef}
          className="relative w-full md:w-[1020px] h-[77vh] md:h-[620px] bg-[#FAF2F4] rounded-t-3xl md:rounded-2xl shadow-2xl py-4 sm:py-6 md:py-8 lg:py-[60px] pl-2 sm:pl-3 md:pl-4 lg:pl-6 pr-1 sm:pr-2 md:pr-2 lg:pr-2 flex flex-col mx-0 md:mx-2 lg:mx-4 overflow-hidden"
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
          {/* ======================================== */}
          {/* SECTION 2.1: DRAG HANDLE (Mobile only) */}
          {/* ======================================== */}
          <div
            className="md:hidden absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-400/60 rounded-full cursor-grab active:cursor-grabbing"
            onTouchStart={handleDragStart}
            onMouseDown={handleDragStart}
          />

          {/* ======================================== */}
          {/* SECTION 3: HEADER (Sticky at top) */}
          {/* ✅ Add new header elements here */}
          {/* ======================================== */}
          <div className="sticky w-full top-0 bg-[#FAF2F4] z-10 pb-2 sm:pb-3 lg:pb-0 mt-4 md:mt-0 border-b border-gray-200/50">
            {/* ======================================== */}
            {/* SECTION 3.1: TITLE ROW */}
            {/* ✅ Add elements before/after title here */}
            {/* ======================================== */}
            <div className="flex justify-between items-center w-full mb-3 sm:mb-4 lg:mb-6">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {services.length > 0 && onServiceChange ? (
                  <div ref={dropdownRef} className="relative flex-1 min-w-0">
                    <motion.button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 text-[#CC2B52] text-xl sm:text-2xl md:text-3xl lg:text-[32px] leading-tight sm:leading-relaxed lg:leading-[52px] font-bold hover:opacity-80 transition-opacity"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <span className="truncate">{title}</span>
                      <IoChevronDown
                        className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 flex-shrink-0 transition-transform duration-200 ${
                          showDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {showDropdown && (
                        <>
                          {/* Backdrop for mobile */}
                          <motion.div
                            className="fixed inset-0 bg-black/30 z-[60] lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDropdown(false)}
                          />

                          {/* Dropdown Content */}
                          <motion.div
                            className="absolute top-full left-0 mt-2 w-[280px] sm:w-[320px] bg-white rounded-xl shadow-2xl z-[70] overflow-hidden border border-gray-100"
                            initial={{
                              y: -10,
                              opacity: 0,
                              scale: 0.95,
                            }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{
                              y: -10,
                              opacity: 0,
                              scale: 0.95,
                            }}
                            transition={{
                              type: "spring",
                              damping: 25,
                              stiffness: 300,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {services.map((service, index) => (
                              <button
                                key={service.id}
                                onClick={() => handleServiceSelect(service.id)}
                                className={`w-full text-left px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors ${
                                  service.id === currentServiceId
                                    ? "bg-gray-100 font-semibold text-[#CC2B52]"
                                    : "text-[#3C3C43]"
                                } ${
                                  index !== services.length - 1
                                    ? "border-b border-gray-200"
                                    : ""
                                }`}
                              >
                                {service.name}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.h2
                    className="text-[#CC2B52] text-xl sm:text-2xl md:text-3xl lg:text-[32px] leading-tight sm:leading-relaxed lg:leading-[52px] font-bold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    {title}
                  </motion.h2>
                )}
              </div>

              <motion.button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-red-600 transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0 ml-2"
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

            {/* ======================================== */}
            {/* SECTION 3.2: TABS ROW */}
            {/* ✅ Tabs render here automatically */}
            {/* ✅ Info icon at extreme right */}
            {/* ======================================== */}
            {gridCard.length > 0 && (
              <div className="relative w-full  pb-2 overflow-visible">
                <motion.div
                  className="tabs flex flex-row items-center justify-between pr-2 gap-4 sm:gap-6 lg:gap-8 text-sm sm:text-base md:text-lg lg:text-[20px] leading-6 sm:leading-7 lg:leading-8 font-inter pb-2 overflow-visible"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 flex-shrink-0 overflow-visible">
                    {tabs.map((item, index) => (
                      <motion.div
                        key={index}
                        onClick={() => setCurrentTab(index)}
                        className={`relative py-2 sm:py-3 transition-all duration-300 ease-out cursor-pointer flex-shrink-0
                                  ${
                                    currentTab === index
                                      ? "text-[#CC2B52] font-bold"
                                      : "text-gray-600/60 font-normal hover:text-[#CC2B52]"
                                  }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span
                          className={`whitespace-nowrap px-2 ${
                            currentTab === index ? "font-bold" : "font-normal"
                          }`}
                          style={{
                            fontWeight: currentTab === index ? 700 : 400,
                          }}
                        >
                          {item}
                        </span>
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
                  </div>

                  {/* Info Icon - conditionally rendered at extreme right */}
                  {infoContent && (
                    <div
                      ref={infoIconRef}
                      className="relative flex-shrink-0 overflow-visible"
                      onMouseEnter={() => isDesktop && setShowInfo(true)}
                      onMouseLeave={() => isDesktop && setShowInfo(false)}
                    >
                      <motion.button
                        onClick={() => {
                          if (!isDesktop) {
                            setShowInfo(!showInfo);
                          }
                        }}
                        className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 text-[#CC2B52] hover:text-[#B02547] transition-colors cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Service information"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <IoInformationCircleOutline className="w-full h-full" />
                      </motion.button>

                      {/* Info Popover - All screens appear near icon */}
                      <AnimatePresence>
                        {showInfo && (
                          <>
                            {/* Backdrop for mobile */}
                            <motion.div
                              className="fixed inset-0 bg-black/30 z-[60] lg:hidden"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setShowInfo(false)}
                            />

                            {/* Popover content - positioned near icon on all screens */}
                            <motion.div
                              className="popover-content absolute top-full right-0 mt-3 w-[280px] sm:w-[320px] bg-white rounded-xl shadow-2xl z-[70] p-4"
                              initial={{
                                y: 10,
                                opacity: 0,
                                scale: 0.95,
                              }}
                              animate={{ y: 0, opacity: 1, scale: 1 }}
                              exit={{
                                y: 10,
                                opacity: 0,
                                scale: 0.95,
                              }}
                              transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                              }}
                              onClick={(e) => e.stopPropagation()}
                              onMouseEnter={() => {
                                if (isDesktop) {
                                  setShowInfo(true);
                                }
                              }}
                              onMouseLeave={() => {
                                if (isDesktop) {
                                  setShowInfo(false);
                                }
                              }}
                              style={{
                                transformOrigin: "top right",
                              }}
                            >
                              {/* Mobile/Tablet header with close button */}
                              <div className="flex justify-between items-center mb-3 lg:mb-2">
                                <h4 className="text-[#CC2B52] font-semibold text-sm lg:hidden">
                                  Important Information
                                </h4>
                                <button
                                  onClick={() => setShowInfo(false)}
                                  className="text-gray-500 hover:text-gray-700 lg:hidden"
                                >
                                  <span className="text-xl">&times;</span>
                                </button>
                              </div>

                              {/* Info content */}
                              <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
                                {infoContent.items?.map((item, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="text-[#CC2B52] mt-1 flex-shrink-0">
                                      •
                                    </span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>

                              {/* Arrow pointing to icon */}
                              <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 shadow-lg border-l border-t border-gray-100" />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {/* ======================================== */}
          {/* SECTION 4: CONTENT AREA (Scrollable) */}
          {/* ✅ Add new content sections here */}
          {/* ======================================== */}
          <motion.div
            ref={contentRef}
            tabIndex={0}
            className="flex-1 w-full overflow-y-auto mt-4 sm:mt-6 outline-none pb-4 pr-0 custom-scrollbar"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: "#9CA3AF #F7EBEE",
            }}
            onTouchStart={handleContentTouchStart}
            onTouchMove={handleContentTouchMove}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {/* ======================================== */}
              {/* SECTION 4.1: TAB CONTENT (Animated) */}
              {/* ✅ Add new content sections here */}
              {/* ======================================== */}
              <motion.div
                key={currentTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                {/* ======================================== */}
                {/* SECTION 4.1.1: FLEX CARDS SECTION */}
                {/* ✅ Modify FlexCards here */}
                {/* ======================================== */}
                {cards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FlexCardContainer cards={cards} />
                  </motion.div>
                )}

                {/* ======================================== */}
                {/* SECTION 4.1.2: GRID CARDS SECTION */}
                {/* ✅ Modify GridCards here */}
                {/* ======================================== */}
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

          {/* ======================================== */}
          {/* SECTION 5: FOOTER/BOTTOM ELEMENTS */}
          {/* ✅ Add footer, action buttons, etc. here */}
          {/* ======================================== */}

          {/* ======================================== */}
          {/* SECTION 5.1: CART BUTTON (Bottom Right) */}
          {/* ======================================== */}
          <motion.button
            onClick={handleCartClick}
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#CC2B52] text-white shadow-lg hover:bg-[#B02547] transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            aria-label="Go to cart"
          >
            <HiShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            {/* Cart Badge */}
            {totalServices > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-white text-[#CC2B52] rounded-full shadow-md border border-[#CC2B52]/20 text-xs font-bold"
                style={{
                  fontSize: "10px",
                  lineHeight: "1",
                }}
              >
                {totalServices}
              </span>
            )}
          </motion.button>

          {/* ======================================== */}
          {/* SECTION 5.2: GRADIENT FADE (Mobile only) */}
          {/* ======================================== */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 h-8 bg-[#FFFCFD] to-transparent pointer-events-none" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceModal;
