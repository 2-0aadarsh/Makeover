const AboutUs = () => {
  const info = [
    { number: "10+", detail: "Certified Makeup Professionals" },
    { number: "5+", detail: "Cities in North India" },
    { number: "100+", detail: "bookings completed" },
  ];
  return (
    <section className="w-full min-h-[414px] py-4 sm:py-6 md:py-8 lg:py-[60px] px-4 sm:px-8 md:px-12 lg:px-20">
      {/* Mobile: Our Milestones Header */}
      <div className="lg:hidden mb-8">
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
        <div className="info-container flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 lg:mt-10 gap-4 sm:gap-0">
          {info.map((item, index) => (
            <div
              key={index}
              className="info-item flex flex-col items-start gap-2 sm:gap-4 border-l-[1px] border-[#E1E1E1] p-3 sm:p-4 lg:p-5 w-full sm:w-auto"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-medium text-[#3B486E]">
                {item.number}
              </h2>
              <p className="text-sm sm:text-base md:text-lg font-normal text-[#212121] leading-tight">
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
