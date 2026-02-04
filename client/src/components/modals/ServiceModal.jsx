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
import { SkeletonTabs, ServiceModalGridSkeleton, ServiceModalFlexSkeleton } from "../ui/ServiceModalSkeleton";

const getIsDesktop = () =>
  typeof window !== "undefined" && window.innerWidth >= 1024;

const ServiceModal = ({
  title,
  cards = [],
  gridCard = [],
  infoContent = null,
  onClose,
  services = [],
  currentServiceId = null,
  onServiceChange = null,
  loading = false,
  loadingLayout = "grid",
}) => {
  const navigate = useNavigate();
  const { totalServices } = useCart();
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const tabs = gridCard.map((item) => item?.title);
  const showTabsRow = gridCard.length > 0 || (loading && loadingLayout === "grid");
  const [currentTab, setCurrentTab] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isDesktop, setIsDesktop] = useState(getIsDesktop());
  // const [isDesktop, setIsDesktop] = useState(false);
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
        className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4 bg-black/30 backdrop-blur-sm"
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
          className="relative w-full max-w-[min(95vw,1020px)] h-[clamp(460px,85vh,620px)] bg-[#FAF2F4] rounded-[16px] shadow-2xl py-[clamp(1rem,3vw,3.75rem)] px-[clamp(0.5rem,2vw,1.5rem)] flex flex-col mx-auto overflow-hidden"
          variants={isDesktop ? desktopModalVariants : modalVariants}
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
            className="lg:hidden absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-400/60 rounded-full cursor-grab active:cursor-grabbing"
            onTouchStart={handleDragStart}
            onMouseDown={handleDragStart}
          />

          {/* ======================================== */}
          {/* SECTION 3: HEADER (Sticky at top) */}
          {/* ✅ Add new header elements here */}
          {/* ======================================== */}
          <div className="sticky w-full top-0 bg-[#FAF2F4] z-10 pb-[clamp(0.5rem,1.5vw,0.75rem)] mt-[clamp(0.5rem,2vw,1rem)] md:mt-0 border-b border-gray-200/50">
            {/* ======================================== */}
            {/* SECTION 3.1: TITLE ROW */}
            {/* ✅ Add elements before/after title here */}
            {/* ======================================== */}
            <div className="flex justify-between items-center w-full mb-[clamp(0.75rem,2vw,1.5rem)]">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {services.length > 0 && onServiceChange ? (
                  <div ref={dropdownRef} className="relative flex-1 min-w-0">
                    <motion.button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 text-[#CC2B52] text-[clamp(1.25rem,3vw,2rem)] leading-tight font-bold hover:opacity-80 transition-opacity"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <span className="truncate">{title}</span>
                      <IoChevronDown
                        className={`w-[clamp(1rem,2.5vw,1.5rem)] h-[clamp(1rem,2.5vw,1.5rem)] flex-shrink-0 transition-transform duration-200 ${
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
                            className="absolute top-full left-0 mt-2 w-[clamp(200px,90vw,320px)] min-w-[200px] max-w-[320px] bg-white rounded-xl shadow-2xl z-[70] overflow-hidden border border-gray-100"
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
                                className={`w-full text-left px-[clamp(0.875rem,2.5vw,1.5rem)] py-[clamp(0.625rem,1.75vw,0.875rem)] text-[clamp(0.8125rem,1.4vw,1rem)] font-medium hover:bg-gray-50 transition-colors whitespace-nowrap ${
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
                    className="text-[#CC2B52] text-[clamp(1.25rem,3vw,2rem)] leading-tight font-bold"
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
                className="flex items-center justify-center w-[clamp(2rem,4vw,3rem)] h-[clamp(2rem,4vw,3rem)] rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-red-600 transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0 ml-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close modal"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                <span className="text-[clamp(1.125rem,2.5vw,1.5rem)] font-semibold">
                  &times;
                </span>
              </motion.button>
            </div>

            {/* ======================================== */}
            {/* SECTION 3.2: TABS ROW */}
            {/* ✅ Tabs render here automatically (or skeleton when loading) */}
            {/* ✅ Info icon at extreme right */}
            {/* ======================================== */}
            {showTabsRow && (
              <div className="relative w-full  pb-2 overflow-visible">
                {loading && loadingLayout === "grid" ? (
                  <SkeletonTabs count={3} />
                ) : (
                <motion.div
                  className="tabs flex flex-row items-center justify-between pr-2 gap-[clamp(1rem,3vw,2rem)] text-[clamp(0.875rem,1.5vw,1.25rem)] leading-[clamp(1.5rem,2vw,2rem)] font-inter pb-2 overflow-visible"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <div className="flex items-center gap-[clamp(1rem,3vw,2rem)] flex-shrink-0 overflow-visible">
                    {tabs.map((item, index) => (
                      <motion.div
                        key={index}
                        onClick={() => setCurrentTab(index)}
                        className={`relative py-[clamp(0.5rem,1.5vw,0.75rem)] transition-all duration-300 ease-out cursor-pointer flex-shrink-0
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
                        className="flex items-center justify-center w-[clamp(1.25rem,2.5vw,1.5rem)] h-[clamp(1.25rem,2.5vw,1.5rem)] text-[#CC2B52] hover:text-[#B02547] transition-colors cursor-pointer"
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
                      {/* Info Popover - All screens appear near icon */}
                      <AnimatePresence>
                        {showInfo && (
                          <>
                            {/* Backdrop - 25% transparent */}
                            <motion.div
                              className="fixed inset-0 bg-black/25 z-[60]"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setShowInfo(false)}
                            />

                            {/* Popover content - Fully responsive sizing */}
                            <motion.div
                              className="popover-content absolute top-full right-0 mt-3 w-[85vw] max-w-[320px] sm:w-[75vw] sm:max-w-[360px] md:w-[65vw] md:max-w-[380px] lg:w-[380px] xl:w-[400px] bg-white rounded-xl shadow-2xl z-[70] p-3 sm:p-4 md:p-5"
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
                              <div className="flex justify-between items-center mb-3 lg:mb-3">
                                <h4 className="text-[#CC2B52] font-semibold text-sm sm:text-base md:text-lg lg:text-base">
                                  Important Information
                                </h4>
                                <button
                                  onClick={() => setShowInfo(false)}
                                  className="text-gray-500 hover:text-gray-700 lg:hidden"
                                >
                                  <span className="text-xl">&times;</span>
                                </button>
                              </div>

                              {/* Info content - Responsive text sizing */}
                              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base lg:text-sm text-gray-700 leading-relaxed sm:leading-loose">
                                {infoContent.items?.map((item, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 sm:gap-3"
                                  >
                                    <span className="text-[#CC2B52] mt-0.5 sm:mt-1 flex-shrink-0 text-sm sm:text-base">
                                      •
                                    </span>
                                    <span className="flex-1">{item}</span>
                                  </li>
                                ))}
                              </ul>

                              {/* Arrow pointing to icon - Responsive positioning */}
                              <div className="absolute -top-2 right-3 sm:right-4 w-3 h-3 sm:w-4 sm:h-4 bg-white transform rotate-45 shadow-lg border-l border-t border-gray-100" />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
                )}
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
            className="flex-1 w-full overflow-y-auto mt-[clamp(1rem,2vw,1.5rem)] outline-none pb-[clamp(1rem,2vw,1.5rem)] pr-[clamp(0.75rem,2vw,1.5rem)] custom-scrollbar"
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
                key={loading ? "skeleton" : currentTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <>
                    {loadingLayout === "grid" && <ServiceModalGridSkeleton rows={6} />}
                    {loadingLayout === "cards" && <ServiceModalFlexSkeleton cards={6} />}
                  </>
                ) : (
                  <>
                    {/* ======================================== */}
                    {/* SECTION 4.1.1: FLEX CARDS SECTION */}
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
                  </>
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
            className="absolute bottom-[clamp(1rem,2vw,1.5rem)] right-[clamp(1rem,2vw,1.5rem)] z-50 flex items-center justify-center w-[clamp(2.5rem,5vw,3rem)] h-[clamp(2.5rem,5vw,3rem)] rounded-full bg-[#CC2B52] text-white shadow-lg hover:bg-[#B02547] transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            aria-label="Go to cart"
          >
            <HiShoppingCart className="w-[clamp(1.25rem,3vw,1.5rem)] h-[clamp(1.25rem,3vw,1.5rem)]" />
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
