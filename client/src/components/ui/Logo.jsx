import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import LogoImg from "../../assets/Logo/Logo.png";
import LogoImg from "../../assets/Logo/M1.svg";
import { fetchPublicSiteSettings } from "../../features/admin/siteSettings/siteSettingsThunks";

const Logo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { publicSettings } = useSelector((state) => state.adminSiteSettings);
  
  const [logoUrl, setLogoUrl] = useState(LogoImg);

  // Fetch site settings for logo
  useEffect(() => {
    dispatch(fetchPublicSiteSettings());
  }, [dispatch]);

  // Update logo when settings are loaded
  useEffect(() => {
    if (publicSettings?.branding?.primaryLogo) {
      setLogoUrl(publicSettings.branding.primaryLogo || LogoImg);
    }
  }, [publicSettings]);

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