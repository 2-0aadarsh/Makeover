import { motion } from "framer-motion";
import f1 from "../../../assets/feedback/f1.png";
import f2 from "../../../assets/feedback/f2.png";
import f3 from "../../../assets/feedback/f3.png";
import f4 from "../../../assets/feedback/f4.jpg";
import f5 from "../../../assets/feedback/f5.jpg";
import f6 from "../../../assets/feedback/f6.jpg";
import f7 from "../../../assets/feedback/f7.jpg";

const Testimonial = () => {
  const review =
    "“I loved how professional and well-prepared the beautician was—felt like a salon at home!” says one of our happy clients. Another shares, “Makeover is my go-to for last-minute grooming; always on time, clean, and super relaxing.” Many of our customers rave about the convenience: “I booked a facial during my lunch break and came out glowing—without stepping out!” Whether it's bridal services, waxing, or a simple manicure, the feedback is unanimous: Makeover makes self-care seamless, luxurious, and dependable.";

  const imageContainer = [f1, f2, f3, f4, f5, f6, f7];

  // Duplicate images for smooth infinite loop
  const loopImages = [...imageContainer, ...imageContainer];

  return (
    <section id="testimonial" className="w-full py-[60px] px-20">
      <div className="w-full bg-[#3B486E] pl-12 py-9 flex gap-4">
        {/* left-container */}
        <div className="section-header w-1/2 font-sans text-[#FFFFFF] flex flex-col items-start justify-between gap-6">
          <h3 className="text-[20px] text-[#FFB8C9] font-medium capitalize leading-8">
            What our customers say
          </h3>

          <p className="text-[18px] leading-7 font-[300]">{review}</p>
        </div>

        {/* right-container */}
        <div className="section-image w-1/2 font-sans text-[#FFFFFF] flex items-center justify-start overflow-hidden mt-6">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }} // shift left by half width
            transition={{
              ease: "linear",
              duration: 20, // speed (seconds)
              repeat: Infinity,
            }}
          >
            {loopImages.map((img, index) => (
              <div
                key={index}
                className="min-w-[180px] flex items-center justify-center gap-3"
              >
                <div className="border-l-[1px] border-white w-1 h-4/5"></div>
                <img
                  src={img}
                  alt={`testimonial-${index}`}
                  className="w-[90%] h-full object-cover object-center rounded-[400px]"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
