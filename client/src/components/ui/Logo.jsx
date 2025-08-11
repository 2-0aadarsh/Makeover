import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");  
  }

  return (
    <h1
<<<<<<< Updated upstream
      className="logo text-[#CC2B52] font-syncopate font-bold text-[25px] leading-[26px] w-[171px] h-[26px]  cursor-pointer"
=======
      className="logo text-[#CC2B52] font-syncopate font-bold text-[25px] leading-[26px] w-[171px] h-[26px] uppercase cursor-pointer"
>>>>>>> Stashed changes
      tabIndex={0}
      onClick={handleLogoClick}
      // role="button"
    >
      MakeOver
    </h1>
  );
}

export default Logo