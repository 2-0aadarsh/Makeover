/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import ProfileModal from "../modals/profile/ProfileModal";
import { UserIcon } from "./UserIcon";

const ProfileButton = ({username}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative border-2">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 py-2 px-4 border-2 border-[#CC2B52]"
      >
        <UserIcon />
        <h3 className="font-bold text-lg leading-6 font-sans">{username}</h3>
      </button>

      {open && (
        <ProfileModal username={"Aadarsh"} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

export default ProfileButton