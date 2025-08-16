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
    <footer className="px-10 md:px-20 py-10 font-inter text-sm">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-300 pb-3">
        <Logo />

        <DisplaySocialLinks socialIcons={socialIcons} />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-4 gap-4">
        {/* Left: Copyright and Legal */}
        <div className="flex items-center gap-6 flex-wrap text-[#313957]">
          <span className="text-[#A0A0A0]">© Makeover 2025</span>
          {legalLinks.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="hover:underline text-[#313957] font-medium"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Right: Customer Support */}
        <div className="text-[#313957] bg-white rounded px-3 py-1 text-xs shadow-sm">
          Customer Support:
          <span className="font-semibold">+91-8969699521</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
