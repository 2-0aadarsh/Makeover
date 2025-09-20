import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import { useSelector } from "react-redux";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import ProfileButton from "../ui/ProfileButton";
import CartButton from "../ui/CartButton";
import LocationDisplay from "../ui/LocationDisplay";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  // Note: Navigation links are now shown on all pages including booking

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
    { type: "scroll", to: "contact-us", linkName: "Contact Us" },
    ...(isAuthenticated
      ? [{ type: "route", to: "/myBookings", linkName: "My Bookings" }]
      : []),
  ];

  return (
    <nav className="flex justify-between items-center py-4 px-4 md:px-8 lg:px-20 text-[#CC2B52] shadow-sm fixed top-0 left-0 right-0 bg-white z-50">
      {/* Logo - Always visible on all screen sizes */}
      <Logo />

      {/* LARGE SCREEN LAYOUT (lg and above) */}
      <div className="hidden lg:flex lg:items-center lg:flex-1 lg:justify-center">
        {/* Navigation Links - Show on all pages */}
        <div className="nav-links flex gap-8 xl:gap-12">
          {navigationLinks.map((link, index) =>
            link.type === "route" ? (
              <NavLink
                to={link.to}
                key={index}
                className={({ isActive }) =>
                  `font-inter font-semibold relative pb-1 transition-all border-b-2 text-base ${
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
                className="cursor-pointer font-inter font-semibold pb-1 border-b-2 border-transparent hover:border-[#CC2B52] transition-all text-base"
              >
                {link.linkName}
              </span>
            )
          )}
        </div>
      </div>

      {/* Right side actions for large screens */}
      <div className="hidden lg:flex items-center gap-6">
        {/* Cart Button - Only for authenticated users */}
        {isAuthenticated && <CartButton />}

        {/* Location Display + Profile/Login Button as single unit */}
        <div className="flex items-center gap-4">
          <LocationDisplay />
          {isAuthenticated ? (
            <ProfileButton username={user.name} />
          ) : (
            <Button content="Login/Register" redirect="/auth/signup" />
          )}
        </div>
      </div>

      {/* TABLET LAYOUT (md to lg) */}
      <div className="hidden md:flex lg:hidden items-center gap-4">
        {/* Cart Button - Only for authenticated users */}
        {isAuthenticated && <CartButton />}

        {/* Profile Button */}
        {isAuthenticated ? (
          <ProfileButton username={user.name} />
        ) : (
          <Button content="Login/Register" redirect="/auth/signup" />
        )}
      </div>

      {/* MOBILE LAYOUT (below md) */}
      <div className="flex md:hidden items-center gap-3">
        {/* Cart Button - Only for authenticated users */}
        {isAuthenticated && <CartButton />}

        {/* Profile Button */}
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
