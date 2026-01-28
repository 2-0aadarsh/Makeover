import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoImg from "../../../assets/Logo/AdminLogo.svg";
import AdminProfileButton from "../../ui/AdminProfileButton";

/**
 * AdminHeader - Navigation bar for admin pages
 * Similar structure to Header.jsx but with admin-specific navigation
 * Responsive design matching Header.jsx
 * 
 * Layout:
 * - Left: Logo + "ADMIN" text
 * - Center: Admin navigation links (large screens)
 * - Right: ProfileButton with logout functionality
 */
const AdminHeader = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogoClick = () => {
    navigate("/admin/dashboard");
  };

  // Admin navigation links (matching Figma design)
  const adminNavLinks = [
    { to: "/admin/services", label: "My Services" },
    { to: "/admin/bookings", label: "Bookings & Customers" },
    { to: "/admin/reviews", label: "Reviews & Complaints" },
    { to: "/admin/enquiries", label: "Enquiries" },
  ];

  return (
    <nav 
      className="flex justify-between items-center text-gray-800 shadow-sm fixed top-0 left-0 right-0 bg-white z-50 px-4 md:px-8 lg:px-[80px]"
      style={{
        paddingTop: '16px',
        paddingBottom: '16px',
        borderTop: '1px solid #E5E7EB',
        minHeight: '80px',
      }}
    >
      {/* LEFT: Logo + ADMIN text - Always visible with proper alignment */}
      <div className="flex items-center  flex-shrink-0 min-w-0">
        <div
          onClick={handleLogoClick}
          className="w-[140px] sm:w-[150px] lg:w-[225px] h-[24px] sm:h-[30px] lg:h-[66px] cursor-pointer flex-shrink-0 "
          style={{ flexShrink: 0 }}
        >
          <img
            src={LogoImg}
            alt="Logo"
            className="w-full h-full object-contain object-center"
          />
        </div>
        {/* <span 
          className="hidden sm:inline-block font-inter font-bold text-sm lg:text-base text-[#CC2B52] whitespace-nowrap flex-shrink-0"
          style={{ flexShrink: 0 }}
        >
          ADMIN
        </span> */}
      </div>

      {/* LARGE SCREEN LAYOUT (lg and above) */}
      <div className="hidden lg:flex lg:items-center lg:flex-1 lg:justify-center lg:min-w-0 lg:px-4 xl:px-6 2xl:px-8">
        {/* Navigation Links with responsive gap and overflow prevention */}
        <div className="nav-links flex gap-4 lg:gap-6 xl:gap-6 2xl:gap-10 items-center justify-center max-w-full overflow-hidden px-4 lg:px-6 xl:px-8 2xl:px-10">
          {adminNavLinks.map((link, index) => (
            <NavLink
              to={link.to}
              key={index}
              className={({ isActive }) =>
                `font-inter font-semibold relative transition-all border-b-2 text-sm lg:text-base xl:text-lg 2xl:text-[14px] whitespace-nowrap flex-shrink-0 px-2 lg:px-3 xl:px-4 2xl:px-6 py-1 lg:py-2 ${
                  isActive
                    ? "border-[#CC2B52] text-[#CC2B52]"
                    : "border-transparent text-gray-800 hover:border-[#CC2B52] hover:text-[#CC2B52]"
                }`
              }
              style={{ flexShrink: 0 }}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Right side actions for large screens */}
      <div className="hidden lg:flex items-center">
        <AdminProfileButton username={user?.name} />
      </div>

      {/* TABLET LAYOUT (md to lg) */}
      <div className="hidden md:flex lg:hidden items-center gap-3">
        {/* Admin Profile Button */}
        <AdminProfileButton username={user?.name} />
      </div>

      {/* MOBILE LAYOUT (below md) */}
      <div className="flex md:hidden items-center">
        {/* Admin Profile Button */}
        <AdminProfileButton username={user?.name} />
      </div>
    </nav>
  );
};

export default AdminHeader;
