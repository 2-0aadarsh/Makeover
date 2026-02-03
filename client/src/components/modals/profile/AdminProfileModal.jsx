/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutModal";
import { HiOutlineLogout } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";

/**
 * AdminProfileModal - Profile modal specifically for admin users
 * Shows admin-specific navigation links instead of user links
 */
const AdminProfileModal = ({ username, onClose }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const desktopModalRef = useRef(null);
  const mobileModalRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideDesktop =
        desktopModalRef.current &&
        !desktopModalRef.current.contains(event.target);
      const clickedOutsideMobile =
        mobileModalRef.current &&
        !mobileModalRef.current.contains(event.target);

      // If clicked outside both modals → close
      if (clickedOutsideDesktop && clickedOutsideMobile) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Admin navigation links that appear in header (on large screens)
  const headerNavLinks = [
    { to: "/admin/services", label: "My Services" },
    { to: "/admin/bookings", label: "Bookings & Customers" },
    { to: "/admin/reviews", label: "Reviews & Complaints" },
    { to: "/admin/enquiries", label: "Enquiries" },
  ];

  // Additional links that only appear in profile modal (not in header)
  const profileOnlyLinks = [
    { to: "/admin/cities", label: "Cities" },
    { to: "/admin/admins", label: "Admin Management" },
    { to: "/admin/site-settings", label: "Site Settings" },
  ];

  const displayName = (() => {
    if (!username) return "Admin";

    const trimmed = username.trim();
    if (!trimmed) return "Admin";

    const [firstToken] = trimmed.split(/\s+/);
    if (!firstToken) return "Admin";

    const lowerCased = firstToken.toLowerCase();
    return lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
  })();

  return (
    <>
      {/* Desktop Modal - Dropdown */}
      <div
        ref={desktopModalRef}
        className="hidden lg:block absolute top-full right-0 mt-2 w-80 bg-white shadow-2xl z-50 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-[#CC2B52]">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RxCross2 size={20} />
          </button>
        </div>

        {/* User Name */}
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-lg font-semibold text-gray-800">{displayName}</p>
        </div>

        {/* Navigation Links - Only show profile-only links on desktop (header nav links are visible) */}
        <div className="py-2">
          {profileOnlyLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-[#CC2B52] font-semibold hover:bg-pink-50 transition-colors ${
                  isActive ? "bg-pink-50" : ""
                }`
              }
            >
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout Section */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowLogoutConfirm(true);
            }}
            className="flex items-center gap-3 text-[#CC2B52] font-semibold hover:text-[#B02547] transition-colors"
          >
            <HiOutlineLogout className="font-semibold text-[20px]" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 text-center">
          <p className="text-sm text-[#CC2B52] font-semibold">
            Crafted with ❤️ in India
          </p>
        </div>

        {showLogoutConfirm && (
          <LogoutModal onCancel={() => setShowLogoutConfirm(false)} />
        )}
      </div>

      {/* Mobile/Tablet Sidebar */}
      <div
        ref={mobileModalRef}
        className="fixed top-0 right-0 h-auto max-h-[65vh] w-80 bg-white shadow-2xl z-50 flex flex-col lg:hidden md:block sm:block rounded-b-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-[#CC2B52]">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RxCross2 size={20} />
          </button>
        </div>

        {/* User Name */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <p className="text-lg font-semibold text-gray-800">{displayName}</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Navigation Links - Show all links on mobile/tablet (header nav links are hidden) */}
          <div className="py-2">
            {/* Header nav links (shown only on mobile/tablet where header nav is hidden) */}
            {headerNavLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.to}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-[#CC2B52] font-semibold hover:bg-pink-50 transition-colors ${
                    isActive ? "bg-pink-50" : ""
                  }`
                }
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
            {/* Profile-only links (always shown) */}
            {profileOnlyLinks.map((link, index) => (
              <NavLink
                key={`profile-${index}`}
                to={link.to}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-[#CC2B52] font-semibold hover:bg-pink-50 transition-colors ${
                    isActive ? "bg-pink-50" : ""
                  }`
                }
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Bottom Section - fixed at bottom */}
        <div className="flex-shrink-0">
          {/* Logout Section */}
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLogoutConfirm(true);
              }}
              className="flex items-center gap-3 text-[#CC2B52] font-semibold hover:text-[#B02547] transition-colors"
            >
              <HiOutlineLogout size={20} />
              <span>Log Out</span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-sm text-[#CC2B52] font-semibold">
              Crafted with ❤️ in India
            </p>
          </div>
        </div>

        {showLogoutConfirm && (
          <LogoutModal onCancel={() => setShowLogoutConfirm(false)} />
        )}
      </div>
    </>
  );
};

export default AdminProfileModal;
