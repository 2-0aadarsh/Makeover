/* eslint-disable react/prop-types */

const FlexCard = ({item}) => {
  return (
    <div className="flex flex-col gap-[10px] p-6 h-[392px] w-[304px] rounded-xl shadow-xl">
      <div className="w-[256px] h-[344px] flex flex-col gap-6 ">
        {/*image-container*/}
        <div className="image-container h-[256px] rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src={item.img}
            className="w-full h-full object-cover object-center"
            alt="bridal-img"
          />
        </div>

        <div className="card-decription font-inter flex flex-col gap-[6px] items-start">
          <h2 className="font-medium text-lg text-black">{item.cardHeader}</h2>

          <p className="description text-sm font-normal text-[#666666]">
            {item.description}
          </p>

          <p className="price text-sm font-semibold text-[#3C3C43]">
            {Object.keys(item)[-1]} : {item.PriceEstimate}
          </p>
        </div>

        {/* car-button */}
        <button className="button w-full font-semibold text-sm flex flex-col items-center justify-center text-[#FFFFFF] bg-[#CC2B52] rounded-3xl px-3 py-2 cursor-pointer">
          Enquiry Now
        </button>
      </div>
    </div>
  );
}

export default FlexCard