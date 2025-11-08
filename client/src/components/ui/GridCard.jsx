/* eslint-disable react/prop-types */
import ServiceCartButton from "./ServiceCartButton";

const GridCard = ({ gridCardData, category }) => {
  return (
    <>
      {gridCardData.map((item, index) => {
        // Add category information to the service data
        const serviceDataWithCategory = {
          ...item,
          category: category || "default",
        };

        return (
          <div
            key={index}
            className="w-full h-[140px] sm:h-[150px] lg:h-[156px] py-4 px-4 sm:px-5 lg:px-6 rounded-xl shadow-md flex items-center bg-white"
          >
            <div className="card-content w-full h-full flex flex-row items-center justify-between gap-3 sm:gap-4 lg:gap-4">
              {/* Image Container - Fixed Size */}
              <div className="img-container w-[90px] sm:w-[100px] lg:w-[110px] h-[90px] sm:h-[100px] lg:h-[110px] rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src={item.img}
                  className="w-full h-full object-cover"
                  alt={item.cardHeader}
                />
              </div>

              {/* Content Container - Flexible */}
              <div className="card-descriptions flex flex-col flex-1 h-full justify-between py-1 min-w-0">
                {/* Title */}
                <div className="card-header text-base sm:text-[17px] lg:text-[18px] font-bold tracking-normal leading-snug text-gray-900 line-clamp-1">
                  {item.cardHeader}
                </div>

                {/* Description */}
                <div className="card-description text-xs sm:text-[13px] lg:text-[13px] text-[#3C3C43] leading-relaxed line-clamp-2 flex-1">
                  {item.description}
                </div>

                {/* Pricing Row */}
                <div className="card-pricing flex items-center justify-between gap-2 mt-auto">
                  <div className="price-time flex flex-col gap-1">
                    <div className="price flex items-baseline gap-1.5">
                      <span className="text-base sm:text-[17px] lg:text-[18px] font-bold text-gray-900">
                        ₹ {item.price}
                      </span>
                      {item.taxIncluded && (
                        <span className="text-[10px] sm:text-[11px] lg:text-[11px] font-normal text-gray-500">
                          Including taxes
                        </span>
                      )}
                    </div>
                    <div className="time text-xs sm:text-[13px] lg:text-[13px] font-medium text-gray-600">
                      {item.duration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Button Container - Fixed Width */}
              <div className="button-container flex-shrink-0">
                <ServiceCartButton
                  serviceData={serviceDataWithCategory}
                  className="text-xs sm:text-[13px] lg:text-[13px] whitespace-nowrap"
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
