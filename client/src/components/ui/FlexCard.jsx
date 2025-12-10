/* eslint-disable react/prop-types */
import { useState } from "react";
import EnquiryModal from "../modals/EnquiryModal";
import ServiceCartButton from "./ServiceCartButton";

const FlexCard = ({ item, source = "other" }) => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  // Prepare service data for enquiry modal
  const serviceData = {
    serviceName: item.cardHeader || "Service",
    serviceCategory: item.serviceCategory || "Beauty Service",
    priceRange: item.PriceEstimate || item.Price || null,
    serviceId: item.service_id || null,
  };

  const handleEnquiryClick = () => {
    console.log("Opening enquiry modal for:", serviceData);
    setIsEnquiryModalOpen(true);
  };

  const addButtonClassName = item?.addButtonClassName ?? "w-full text-sm";
  return (
    <>
      <div className="flex flex-col gap-[clamp(0.75rem,2vw,1rem)] p-[clamp(0.75rem,2vw,1.5rem)] min-h-[clamp(280px,38vh,360px)] w-full rounded-2xl shadow-xl bg-white">
        <div className="w-full flex flex-col gap-[clamp(0.75rem,2vw,1.25rem)] flex-1">
          {/*image-container*/}
          <div className="image-container h-[clamp(160px,24vh,256px)] rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              src={item.img}
              className="w-full h-full object-cover object-center"
              alt={item.cardHeader ? `${item.cardHeader} service` : "service"}
            />
          </div>

          <div className="card-decription font-inter flex flex-col gap-[clamp(0.25rem,1vw,0.5rem)] items-start flex-1">
            <h2 className="font-medium text-[18px] text-black leading-tight">
              {item.cardHeader}
            </h2>

            <p className="description text-[10px] font-normal text-[#666666] leading-relaxed">
              {item.description}
            </p>

            {item?.pricingNote ? (
              <p className="text-sm font-semibold text-[#3C3C43]">
                {item.pricingNote}
              </p>
            ) : (
              (item?.PriceEstimate || item?.Price) && (
                <div className="price flex items-center justify-between w-full mt-1 flex-wrap gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[clamp(0.95rem,2vw,1.05rem)] font-semibold text-[#1F1F1F]">
                      ₹ {item?.Price ? item.Price : item.PriceEstimate}
                    </span>
                    {item?.includingTax && (
                      <span className="text-[clamp(0.6rem,1.4vw,0.7rem)] text-[#6B6B6B] whitespace-nowrap">
                        Including Taxes
                      </span>
                    )}
                  </div>
                  {item?.service && (
                    <span className="text-[clamp(0.6rem,1.4vw,0.7rem)] font-semibold text-[#1F1F1F] whitespace-nowrap">
                      {item.service}
                    </span>
                  )}
                </div>
              )
            )}
          </div>

          {/* action-button */}
          {item?.enableAddButton ? (
            <ServiceCartButton
              serviceData={serviceData}
              className={addButtonClassName}
              sizeConfig={item?.buttonSize}
            />
          ) : (
            <button
              onClick={handleEnquiryClick}
              className="button w-full font-semibold text-xs sm:text-sm lg:text-sm flex flex-col items-center justify-center text-[#FFFFFF] bg-[#CC2B52] rounded-3xl px-2 sm:px-3 lg:px-3 py-2 sm:py-2 lg:py-2 cursor-pointer hover:bg-[#CC2B52]/90 transition-colors"
            >
              Enquiry Now
            </button>
          )}
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        serviceData={serviceData}
        source={source}
      />
    </>
  );
};

export default FlexCard;
