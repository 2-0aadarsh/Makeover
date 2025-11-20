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
      name: "De-Tan & Bleach",
      image: makeupImg,
      modal: <BleachAndDeTanModal onClose={closeModal} />,
    },
  ];

  return (
    <main
      id="hero"
      className="w-full flex flex-col lg:flex-row min-h-[350px] sm:min-h-[450px] md:min-h-[750px] lg:h-[700px] lg:items-center lg:justify-between"
    >
      {/* Hero Image Section - Mobile/Tablet: Full width, Desktop: Left half */}
      <div className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:w-1/2 lg:h-full flex items-center justify-center order-1 lg:order-1">
        <img
          src={heroImg}
          alt="Hero"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content Section - Mobile/Tablet: Full width, Desktop: Right half */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 lg:px-20 py-8 lg:py-0 order-2 lg:order-2">
        <div className="w-full flex flex-col items-center justify-center gap-6 lg:gap-4">
          {/* Header Section */}
          <div className="header flex flex-col items-start justify-center gap-4 text-left">
            <h1 className="title font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-[38px] text-[#CC2B52] leading-tight lg:leading-[100%]">
              Professional Makeup & Grooming at your Doorstep!
            </h1>
            <p className="description font-normal text-base sm:text-lg leading-relaxed lg:leading-[26px] text-[#292929] max-w-lg">
              We bring professional makeup and grooming essential services to
              you at a very friendly price
            </p>
          </div>

          {/* Services Section */}
          <div className="service-container w-full">
            <div className="services grid grid-cols-3 gap-3 sm:gap-4 lg:gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="service-item flex flex-col items-center justify-center p-2 sm:p-3 border rounded-xl shadow-md w-full h-32 sm:h-36 md:h-40 lg:w-40 lg:h-40 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => setActiveModalId(service.id)}
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-20 lg:h-20 object-cover mb-1 sm:mb-2"
                  />
                  <p className="service-name text-center text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-tight">
                    {service.name}
                  </p>
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
