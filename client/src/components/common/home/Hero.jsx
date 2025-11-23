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

  const handleServiceChange = (serviceId) => {
    setActiveModalId(serviceId);
  };

  // Define services list for dropdown
  const servicesList = [
    { id: 1, name: "Professional Makeup" },
    { id: 2, name: "Cleanup & Facial" },
    { id: 3, name: "Professional Mehendi" },
    { id: 4, name: "Waxing" },
    { id: 5, name: "Mani/Pedi & Massage" },
    { id: 6, name: "Detan & Bleach" },
  ];

  const services = [
    {
      id: 1,
      name: "Professional Makeup",
      image: artistImg,
      modal: <ProfessionalMakeup onClose={closeModal} services={servicesList} currentServiceId={1} onServiceChange={handleServiceChange} />,
    },
    {
      id: 2,
      name: "Cleanup & Facial",
      image: faceFoundationImg,
      modal: <CleanupAndFacialModal onClose={closeModal} services={servicesList} currentServiceId={2} onServiceChange={handleServiceChange} />,
    },
    {
      id: 3,
      name: "Professional Mehendi",
      image: tattooImg,
      modal: <ProfessionalMehendiModal onClose={closeModal} services={servicesList} currentServiceId={3} onServiceChange={handleServiceChange} />,
    },
    {
      id: 4,
      name: "Waxing",
      image: naturalIngridentsImg,
      modal: <WaxingModal onClose={closeModal} services={servicesList} currentServiceId={4} onServiceChange={handleServiceChange} />,
    },
    {
      id: 5,
      name: "Mani/Pedi & Massage",
      image: primerImg,
      modal: <ManicureAndPedicureModal onClose={closeModal} services={servicesList} currentServiceId={5} onServiceChange={handleServiceChange} />,
    },
    {
      id: 6,
      name: "Detan & Bleach",
      image: makeupImg,
      modal: <BleachAndDeTanModal onClose={closeModal} services={servicesList} currentServiceId={6} onServiceChange={handleServiceChange} />,
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
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-[clamp(1rem,4vw,5rem)] py-[clamp(2rem,5vw,3rem)] lg:py-0 order-2 lg:order-2">
        <div className="w-full flex flex-col items-center justify-center gap-[clamp(1.5rem,4vw,2rem)]">
          {/* Header Section */}
          <div className="header flex flex-col items-start justify-center gap-[clamp(1rem,3vw,1.5rem)] text-left w-full">
            <h1 className="title font-semibold text-[clamp(1.5rem,4vw,2.375rem)] text-[#CC2B52] leading-tight">
              Professional Makeup & Grooming at your Doorstep!
            </h1>
            <p className="description font-normal text-[clamp(0.875rem,2vw,1.125rem)] leading-relaxed text-[#292929] max-w-lg">
              We bring professional makeup and grooming essential services to
              you at a very friendly price
            </p>
          </div>

          {/* Services Section */}
          <div className="service-container w-full">
            <div className="services grid grid-cols-3 gap-[clamp(0.75rem,2vw,1.5rem)]">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="service-item flex flex-col items-center justify-center p-[clamp(0.5rem,2vw,1rem)] border rounded-xl shadow-md w-full aspect-square cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => setActiveModalId(service.id)}
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-[clamp(3rem,8vw,5rem)] h-[clamp(3rem,8vw,5rem)] object-cover mb-[clamp(0.25rem,1vw,0.5rem)]"
                  />
                  <p className="service-name text-center text-[clamp(0.75rem,1.5vw,1.125rem)] font-medium leading-tight">
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
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50 p-[clamp(0.5rem,2vw,1rem)]"
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
