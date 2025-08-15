/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import FlexCardContainer from "../../components/ui/FlexCardContainer";
import GridCardContainer from "../ui/GridCardContainer";

const ServiceModal = ({ title, cards = [], gridCard = [], onClose }) => {
  useEffect(() => {
    const body = document.querySelector("body");
    body.style.overflowY = "hidden";

    return () => (body.style.overflowY = "scroll");
  }, []);
  const tabs = gridCard.map((item) => item?.title);

  const [tab, setTab] = useState(tabs);
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div
      className="relative w-[1104px] h-[596px] bg-[#FAF2F4] rounded-lg shadow-lg py-[60px] px-[36px] flex flex-col items-start"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h2 className="text-[#CC2B52] text-[28px] leading-[48px]  font-semibold">
          {title}
        </h2>
        <div className="flex items-center justify-center gap-20">
          <div className="tabs flex items-center justify-between gap-24 text-[#CC2B52] text-[20px] leading-8 font-bold font-inter">
            {tab.map((item, index) => (
              <div
                key={index}
                onClick={() => setCurrentTab(index)}
                className={`py-2 transition-all duration-300 ease-out
                          ${
                            currentTab === index
                              ? "bg-transparent font-bold border-b-[2px] border-[#CC2B52]" // Active tab stays the same
                              : " font-medium cursor-pointer opacity-[76%]" // Inactive styling
                          }`}
              >
                <h3>{item}</h3>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center pb-2">
            <button
              onClick={onClose}
              className=" text-[28px] font-bold hover:text-red-600"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        </div>
      </div>

      {/* FlexCards Section */}
      {cards.length > 0 && <FlexCardContainer cards={cards} />}

      {/* GridCards Section */}
      {gridCard.length > 0 && (
        <GridCardContainer
          gridCard={gridCard[currentTab].data}
          currentTab={currentTab}
        />
      )}
    </div>
  );
};

export default ServiceModal;
