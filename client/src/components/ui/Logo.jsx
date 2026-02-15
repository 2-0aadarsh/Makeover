import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicSiteSettings } from "../../features/admin/siteSettings/siteSettingsThunks";

const Logo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { publicSettings } = useSelector((state) => state.adminSiteSettings);
  const prevLogoUrlRef = useRef("");

  const [logoUrl, setLogoUrl] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchPublicSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    const url = publicSettings?.branding?.primaryLogo ?? "";
    const next = typeof url === "string" ? url : "";
    const urlChanged = prevLogoUrlRef.current !== next;
    prevLogoUrlRef.current = next;
    setLogoUrl(next);
    if (urlChanged) setImageLoaded(false);
  }, [publicSettings]);

  const handleLogoClick = () => {
    navigate("/");
  };

  const showImage = logoUrl && logoUrl.trim();

  return (
    <div
      onClick={handleLogoClick}
      className="w-[120px] sm:w-[150px] lg:w-[171px] h-[24px] sm:h-[30px] lg:h-[36px] cursor-pointer flex items-center"
    >
      {showImage ? (
        <img
          src={logoUrl}
          alt=""
          className={`w-full h-full object-contain object-left transition-opacity duration-150 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
      ) : null}
    </div>
  );
};

export default Logo;