import { useState } from "react";
import heroImg from "../../../assets/hero/Hero.jpg";
import artistImg from "../../../assets/hero/artist.png";
import faceFoundationImg from "../../../assets/hero/faceFoundation.png";
import tattooImg from "../../../assets/hero/tattoo.png";
import naturalIngridentsImg from "../../../assets/hero/naturalIngridents.png";
import primerImg from "../../../assets/hero/primer.png";
import makeupImg from "../../../assets/hero/makeup.png";

import ProfessionalMakeup from "../../modals/heroModals/ProfessionalMakeup";
import CleanupAndFacialModal from "../../modals/heroModals/CleanupAndFacialModal";
import ProfessionalMehendiModal from "../../modals/heroModals/ProfessionalMehendiModal";
import WaxingModal from "../../modals/heroModals/WaxingModal";
import ManicureAndPedicureModal from "../../modals/heroModals/ManicureAndPedicureModal";
import BleachAndDeTanModal from "../../modals/heroModals/BleachAndDeTanModal";

const Hero = () => {
  const [activeModalId, setActiveModalId] = useState(null);

  const closeModal = () => setActiveModalId(null);

  const services = [
    {
      id: 1,
      name: "Professional Makeup",
      image: artistImg,
      modal: <ProfessionalMakeup onClose={closeModal} />,
    },
    {
      id: 2,
      name: "Cleanup & Facial",
      image: faceFoundationImg,
      modal: <CleanupAndFacialModal onClose={closeModal} />,
    },
    {
      id: 3,
      name: "Professional Mehendi",
      image: tattooImg,
      modal: <ProfessionalMehendiModal onClose={closeModal} />,
    },
    {
      id: 4,
      name: "Waxing",
      image: naturalIngridentsImg,
      modal: <WaxingModal onClose={closeModal} />,
    },
    {
      id: 5,
      name: "Mani/Pedi & Massage",
      image: primerImg,
      modal: <ManicureAndPedicureModal onClose={closeModal} />,
    },
    {
      id: 6,
      name: "Detan & Bleach",
      image: makeupImg,
      modal: <BleachAndDeTanModal onClose={closeModal} />,
    },
  ];

  return (
    <main
      id="hero"
      className="w-full flex flex-col lg:flex-row min-h-[350px] sm:min-h-[450px] md:min-h-[550px] lg:h-[700px] lg:items-center lg:justify-between"
    >
      {/* Hero Image Section */}
      <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:w-1/2 lg:h-full flex items-center justify-center order-1 lg:order-1">
        <img
          src={heroImg}
          alt="Hero"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 md:py-10 lg:py-12 order-2 lg:order-2">
        <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {/* Header Section */}
          <div className="header flex flex-col items-start justify-center gap-3 sm:gap-4 md:gap-4 text-left w-full">
            <h1 className="title font-semibold text-2xl sm:text-3xl md:text-[32px] lg:text-[38px] xl:text-[42px] text-[#CC2B52] leading-tight lg:leading-[110%]">
              Professional Makeup & Grooming at your Doorstep!
            </h1>
            <p className="description font-normal text-base sm:text-lg md:text-[17px] lg:text-xl leading-relaxed lg:leading-[28px] text-[#292929] max-w-2xl">
              We bring professional makeup and grooming essential services to
              you at a very friendly price
            </p>
          </div>

          {/* Services Section - Optimized for tablet */}
          <div className="service-container w-full max-w-4xl">
            <div className="services grid grid-cols-3 gap-3 sm:gap-4 md:gap-4 lg:gap-5 xl:gap-6 w-full">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="service-item flex flex-col items-center justify-center p-2 sm:p-3 md:p-3 lg:p-4 border rounded-xl shadow-md w-full aspect-square max-w-full cursor-pointer hover:shadow-lg transition-all duration-200 bg-white"
                  onClick={() => setActiveModalId(service.id)}
                >
                  {/* Image container with tablet-optimized sizing */}
                  <div className="flex-1 flex items-center justify-center mb-1 sm:mb-1 md:mb-2 w-full">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-20 md:h-20 lg:w-16 lg:h-16 xl:w-18 xl:h-18 object-contain flex-shrink-0"
                    />
                  </div>

                  {/* Service name with tablet-optimized text */}
                  <div className="w-full flex-shrink-0 px-1">
                    <p className="service-name text-center text-xs sm:text-xs md:text-lg lg:text-base font-medium leading-tight text-gray-800 break-words hyphens-auto line-clamp-2">
                      {service.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Render the active modal if set */}
      {services.map(
        (service) =>
          service.id === activeModalId && (
            <div
              key={service.id}
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
              onClick={closeModal}
            >
              {service.modal}
            </div>
          )
      )}
    </main>
  );
};

export default Hero;