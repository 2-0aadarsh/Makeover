/* eslint-disable react/prop-types */

const GridCard = ({ gridCardData }) => {
  return (
    <>
      {gridCardData.map((item, index) => (
        <div
          key={index}
          className="w-full h-auto min-h-[120px] sm:min-h-[132px] lg:h-[132px] py-3 sm:py-4 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl shadow-md flex gap-2 sm:gap-3 lg:gap-3 bg-white"
        >
          <div className="card-content w-full h-auto lg:h-[97px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 lg:gap-0">
            <div className="img-container w-[60px] sm:w-[70px] lg:w-[80px] h-[60px] sm:h-[70px] lg:h-full rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={item.img}
                className="w-full h-full object-cover"
                alt={item.cardHeader}
              />
            </div>

            <div className="card-descriptions flex flex-col w-full sm:w-[200px] lg:w-[232px] justify-between gap-1 sm:gap-1 lg:gap-1">
              <div className="card-header text-sm sm:text-[15px] lg:text-[16px] font-semibold tracking-normal leading-tight">
                {item.cardHeader}
              </div>
              <div className="card-description text-xs sm:text-[11px] lg:text-[12px] text-[#3C3C43] leading-relaxed">
                {item.description}
              </div>
              <div className="card-pricing text-sm sm:text-[15px] lg:text-[16px] font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0">
                <div className="price flex flex-col sm:flex-row items-start sm:items-center gap-1">
                  <span>₹ {item.price}</span>
                  {item.taxIncluded && (
                    <span className="text-[9px] sm:text-[10px] lg:text-[10px] font-normal">
                      Including taxes
                    </span>
                  )}
                </div>
                <div className="time text-xs sm:text-sm lg:text-sm">
                  {item.duration}
                </div>
              </div>
            </div>

            <button className="button px-3 sm:px-4 lg:px-4 py-2 sm:py-2 lg:py-2 bg-[#CC2B52] flex text-[10px] sm:text-[11px] lg:text-[12px] text-white rounded-xl hover:bg-[#CC2B52]/90 transition-colors whitespace-nowrap">
              {item.button}
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default GridCard;
