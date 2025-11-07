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
      <div className="flex flex-row justify-between items-end gap-3 md:gap-0 pt-3 sm:pt-4 ">
        {/* Left: Copyright and Legal */}
        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4 lg:gap-6 text-[#313957]">
          <span className="text-[#A0A0A0] whitespace-nowrap text-xs sm:text-sm md:text-base">
            © Wemakeover 2025
          </span>
          <div className="flex items-center gap-2 md:gap-4">
            {legalLinks.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="hover:underline text-[#313957] font-medium whitespace-nowrap text-center text-xs sm:text-sm md:text-base"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Customer Support */}
        <div className="text-[#313957] bg-white rounded px-2 sm:px-3 sm:py-2 whitespace-nowrap text-xs sm:text-sm md:text-base">
          <span className="hidden sm:inline">Customer Support: </span>
          <span className="sm:hidden">Support: </span>
          <span className="font-semibold">+91-8969699521</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
