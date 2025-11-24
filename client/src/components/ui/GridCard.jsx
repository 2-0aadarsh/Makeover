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
            className="w-full h-auto py-[clamp(0.75rem,2vw,1rem)] px-[clamp(0.75rem,2vw,1rem)] rounded-2xl shadow-md flex flex-col lg:flex-row lg:items-center bg-white gap-[clamp(0.5rem,1.5vw,1rem)]"
          >
            <div className="card-content w-full flex flex-row items-center justify-between gap-[clamp(0.5rem,1.5vw,1rem)]">
              <div className="img-container w-[clamp(64px,10vw,84px)] h-[clamp(64px,10vw,84px)] rounded-[14px] overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src={item.img}
                  className="w-full h-full object-cover"
                  alt={item.cardHeader}
                />
              </div>

              <div className="card-descriptions flex flex-col justify-between flex-1 min-w-0">
                <div className="card-header text-[clamp(1rem,2vw,1.125rem)] font-bold leading-tight text-gray-900 truncate mb-[2px]">
                  {item.cardHeader}
                </div>

                <div
                  className="card-description text-[clamp(0.75rem,1.3vw,0.875rem)] text-[#3C3C43] leading-relaxed mb-[2px] overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "14px",
                  }}
                >
                  {item.description}
                </div>

                <div className="card-pricing flex items-center justify-between gap-[clamp(0.5rem,1.5vw,1rem)] mt-auto pt-2 border-t border-gray-100 flex-wrap">
                  <div className="price-time flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] flex-1 min-w-0">
                    <span className="text-[clamp(0.95rem,1.6vw,1.05rem)] font-bold text-gray-900 whitespace-nowrap">
                      ₹ {item.price}
                      {item.taxIncluded && (
                        <span className="ml-2 text-[clamp(0.65rem,1.2vw,0.75rem)] font-medium text-gray-500 whitespace-nowrap">
                          Including Taxes
                        </span>
                      )}
                    </span>
                    <span className="text-[clamp(0.65rem,1.2vw,0.8rem)] font-semibold text-gray-900 whitespace-nowrap">
                      {item.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div className="button-container hidden lg:flex flex-shrink-0 w-[110px] items-center justify-end lg:ml-2">
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
