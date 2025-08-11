
const AboutUs = () => {
  const info = [
    { number: "10+", detail: "Certified Makeup Professionals" },
    { number: "5+", detail: "Cities in North India" },
    { number: "20+", detail: "Successful Bookings Completed" },
  ];
  return (
    <section className="w-full h-[414px] py-[60px] px-20">
      <div className="about-header text-4xl font-inter leading-[120%] text-[#212121] text-wrap">
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
        <div className="info-container flex justify-between mt-10">
          {info.map((item, index) => (
            <div
              key={index}
              className="info-item flex flex-col items-start gap-4 border-l-[1px] border-[#E1E1E1] p-5"
            >
              <h2 className="text-8xl font-medium text-[#3B486E]">
                {item.number}
              </h2>
              <p className="text-lg font-normal text-[#212121]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutUs