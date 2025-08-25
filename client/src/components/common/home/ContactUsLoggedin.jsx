import Device from "../../../assets/contact/Device.png"
import DeviceAndroid from "../../../assets/contact/DeviceAndroid.png";

const ContactUsLoggedin = () => {
  return (
    <section
      id="contact-us"
      className="contact-us flex justify-between items-start w-full min-h-[706px] py-[60px] px-20"
    >
      {/* Left side text */}
      <div className="flex flex-col  items-start  h-[506px] justify-center gap-4  font-normal text-[54px] leading-[72px] text-[#212121] w-[728px]">
        <h3 className="text-[#CC2B52] text-xl leading-8 font-medium ">
          Our application for Android & iOS will be releasing soon
        </h3>
        <h4 className="flex items-start text-[40px]">
          Makeover’s application is on the way!
        </h4>
        <p className="text-[18px] font-normal leading-[28px] font-sans">
          We’re busy behind the scenes, crafting the Makeover app for both
          Android and iOS—so your beauty rituals can soon be booked with just a
          tap! ✨ Whether you&apos;re team Apple or Android, we’ve got you
          covered. Stay tuned—your personalized pampering experience is almost
          ready to land in your pocket! 💅📱 We’ll notify you the moment it goes
          live. Until then, keep glowing! 💖
        </p>
      </div>

      {/* Right side form */}
      <div className="relative w-[522px] h-[506px] p-8 bg-white">
        {/* First device */}
        <img
          src={Device}
          className="absolute top-0 left-0 w-[301px] h-[506px]"
          alt=""
        />

        {/* Second device overlapping */}
        <img
          src={DeviceAndroid}
          className="absolute top-0 left-40 w-[301px] h-[506px]"
          alt=""
        />
      </div>
    </section>
  );
}

export default ContactUsLoggedin