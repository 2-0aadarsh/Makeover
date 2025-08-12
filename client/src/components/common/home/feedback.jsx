import { Feedback } from "react-icons/fc";
import f1 from Client/src/assets/feedback/f1.png;
import f2 from Client/src/assets/feedback/f2.png;
import f3 from Client/src/assets/feedback/f3.png;
import f4 from Client/src/assets/feedback/f4.jpg;
import f5 from Client/src/assets/feedback/f5.jpg;
import f6 from Client/src/assets/feedback/f6.jpg;
import f7 from Client/src/assets/feedback/f7.jpg;




const Feedback = () => {
  return (
    <div class = "w-full">
        <div class="bg-[#3B486E] md:pt-[30px] pb-4 lg:pl-[60px] md:pb-[62.75px] ">
            <div class="grid grid-col-1 md:grid md:grid-col-12 md:gap-10">
                <div class="md:col-span-6">
                    <div class = "p-4flex flex-col md:px-5 md:py-0">
                        <span class="text-[#E2B6C1] text-sm sm:text-xl font-semibold">What Our Customers Say</span>
                        <span class="pt-6 sm:pt-2 text-white text-xs sm:text-lg font-normal">
                           What Our Customers Say “I loved how professional and well-prepared the beautician was—felt like a salon at home!” says one of our happy clients.
                           Another shares, “Makeover is my go-to for last-minute grooming; always on time, clean, and super relaxing.” Many of our customers rave about the convenience:
                          “I booked a facial during my lunch break and came out glowing—without stepping out!” Whether it's bridal services, waxing, or a simple manicure, the feedback is unanimous:
                           Makeover makes self-care seamless, luxurious, and dependable.
                        </span>
                    </div>
                </div>
                <div class="px-4 sm:px-0 sm:overflow-hidden md:col-span-6 flexitems-centre">
                    <div class="scroll-item">
                        <img  alt="imag-0" class="mx-2 sm:h-[175px]" loading="lazy" src={f1}/>
                    </div>
                    <div class="scroll-item">
                        <img  alt="imag-1" class="mx-2 sm:h-[175px]" loading="lazy" src={f2}/>
                    </div>  
                    <div class="scroll-item">
                        <img  alt="imag-2" class="mx-2 sm:h-[175px]" loading="lazy" src={f3}/>
                    </div>  
                    <div class="scroll-item">
                        <img  alt="imag-3" class="mx-2 sm:h-[175px]" loading="lazy" src={f4}/>
                    </div>  
                    <div class="scroll-item">
                        <img  alt="imag-4" class="mx-2 sm:h-[175px]" loading="lazy" src={f5}/>
                    </div>  
                    <div class="scroll-item">
                        <img  alt="imag-5" class="mx-2 sm:h-[175px]" loading="lazy" src={f6}/>
                    </div>  
                     <div class="scroll-item">
                        <img  alt="imag-6" class="mx-2 sm:h-[175px]" loading="lazy" src={f7}/>
                    </div>  
                </div>
             </div>
        </div>
    </div>                 

  );
}

export default Feedback

