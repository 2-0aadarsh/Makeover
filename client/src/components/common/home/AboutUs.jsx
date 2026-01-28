const AboutUs = () => {
  const info = [
    { number: "10+", detail: "Certified Makeup Professionals" },
    { number: "5+", detail: "Cities in North India" },
    { number: "100+", detail: "bookings completed" },
  ];
  return (
    <section className="w-full md:min-h-[214px] lg:min-h-[414px] py-6 sm:py-4 md:py-6 lg:py-[60px] px-4 sm:px-6 md:px-8 lg:px-20">
      {/* Mobile: Our Milestones Header */}
      <div className="lg:hidden mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#CC2B52] text-left">
          Our Milestones
        </h2>
      </div>

      {/* Desktop: Original Header */}
      <div className="hidden lg:block about-header text-4xl font-inter leading-[120%] text-[#212121] text-wrap">
        <span className="font-extrabold text-[#CC2B52] italic mr-1">
          Free 10 mins face massage
        </span>
        <span className=" font-normal mr-2">
          on every booking for our loving customers on order above
        </span>
        <strong className="font-extrabold mr-2 ">₹1499.</strong>
        <span>Free Eyebrow threading on all facial bookings!</span>
      </div>

      <div className="service-info">
        <div className="info-container flex justify-between items-start mt-3 sm:mt-4 md:mt-6 lg:mt-10 gap-2 sm:gap-3 md:gap-4 lg:gap-10 xl:gap-12">
          {info.map((item, index) => (
            <div
              key={index}
              className="info-item flex flex-col items-start gap-2 sm:gap-3 md:gap-4 border-l-[1px] border-[#E1E1E1] pl-3 sm:pl-4 md:pl-5 lg:pl-6 flex-1"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-medium text-[#3B486E] leading-none">
                {item.number}
              </h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-normal text-[#212121] leading-tight">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
