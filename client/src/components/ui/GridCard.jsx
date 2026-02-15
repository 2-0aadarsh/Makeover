/* eslint-disable react/prop-types */
import ServiceCartButton from "./ServiceCartButton";

const isAddButton = (button) => button === "Add" || button === "Add +" || String(button || "").startsWith("Add");

const GridCard = ({ gridCardData, category }) => {
  return (
    <>
      {gridCardData.map((item, index) => {
        const serviceDataWithCategory = {
          ...item,
          category: category || "default",
        };
        const showAsUnavailable = isAddButton(item.button) && item.isAvailable === false;

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
                <div className="card-header text-[18px] font-bold leading-tight text-gray-900 mb-[2px] whitespace-nowrap overflow-visible">
                  {item.cardHeader}
                </div>

                <div
                  className="card-description text-[10px] text-[#3C3C43] leading-relaxed mb-[2px] overflow-hidden"
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
                      {item.price === 'Get in touch for pricing' || item.price === 'Price on request'
                        ? item.price
                        : typeof item.price === 'number'
                          ? `₹ ${item.price.toLocaleString('en-IN')}`
                          : String(item.price || '').startsWith('₹')
                            ? item.price
                            : `₹ ${item.price ?? ''}`}
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

              <div className="button-container hidden lg:flex flex-shrink-0 min-w-[8.5rem] w-[8.5rem] xl:w-[9rem] flex-col items-end justify-end lg:ml-2">
                {showAsUnavailable ? (
                  <>
                    <button
                      type="button"
                      disabled
                      className="text-xs sm:text-[13px] lg:text-[14px] whitespace-nowrap px-4 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed font-semibold"
                    >
                      Add +
                    </button>
                    <p className="text-[10px] text-amber-600 font-medium mt-1 text-left">Currently unavailable</p>
                  </>
                ) : (
                  <ServiceCartButton
                    serviceData={serviceDataWithCategory}
                    className="text-xs sm:text-[13px] lg:text-[14px] whitespace-nowrap"
                    sizeConfig={item?.buttonSize}
                  />
                )}
              </div>
            </div>

            {/* Button Container - Mobile/Tablet: Full width at bottom */}
            <div className="button-container w-full mt-4 lg:hidden">
              {showAsUnavailable ? (
                <div className="w-full text-center">
                  <button
                    type="button"
                    disabled
                    className="w-full text-xs sm:text-[13px] px-4 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed font-semibold"
                  >
                    Add +
                  </button>
                  <p className="text-[10px] text-amber-600 font-medium mt-1.5 text-center break-words">Currently unavailable</p>
                </div>
              ) : (
                <ServiceCartButton
                  serviceData={serviceDataWithCategory}
                  className="w-full text-xs sm:text-[13px] whitespace-nowrap"
                  sizeConfig={item?.buttonSize}
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default GridCard;
