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
            className="w-full min-h-[140px] h-auto sm:h-[150px] lg:h-[156px] py-4 px-4 sm:px-5 lg:px-6 rounded-xl shadow-md flex items-center bg-white"
          >
            <div className="card-content w-full h-full flex flex-row items-stretch justify-between gap-3 sm:gap-4 lg:gap-4">
              {/* Image Container - Consistent Aspect Ratio */}
              <div className="img-container w-[80px] sm:w-[90px] lg:w-[100px] h-[80px] sm:h-[90px] lg:h-[100px] rounded-xl overflow-hidden flex-shrink-0 shadow-sm self-center">
                <img
                  src={item.img}
                  className="w-full h-full object-cover"
                  alt={item.cardHeader}
                />
              </div>

              {/* Content Container - Flexible but with constraints */}
              <div className="card-descriptions flex flex-col flex-1 h-full justify-between py-1 min-w-0 max-w-[calc(100%-120px)] sm:max-w-[calc(100%-140px)]">
                {/* Title with consistent truncation */}
                <div className="card-header text-[15px] sm:text-[16px] lg:text-[17px] font-bold tracking-normal leading-tight text-gray-900 line-clamp-1 mb-1">
                  {item.cardHeader}
                </div>

                {/* Description with consistent line clamping */}
                <div className="card-description text-xs sm:text-[12px] lg:text-[13px] text-[#3C3C43] leading-relaxed line-clamp-2 mb-2 flex-1">
                  {item.description}
                </div>

                {/* Pricing Row - Always at bottom */}
                <div className="card-pricing flex items-end justify-between gap-2 mt-auto">
                  <div className="price-time flex flex-col gap-1 flex-1 min-w-0">
                    <div className="price flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-[15px] sm:text-[16px] lg:text-[17px] font-bold text-gray-900 whitespace-nowrap">
                        ₹ {item.price}
                      </span>
                      {item.taxIncluded && (
                        <span className="text-[10px] sm:text-[11px] lg:text-[11px] font-normal text-gray-500 whitespace-nowrap">
                          Including taxes
                        </span>
                      )}
                    </div>
                    <div className="time text-xs sm:text-[12px] lg:text-[13px] font-medium text-gray-600 whitespace-nowrap">
                      {item.duration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Button Container - Fixed consistent width */}
              <div className="button-container flex-shrink-0 w-[90px] sm:w-[110px] lg:w-[120px] flex items-center justify-center">
                <ServiceCartButton
                  serviceData={serviceDataWithCategory}
                  className="min-w-[70px] sm:min-w-[90px] lg:min-w-[100px] text-xs sm:text-[13px] lg:text-[14px] whitespace-nowrap"
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default GridCard;