/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import LogoutModal from "./LogoutModal";
import { HiOutlineLogout } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";

const ProfileModal = ({ username, onClose }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const modalRef = useRef(null);

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

  return (
    <div
      ref={modalRef}
      className="absolute right-0 top-11 w-[280px] h-[216px] text-[#CC2B52] bg-[#F8F8F8] shadow-2xl border z-50 flex flex-col justify-between"
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
  );
};

export default ProfileModal;
