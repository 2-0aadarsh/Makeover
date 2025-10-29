/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import FlexCardContainer from "../../components/ui/FlexCardContainer";
import GridCardContainer from "../ui/GridCardContainer";

const ResponsiveServiceModal = ({ title, cards = [], gridCard = [], onClose }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const tabs = gridCard.map((item) => item?.title);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    // Save the current scroll position
    const savedScrollPosition = window.pageYOffset;
    setScrollPosition(savedScrollPosition);

    // Add styles to prevent background scrolling
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollPosition}px`;
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
      // Cleanup: restore scrolling and scroll position
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollPosition);

      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, scrollPosition]);

  // Handle wheel events on the modal to ensure scrolling works
  const handleWheel = (e) => {
    if (contentRef.current) {
      // Prevent the event from bubbling to the parent
      e.stopPropagation();

      // Calculate new scroll position
      const newScrollTop = contentRef.current.scrollTop + e.deltaY;

      // Determine if we can scroll further
      const maxScroll =
        contentRef.current.scrollHeight - contentRef.current.clientHeight;

      if (newScrollTop >= 0 && newScrollTop <= maxScroll) {
        contentRef.current.scrollTop = newScrollTop;
        e.preventDefault();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-70 "
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[1104px] h-auto max-h-[90vh] bg-[#FAF2F4] rounded-lg shadow-lg py-4 sm:py-6 md:py-8 lg:py-[60px] px-3 sm:px-4 md:px-6 lg:px-[36px] flex flex-col mx-2 sm:mx-4 lg:mx-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
      >
        {/* Header - Sticky */}
        <div className="sticky w-full top-0 bg-[#FAF2F4] z-10 pb-2 sm:pb-3 lg:pb-0">
          {/* Title Row */}
          <div className="flex justify-between items-center w-full mb-2 sm:mb-3 lg:mb-4">
            <h2 className="text-[#CC2B52] text-lg sm:text-xl md:text-2xl lg:text-[28px] leading-tight sm:leading-relaxed lg:leading-[48px] font-semibold">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-xl sm:text-2xl lg:text-[28px] font-bold hover:text-red-600 transition-colors"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          {/* Tabs Row */}
          {gridCard.length > 0 && (
            <div className="tabs flex flex-row items-center justify-start gap-6 sm:gap-4 lg:gap-6 text-[#CC2B52] text-sm sm:text-base md:text-lg lg:text-[20px] leading-6 sm:leading-7 lg:leading-8 font-bold font-inter overflow-x-auto no-scrollbar">
              {tabs.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentTab(index)}
                  className={`py-1 sm:py-2 transition-all duration-300 ease-out cursor-pointer flex-shrink-0
                            ${
                              currentTab === index
                                ? "bg-transparent font-bold border-b-[2px] border-[#CC2B52]"
                                : "font-medium cursor-pointer opacity-[76%]"
                            }`}
                >
                  <h3 className="whitespace-nowrap">{item}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Area - Scrollable */}
        <div
          ref={contentRef}
          tabIndex={0} // Make div focusable for keyboard navigation
          className="flex-1 w-full overflow-y-auto no-scrollbar mt-4 outline-none"
          style={{ WebkitOverflowScrolling: "touch" }} // Enable smooth scrolling on iOS
        >
          {/* FlexCards Section */}
          {cards.length > 0 && <FlexCardContainer cards={cards} />}

          {/* GridCards Section */}
          {gridCard.length > 0 && (
            <GridCardContainer
              gridCard={gridCard[currentTab].data}
              category={gridCard[currentTab].title}
              currentTab={currentTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveServiceModal;
