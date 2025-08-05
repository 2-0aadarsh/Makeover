import heroImg from "../../../assets/hero/Hero.jpg";
import artistImg from "../../../assets/hero/artist.png";
import faceFoundationImg from "../../../assets/hero/faceFoundation.png";
import tattooImg from "../../../assets/hero/tattoo.png";
import naturalIngridentsImg from "../../../assets/hero/naturalIngridents.png";
import primerImg from "../../../assets/hero/primer.png";
import makeupImg from "../../../assets/hero/Makeup.png";


const Hero = () => {
  const services = [
    { id: 1, name: "Professional Makeup", image: artistImg },
    { id: 2, name: "Cleanup & Facial", image: faceFoundationImg },
    { id: 3, name: "Professional Mehendi", image: tattooImg },
    { id: 4, name: "Waxing", image: naturalIngridentsImg },
    { id: 5, name: "Manicure & Pedicure", image: primerImg },
    { id: 5, name: "Bleach & De-Tan", image: makeupImg },
  ];

  return (
    <main className="hero w-full h-[700px] flex items-center justify-between">
      <div className="left w-1/2 h-full flex items-center justify-center ">
        <img src={heroImg} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="right  w-1/2 h-full flex flex-col items-center justify-center ">
        <div className="w-[80%] h-[85%] flex flex-col items-center justify-center gap-4 ">
          <div className="header flex flex-col items-start justify-center gap-4">
            <h1 className="title font-semibold text-[38px] text-[#CC2B52] leading-[100%] ">
              Professional Makeup & Grooming at your Doorstep!
            </h1>

            <p className="decription font-normal text-lg leading-[26px] text-[#292929] ">
              We bring professional makeup and grooming essential services to
              you at a very friendly price
            </p>
          </div>

          <div className="service-container w-full ">
            <div className="services grid grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="service-item flex flex-col items-center justify-center p-3 border rounded-xl shadow-md w-40 h-40"
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
    </main>
  );
}

export default Hero