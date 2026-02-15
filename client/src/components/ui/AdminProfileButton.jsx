/* eslint-disable react/prop-types */
import { useState } from "react";
import AdminProfileModal from "../modals/profile/AdminProfileModal";
import { UserIcon } from "./UserIcon";

/**
 * AdminProfileButton - Profile button specifically for admin users
 * Uses AdminProfileModal which shows admin-specific navigation links
 */
const AdminProfileButton = ({ username }) => {
  const [open, setOpen] = useState(false);

  const displayName = (() => {
    if (!username) return "";

    const trimmed = username.trim();
    if (!trimmed) return "";

    const [firstToken] = trimmed.split(/\s+/);
    if (!firstToken) return "";

    const lowerCased = firstToken.toLowerCase();
    return lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
  })();

  return (
    <div className="relative">
      {/* Large Screen - Full button with text */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="hidden lg:flex items-center justify-center gap-2 px-4 xl:px-6 py-2 xl:py-3 bg-[#CC2B52] hover:bg-[#CC2B52]/90 transition-all duration-300 text-white rounded-full min-w-fit"
      >
        <UserIcon />
        <h3 className="font-semibold font-inter text-xs xl:text-sm whitespace-nowrap">
          {displayName || "Admin"}
        </h3>
      </button>

      {/* Tablet & Mobile - Icon only button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-[#CC2B52] bg-white hover:bg-gray-50 transition-colors"
        aria-label={displayName ? `Profile menu for ${displayName}` : "Admin Profile"}
      >
        <UserIcon />
      </button>

      {open && (
        <AdminProfileModal username={username} onClose={() => setOpen(false)} />
      )}
    </div>
  );
};

export default AdminProfileButton;
