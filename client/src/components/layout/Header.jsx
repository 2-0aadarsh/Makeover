import { NavLink } from "react-router-dom";
import Button from "../ui/Button";
import Logo from "../ui/Logo";

const Header = () => {
  const navigationLinks = [
      {to : "/gallery", linkName : "Gallery"}, 
      {to : "/about", linkName : "About Us"}, 
      {to : "/contact", linkName : "Contact Us"}, 
    ];

  return (
    <nav className="flex justify-between items-center py-4 px-20 text-[#CC2B52] shadow-sm fixed top-0 left-0 right-0 bg-white z-50 ">
      <Logo />

      <div className="nav-links flex gap-[60px]">
        {navigationLinks.map((link, index) => (
          <NavLink to={link.to} key={index} tabIndex={0} className="text-sm">
            {link.linkName}
          </NavLink>
        ))}
      </div>

      <div className="btn">
        <Button content="Register" redirect="/signup" />
      </div>
    </nav>
  );
};

export default Header;
