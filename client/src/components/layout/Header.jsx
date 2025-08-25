import { NavLink } from "react-router-dom";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import { useSelector } from "react-redux";
import ProfileButton from "../ui/ProfileButton";

const Header = () => {

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navigationLinks = [
    { to: "/gallery", linkName: "Gallery" },
    { to: "/about", linkName: "About Us" },
    ...(isAuthenticated
      ? [{ to: "/myBookings", linkName: "My Bookings" }]
      : []),
    { to: "/contact", linkName: "Contact Us" },
  ];

  return (
    <nav className="flex justify-between items-center py-6 px-20 text-[#CC2B52] shadow-sm fixed top-0 left-0 right-0 bg-white z-50 ">
      <Logo />

      <div className="nav-links flex gap-[60px]">
        {navigationLinks.map((link, index) => (
          <NavLink
            to={link.to}
            key={index}
            tabIndex={0}
            className={({ isActive }) =>
              `text-lg leading-6 font-semibold font-inter relative pb-1 transition-all border-b-2 
              ${
                isActive ? "border-[#CC2B52]" : "border-transparent hover:border-[#CC2B52]"
              }`
            }
          >
            {link.linkName}
          </NavLink>
        ))}
      </div>

      <div className="btn">
        {isAuthenticated ? (
          <ProfileButton username={user.name} />
        ) : (
          <Button content="Login/Register" redirect="/auth/signup" />
        )}
      </div>
    </nav>
  );
};

export default Header;
