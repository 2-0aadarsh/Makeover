/* eslint-disable react/prop-types */
import { useState } from "react";
import EnquiryModal from "../modals/EnquiryModal";
import ServiceCartButton from "./ServiceCartButton";

const FlexCard = ({ item, source = "other" }) => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  // Prepare service data for enquiry modal and cart (include option for services with variants)
  const serviceData = {
    serviceName: item.cardHeader || "Service",
    serviceCategory: item.serviceCategory || "Beauty Service",
    priceRange: item.PriceEstimate || item.Price || null,
    serviceId: item.service_id || null,
    service_id: item.service_id || null,
    cardHeader: item.cardHeader,
    description: item.description,
    price: item.price ?? item.Price ?? 0,
    img: item.img ?? (item.originalService?.image?.[0]),
    category: item.originalService?.categoryId?.name ?? item.serviceCategory ?? "default",
    taxIncluded: item.includingTax !== false,
    optionIndex: item.optionIndex,
    optionLabel: item.service ?? (item.options?.[item.optionIndex]?.label),
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
              (item?.PriceEstimate != null || item?.Price != null) && (
                <div className="price flex items-center justify-between w-full mt-1 flex-wrap gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[clamp(0.95rem,2vw,1.05rem)] font-semibold text-[#1F1F1F]">
                      {(() => {
                        // Prefer priceDisplay (PriceEstimate) so "2.5k-11k" etc. show as saved
                        const value = item?.PriceEstimate ?? item?.Price;
                        if (value == null) return '';
                        if (value === 'Price on request' || value === 'Get in touch for pricing') return value;
                        if (typeof value === 'string') return value.startsWith('₹') ? value : `₹ ${value}`;
                        return `₹ ${Number(value).toLocaleString('en-IN')}`;
                      })()}
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
          ) : item?.originalService?.ctaContent === "Add" && item?.isAvailable === false ? (
            <div className="w-full text-center">
              <button
                type="button"
                disabled
                className="button w-full font-semibold text-xs sm:text-sm lg:text-sm flex flex-col items-center justify-center text-gray-500 bg-gray-200 rounded-3xl px-2 sm:px-3 lg:px-3 py-2 sm:py-2 lg:py-2 cursor-not-allowed"
              >
                Add +
              </button>
              <p className="text-xs text-amber-600 font-medium mt-1.5 break-words">Currently unavailable</p>
            </div>
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
