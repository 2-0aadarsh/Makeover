import Device from "../../../assets/contact/Device.png";
import DeviceAndroid from "../../../assets/contact/DeviceAndroid.png";

const ContactUsLoggedin = () => {
  return (
    <section
      id="contact-us"
      className="contact-us flex flex-col lg:flex-row justify-evenly sm:justify-between items-start w-full sm:min-h-[400px] md:min-h-[706px] py-2 sm:py-4 md:py-6 lg:py-[60px] px-4 sm:px-8 md:px-12 lg:px-20 gap-4 sm:gap-6 md:gap-8 lg:gap-0"
    >
      {/* Left side text */}
      <div className="flex flex-col items-start h-auto lg:h-[506px] justify-center gap-3 sm:gap-4 md:gap-5 font-normal text-xl sm:text-2xl md:text-3xl lg:text-[54px] leading-tight sm:leading-relaxed lg:leading-[72px] text-[#212121] w-full lg:w-[728px]">
        <h3 className="text-[#CC2B52] text-base sm:text-lg lg:text-xl leading-5 sm:leading-6 lg:leading-8 font-medium">
          Our application for Android & iOS will be releasing soon
        </h3>
        <h4 className="flex items-start text-lg sm:text-xl md:text-2xl lg:text-[40px]">
          Wemakeover&apos;s application is on the way!
        </h4>
        <p className="text-xs sm:text-sm md:text-base lg:text-[18px] font-normal leading-relaxed lg:leading-[28px] font-sans">
          We&apos;re busy behind the scenes, crafting the Wemakeover app for
          both Android and iOS, so your beauty rituals can soon be booked with
          just a tap! ✨ Whether you&apos;re team Apple or Android, we&apos;ve
          got you covered. Stay tuned, your personalized pampering experience is
          almost ready to land in your pocket! 💅📱 We&apos;ll notify you the
          moment it goes live. Until then, keep glowing! 💖
        </p>
      </div>

      {/* Right side form */}
      <div className="relative w-full lg:w-[522px] h-[300px] sm:h-[400px] md:h-[450px] lg:h-[506px] p-3 sm:p-4 md:p-6 lg:p-8 bg-white overflow-hidden">
        {/* First device */}
        <img
          src={Device}
          className="absolute top-0 left-0 w-[200px] sm:w-[250px] md:w-[280px] lg:w-[301px] h-[300px] sm:h-[400px] md:h-[450px] lg:h-[506px] object-contain"
          alt=""
        />

        {/* Second device overlapping */}
        <img
          src={DeviceAndroid}
          className="absolute top-0 left-[120px] sm:left-[160px] md:left-[180px] lg:left-40 w-[200px] sm:w-[250px] md:w-[280px] lg:w-[301px] h-[300px] sm:h-[400px] md:h-[450px] lg:h-[506px] object-contain"
          alt=""
        />
      </div>
    </section>
  );
};

export default ContactUsLoggedin;
