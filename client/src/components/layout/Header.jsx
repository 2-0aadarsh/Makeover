import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Link as ScrollLink, scroller } from "react-scroll";
import { useSelector } from "react-redux";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import ProfileButton from "../ui/ProfileButton";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollOrNavigate = (sectionId) => {
    if (location.pathname === "/") {
      // Already on home page → just scroll
      scroller.scrollTo(sectionId, {
        smooth: true,
        duration: 800,
        offset: -100, // Adjust for sticky header
      });
    } else {
      // Navigate to home, then scroll after page load
      navigate("/", { replace: false });
      setTimeout(() => {
        scroller.scrollTo(sectionId, {
          smooth: true,
          duration: 800,
          offset: -100,
        });
      }, 100); // small delay for home to mount
    }
  };

  const navigationLinks = [
    { type: "scroll", to: "gallery", linkName: "Gallery" },
    { type: "route", to: "/about", linkName: "About Us" },
    ...(isAuthenticated
      ? [{ type: "route", to: "/myBookings", linkName: "My Bookings" }]
      : []),
    { type: "scroll", to: "contact-us", linkName: "Contact Us" },
  ];

  return (
    <nav className="flex justify-between items-center py-6 px-20 text-[#CC2B52] shadow-sm fixed top-0 left-0 right-0 bg-white z-50">
      <Logo />

      <div className="nav-links flex gap-[60px]">
        {navigationLinks.map((link, index) =>
          link.type === "route" ? (
            <NavLink
              to={link.to}
              key={index}
              className={({ isActive }) =>
                `text-lg font-semibold font-inter relative pb-1 transition-all border-b-2 ${
                  isActive
                    ? "border-[#CC2B52]"
                    : "border-transparent hover:border-[#CC2B52]"
                }`
              }
            >
              {link.linkName}
            </NavLink>
          ) : (
            <span
              key={index}
              onClick={() => handleScrollOrNavigate(link.to)}
              className="cursor-pointer text-lg font-semibold font-inter pb-1 border-b-2 border-transparent hover:border-[#CC2B52] transition-all"
            >
              {link.linkName}
            </span>
          )
        )}
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
