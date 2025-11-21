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
      <div className="flex flex-col gap-2 sm:gap-3 lg:gap-[10px] p-3 sm:p-4 md:p-5 lg:p-6 h-auto min-h-[300px] sm:min-h-[350px] lg:h-[392px] w-full sm:w-[280px] lg:w-[304px] rounded-xl shadow-xl bg-white">
        <div className="w-full h-auto lg:h-[344px] flex flex-col gap-3 sm:gap-4 lg:gap-6">
          {/*image-container*/}
          <div className="image-container h-[200px] sm:h-[220px] md:h-[240px] lg:h-[256px] rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={item.img}
              className="w-full h-full object-cover object-center"
              alt={item.cardHeader ? `${item.cardHeader} service` : "service"}
            />
          </div>

          <div className="card-decription font-inter flex flex-col gap-1 sm:gap-2 lg:gap-[6px] items-start">
            <h2 className="font-medium text-base sm:text-lg lg:text-lg text-black leading-tight">
              {item.cardHeader}
            </h2>

            <p className="description text-xs sm:text-sm lg:text-sm font-normal text-[#666666] leading-relaxed">
              {item.description}
            </p>

            {item?.pricingNote ? (
              <p className="text-sm font-semibold text-[#3C3C43]">
                {item.pricingNote}
              </p>
            ) : (
              (item?.PriceEstimate || item?.Price) && (
                <div className="price flex items-center justify-between w-full mt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm sm:text-base font-semibold text-[#1F1F1F]">
                      ₹ {item?.Price ? item.Price : item.PriceEstimate}
                    </span>
                    {item?.includingTax && (
                      <span className="text-[10px] text-[#6B6B6B]">
                        Including Taxes
                      </span>
                    )}
                  </div>
                  {item?.service && (
                    <span className="text-[10px] font-semibold text-[#1F1F1F] whitespace-nowrap">
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
