/* eslint-disable react/prop-types */
import ServiceCartButton from "./ServiceCartButton";

const GridCard = ({ gridCardData, category }) => {
  return (
    <>
      {gridCardData.map((item, index) => {
        const serviceDataWithCategory = {
          ...item,
          category: category || "default",
        };

        return (
          <div
            key={index}
            className="w-full md:max-w-[478px] h-auto lg:h-[120px] py-4 px-3 sm:px-4 lg:pl-4 lg:pr-4 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center bg-white"
          >
            <div className="card-content w-full flex flex-row items-center justify-between gap-2 sm:gap-3 lg:gap-4 lg:h-full">
              {/* Image Container - 80px × 80px */}
              <div className="img-container w-[80px] h-[80px] rounded-[12px] overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src={item.img}
                  className="w-full h-full object-cover"
                  alt={item.cardHeader}
                />
              </div>

              {/* Content Container - 244px width (hug), 81px height (hug) */}
              <div className="card-descriptions flex flex-col justify-between md:w-[244px] lg:h-[81px] min-w-0 flex-1">
                {/* Title with consistent truncation */}
                <div className="card-header text-[18px] font-bold tracking-normal leading-tight text-gray-900 whitespace-nowrap mb-1">
                  {item.cardHeader}
                </div>

                {/* Description with consistent line clamping */}
                <div 
                  className="card-description text-[10px] text-[#3C3C43] leading-[14px] mb-[2px] overflow-hidden min-h-[28px]"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '14px'
                  }}
                >
                  {item.description}
                </div>

                {/* Pricing Row - Always at bottom */}
                <div className="card-pricing flex items-center justify-between gap-6 mt-auto pt-0 border-t border-gray-200">
                  <div className="price-time flex items-center gap-4 flex-1 min-w-0 pt-1">
                    <span className="text-[15px] sm:text-[16px] lg:text-[17px] font-bold text-gray-900 whitespace-nowrap">
                      ₹ {item.price}
                      {item.taxIncluded && (
                        <span className="ml-2 text-[10px] sm:text-[11px] lg:text-[11px] font-medium text-gray-500 whitespace-nowrap">
                          Including Taxes
                        </span>
                      )}
                    </span>
                    <span className="text-[13px] sm:text-[14px] font-semibold text-gray-900 whitespace-nowrap ml-8">
                      {item.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Button Container - Desktop: Fixed consistent width on right */}
              <div className="button-container hidden lg:flex flex-shrink-0 w-[100px] items-center justify-end lg:ml-2">
                <ServiceCartButton
                  serviceData={serviceDataWithCategory}
                  className="text-xs sm:text-[13px] lg:text-[14px] whitespace-nowrap"
                  sizeConfig={item?.buttonSize}
                />
              </div>
            </div>

            {/* Button Container - Mobile/Tablet: Full width at bottom */}
            <div className="button-container w-full mt-4 lg:hidden">
              <ServiceCartButton
                serviceData={serviceDataWithCategory}
                className="w-full text-xs sm:text-[13px] whitespace-nowrap"
                sizeConfig={item?.buttonSize}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default GridCard;