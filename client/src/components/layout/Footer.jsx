import { Link } from "react-router-dom";
import DisplaySocialLinks from "../common/social/DisplaySocialLinks";
import Logo from "../ui/Logo";
import { FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";

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
  return (
    <footer className="px-4 sm:px-6 lg:px-20 py-4 sm:py-6 lg:py-8 font-inter text-xs sm:text-sm md:text-base">
      {/* Top Section - Responsive layout */}
      <div className="flex flex-row justify-between items-center gap-3 md:gap-0 border-b border-gray-300 pb-3 sm:pb-4">
        <Logo />
        <DisplaySocialLinks socialIcons={socialIcons} />
      </div>

      {/* Bottom Section - Responsive layout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 md:gap-5 pt-5 sm:pt-6 text-[10px] sm:text-xs md:text-sm w-full">
        <div className="flex flex-row items-center gap-2 md:gap-5 text-[#313957] whitespace-nowrap">
          <span className="text-[#A0A0A0]">
            © wemakeover 2025
          </span>
          <div className="flex flex-row items-center gap-2 md:gap-4">
            {legalLinks.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="hover:underline text-[#313957] font-medium whitespace-nowrap"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-[#313957] bg-white rounded px-2 sm:px-3 sm:py-2 flex items-center gap-1 whitespace-nowrap">
          <span>Customer Support:</span>
          <a
            href="tel:+917258858999"
            className="font-semibold text-[#CC2B52] hover:underline"
          >
            +91-7258858999
          </a>
          <span>(09:00 am - 06:00 pm)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
