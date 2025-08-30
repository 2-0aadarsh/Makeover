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
      name: "Manicure & Pedicure",
      image: primerImg,
      modal: <ManicureAndPedicureModal onClose={closeModal} />,
    },
    {
      id: 6,
      name: "Bleach & De-Tan",
      image: makeupImg,
      modal: <BleachAndDeTanModal onClose={closeModal} />,
    },
  ];

  return (
    <main
      id="hero"
      className=" w-full h-[700px] flex items-center justify-between "
    >
      <div className="left w-1/2 h-full flex items-center justify-center ">
        <img src={heroImg} alt="Hero" className="w-full h-full object-cover" />
      </div>

      <div className="right w-1/2 h-full flex flex-col items-center justify-center ">
        <div className="w-[80%] h-[85%] flex flex-col items-center justify-center gap-4 ">
          <div className="header flex flex-col items-start justify-center gap-4">
            <h1 className="title font-semibold text-[38px] text-[#CC2B52] leading-[100%] ">
              Professional Makeup & Grooming at your Doorstep!
            </h1>
            <p className="description font-normal text-lg leading-[26px] text-[#292929] ">
              We bring professional makeup and grooming essential services to
              you at a very friendly price
            </p>
          </div>

          <div className="service-container w-full">
            <div className="services grid grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="service-item flex flex-col items-center justify-center p-3 border rounded-xl shadow-md w-40 h-40 cursor-pointer"
                  onClick={() => setActiveModalId(service.id)}
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-20 h-20 object-cover mb-2"
                  />
                  <p className="service-name text-center text-lg font-medium">
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
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50"
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
