import { useNavigate } from "react-router-dom";
import LogoImg from "../../assets/Logo/Logo.png";

const Logo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    // <h1
    //   className="logo text-[#CC2B52] font-syncopate font-bold text-[25px] leading-[26px] w-[171px] h-[26px] uppercase cursor-pointer"
    //   tabIndex={0}
    //   onClick={handleLogoClick}
    //   // role="button"
    // >
    //   MakeOver
    // </h1>
    <div
      onClick={handleLogoClick}
      className="w-[120px] sm:w-[150px] lg:w-[171px] h-[24px] sm:h-[30px] lg:h-[36px] cursor-pointer"
    >
      <img
        src={LogoImg}
        alt="Logo"
        className="w-full h-full object-contain object-center"
      />
    </div>
  );
};

export default Logo;
