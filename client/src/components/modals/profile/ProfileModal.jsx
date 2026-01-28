/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import LogoutModal from "./LogoutModal";
import { HiOutlineLogout } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { HiLocationMarker } from "react-icons/hi";

const ProfileModal = ({ username, onClose }) => {
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

  const handleScrollOrNavigate = (sectionId) => {
    onClose();
    if (window.location.pathname === "/") {
      scroller.scrollTo(sectionId, {
        smooth: true,
        duration: 800,
        offset: -100,
      });
    } else {
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

      {/* Desktop Modal */}
      <div
        ref={desktopModalRef}
        className="absolute right-0 top-11 w-[280px] h-[320px] text-[#CC2B52] bg-[#F8F8F8] shadow-2xl border z-50 flex flex-col lg:block md:hidden sm:block"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content Section - grows to fill available space */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="flex justify-between items-center px-4 pb-4 pt-6 flex-shrink-0">
            <h3 className="font-bold text-lg leading-[100%] font-inter">
              {username}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-[#000000] text-xl"
            >
              <RxCross2 />
            </button>
          </div>

          {/* Address Management */}
          <NavLink
            to="/addresses"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex items-center gap-2 px-4 pb-4 pt-6 text-md cursor-pointer border-t-[0.5px] border-[#CC2B52] font-semibold hover:bg-gray-100 flex-shrink-0"
          >
            <HiLocationMarker className="font-semibold text-[20px]" />
            <span>Add/Update Address</span>
          </NavLink>

          {/* Complaint Link */}
          {/* <div
            className="flex items-center gap-2 px-4 pb-4 pt-6 text-md cursor-pointer border-t-[0.5px] border-[#CC2B52] font-semibold hover:bg-gray-100 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Add complaint functionality
              console.log("Complaint functionality to be implemented");
            }}
          >
            <HiChatAlt2 className="font-semibold text-[20px]" />
            <span>Raise a Complaint</span>
          </div> */}

          {/* Logout */}
          <div
            className="flex items-center gap-2 px-4 pb-4 pt-6 text-md cursor-pointer border-t-[0.5px] border-[#CC2B52] font-semibold hover:bg-gray-100 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setShowLogoutConfirm(true);
            }}
          >
            <HiOutlineLogout className="font-semibold text-[20px]" />
            <span>Log Out</span>
          </div>
        </div>

        {/* Footer - always at bottom */}
        <div
          className="px-4 pb-4 pt-6 text-sm leading-[100%] cursor-pointer border-t-[0.5px] border-[#CC2B52] text-[#CC2B52] text-center font-semibold flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          Crafted with 💖 in India
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
          <h3 className="font-bold text-xl font-inter text-[#CC2B52]">
            Profile
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <RxCross2 size={24} />
          </button>
        </div>

        {/* User Name */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h4 className="font-semibold text-lg text-black/75">{username}</h4>
        </div>

        {/* Navigation Links - scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {navigationLinks.map((link, index) => (
            <div key={index} className="py-3 border-b border-pink-100">
              {link.type === "route" ? (
                <NavLink
                  to={link.to}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="text-[#CC2B52] font-semibold hover:text-[#B02547] transition-colors"
                >
                  {link.linkName}
                </NavLink>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScrollOrNavigate(link.to);
                  }}
                  className="text-[#CC2B52] font-semibold hover:text-[#B02547] transition-colors"
                >
                  {link.linkName}
                </button>
              )}
            </div>
          ))}

          {/* Address Management */}
          <div className="py-3 border-b border-pink-100">
            <NavLink
              to="/addresses"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex items-center gap-3 text-[#CC2B52] font-semibold hover:text-[#B02547] transition-colors"
            >
              <HiLocationMarker size={20} />
              <span>Add/Update Address</span>
            </NavLink>
          </div>

          {/* Complaint Link */}
          {/* <div className="py-3 border-b border-pink-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Add complaint functionality
                console.log("Complaint functionality to be implemented");
              }}
              className="flex items-center gap-3 text-[#CC2B52] font-semibold hover:text-[#B02547] transition-colors"
            >
              <HiChatAlt2 size={20} />
              <span>Raise a Complaint</span>
            </button>
          </div> */}
        </div>

        {/* Bottom Section - fixed at bottom */}
        <div className="flex-shrink-0">
          {/* Logout Section */}
          <div className="px-6 py-4 border-t border-pink-100">
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
          <div
            className="px-6 py-4 border-t border-pink-100 text-center"
            onClick={(e) => e.stopPropagation()}
          >
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

export default ProfileModal;
