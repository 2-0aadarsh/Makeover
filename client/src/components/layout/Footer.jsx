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
    <footer className="px-4 sm:px-6 lg:px-20 py-6 sm:py-8 lg:py-10 font-inter text-xs sm:text-sm">
      {/* Top Section - Single line layout */}
      <div className="flex justify-between items-center border-b border-gray-300 pb-3">
        <Logo />

        <DisplaySocialLinks socialIcons={socialIcons} />
      </div>

      {/* Bottom Section - Single line layout */}
      <div className="flex justify-between items-center pt-3 sm:pt-4">
        {/* Left: Copyright and Legal - Single line */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 text-[#313957]">
          <span className="text-[#A0A0A0] whitespace-nowrap">
            © Makeover 2025
          </span>
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

        {/* Right: Customer Support - Single line */}
        <div className="text-[#313957] bg-white rounded px-2 sm:px-3 py-1 text-xs shadow-sm whitespace-nowrap">
          <span className="hidden sm:inline">Customer Support: </span>
          <span className="sm:hidden">Support: </span>
          <span className="font-semibold">+91-8969699521</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
