/* eslint-disable react/prop-types */

const GridCard = ({ gridCardData }) => {
  console.log("gridcard data :", gridCardData);

  return (
    <>
      {gridCardData.map((item, index) => (
        <div
          key={index}
          className="w-[496px] h-[132px] py-4 px-6 rounded-xl shadow-md flex  gap-3"
        >
          <div className="card-content w-[450px] h-[97px] flex items-center justify-between">
            <div className="img-container w-[80px] h-full rounded-xl overflow-hidden">
              <img
                src={item.img}
                className="w-full h-full object-cover"
                alt={item.cardHeader}
              />
            </div>

            <div className="card-descriptions flex flex-col w-[232px] justify-between gap-1">
              <div className="card-header text-[16px] font-semibold tracking-normal">
                {item.cardHeader}
              </div>
              <div className="card-description text-[12px] text-[#3C3C43]">
                {item.description}
              </div>
              <div className="card-pricing text-[16px] font-semibold flex items-center justify-between">
                <div className="price ">
                  ₹ {item.price}
                  {item.taxIncluded && <span className="text-[10px] font-normal ml-1" >Including taxes</span>}
                </div>
                <div className="time">{item.duration}</div>
              </div>
            </div>

            <button className="button px-4 py-2 bg-[#CC2B52] flex text-[12px] text-white rounded-xl">
              {item.button}
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default GridCard;
