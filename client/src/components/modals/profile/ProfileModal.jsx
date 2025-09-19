/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import LogoutModal from "./LogoutModal";
import { HiOutlineLogout } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";

const ProfileModal = ({ username, onClose }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleScrollOrNavigate = (sectionId) => {
    onClose(); // Close the modal first
    if (window.location.pathname === "/") {
      // Already on home page → just scroll
      scroller.scrollTo(sectionId, {
        smooth: true,
        duration: 800,
        offset: -100,
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
      }, 100);
    }
  };

  const navigationLinks = [
    { type: "scroll", to: "gallery", linkName: "Gallery" },
    { type: "route", to: "/about", linkName: "About us" },
    { type: "route", to: "/myBookings", linkName: "My Bookings" },
    { type: "scroll", to: "contact-us", linkName: "Contact Us" },
  ];

  return (
    <>
      {/* Backdrop for mobile/tablet */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Modal/Sidebar */}
      <div
        ref={modalRef}
        className="absolute right-0 top-11 w-[280px] h-[216px] text-[#CC2B52] bg-[#F8F8F8] shadow-2xl border z-50 flex flex-col justify-between lg:block md:hidden sm:block"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 pb-4 pt-6">
          <h3 className="font-bold text-lg leading-[100%] font-inter">
            {username}
          </h3>
          <button onClick={onClose} className="text-[#000000] text-xl">
            <RxCross2 />
          </button>
        </div>

        {/* Logout */}
        <div
          className="flex items-center gap-2 px-4 pb-4 pt-6 text-md cursor-pointer border-t-[0.5px] border-[#CC2B52] font-semibold"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <HiOutlineLogout className="font-semibold text-[20px]" />
          <span>Log Out</span>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 pt-6 text-sm leading-[100%] cursor-pointer border-t-[0.5px] border-[#CC2B52] text-[#CC2B52] text-center font-semibold">
          Crafted with 💖 in India
        </div>

        {showLogoutConfirm && (
          <LogoutModal onCancel={() => setShowLogoutConfirm(false)} />
        )}
      </div>

      {/* Sidebar for tablet and mobile */}
      <div
        ref={modalRef}
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col lg:hidden md:block sm:block"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-6 border-b border-gray-200">
          <h3 className="font-bold text-xl font-inter text-[#CC2B52]">
            Profile
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <RxCross2 size={24} />
          </button>
        </div>

        {/* User Name */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-semibold text-lg text-[#CC2B52]">{username}</h4>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-6 py-4">
          {navigationLinks.map((link, index) => (
            <div key={index} className="py-3 border-b border-pink-100">
              {link.type === "route" ? (
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  className="text-[#CC2B52] font-semibold hover:text-[#B02547] transition-colors"
                >
                  {link.linkName}
                </NavLink>
              ) : (
                <button
                  onClick={() => handleScrollOrNavigate(link.to)}
                  className="text-[#CC2B52] font-semibold hover:text-[#B02547] transition-colors"
                >
                  {link.linkName}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Logout Section */}
        <div className="px-6 py-4 border-t border-pink-100">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 text-[#CC2B52] font-semibold hover:text-[#B02547] transition-colors"
          >
            <HiOutlineLogout size={20} />
            <span>Log Out</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-pink-100 text-center">
          <p className="text-sm text-[#CC2B52] font-semibold">
            Crafted with ❤️ in India
          </p>
        </div>

        {showLogoutConfirm && (
          <LogoutModal onCancel={() => setShowLogoutConfirm(false)} />
        )}
      </div>
    </>
  );
};

export default ProfileModal;
