import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DisplaySocialLinks from "../common/social/DisplaySocialLinks";
import Logo from "../ui/Logo";
import { FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";
import {
  selectServiceableCities,
  selectCitiesLoading,
  selectCitiesError,
  selectIsCacheValid,
} from "../../features/serviceability/serviceabilitySlice";
import { fetchServiceableCities } from "../../features/serviceability/serviceabilityThunks";
import ServiceableCitiesModal from "../modals/ServiceableCitiesModal";

const socialIcons = [
  { id: 1, icon: <FaXTwitter />, link: "https://www.twitter.com" },
  { id: 2, icon: <FaInstagram />, link: "https://www.instagram.com" },
  { id: 3, icon: <FaLinkedin />, link: "https://www.linkedin.com" },
];

const legalLinks = [
  { title: "Privacy Policy", link: "/privacy-policy" },
  { title: "Terms & Conditions", link: "/terms-and-conditions" },
];

const Footer = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cities = useSelector(selectServiceableCities);
  const loading = useSelector(selectCitiesLoading);
  const error = useSelector(selectCitiesError);
  const isCacheValid = useSelector(selectIsCacheValid);

  useEffect(() => {
    if (!isCacheValid && !loading) {
      dispatch(fetchServiceableCities());
    }
  }, [dispatch, isCacheValid, loading]);

  const cityCountText = cities.length === 0 ? "" : cities.length === 1 ? "1 city" : `${cities.length} cities`;

  return (
    <>
      <footer className="px-4 sm:px-6 lg:px-20 py-4 sm:py-6 lg:py-8 font-inter text-xs sm:text-sm md:text-base">
        <div className="flex flex-row justify-between items-center gap-3 md:gap-0 border-b border-gray-300 pb-3 sm:pb-4">
          <Logo />
          <DisplaySocialLinks socialIcons={socialIcons} />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 md:gap-5 pt-5 sm:pt-6 text-[10px] sm:text-xs md:text-sm w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-5 text-[#313957]">
            <span className="text-[#A0A0A0]">© wemakeover 2025</span>
            <div className="flex flex-row items-center gap-2 md:gap-4 flex-wrap">
              {legalLinks.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="hover:underline text-[#313957] font-medium whitespace-nowrap"
                >
                  {item.title}
                </Link>
              ))}
              {!loading && !error && cities.length > 0 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="hover:underline text-[#313957] font-medium whitespace-nowrap flex items-center gap-1.5 group"
                >
                  <svg className="w-3 h-3 text-[#CC2B52]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Service areas</span>
                  <span className="text-[10px] text-[#CC2B52] bg-red-50/80 px-1.5 py-0.5 rounded-full">
                    {cityCountText}
                  </span>
                </button>
              )}
            </div>
          </div>
          <div className="text-[#313957] bg-white rounded px-2 sm:px-3 sm:py-2 flex items-center gap-1 whitespace-nowrap">
            <span>Customer Support:</span>
            <a href="tel:+917258858999" className="font-semibold text-[#CC2B52] hover:underline">
              +91-7258858999
            </a>
            <span>(09:00 am - 06:00 pm)</span>
          </div>
        </div>
      </footer>

      <ServiceableCitiesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cities={cities}
        loading={loading}
        error={!!error}
      />
    </>
  );
};

export default Footer;
