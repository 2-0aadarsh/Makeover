/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

import polarBear from "../../../assets/modals/profile/polarBear.gif";
import { logoutUser } from "../../../features/auth/authThunks";

const LogoutModal = ({ onCancel }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useBodyScrollLock(true);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        onCancel();
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-hidden overscroll-contain"
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-2xl text-center max-w-sm w-[415px] h-[309px] flex flex-col items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-2/3 -mt-6">
          <img
            src={polarBear}
            alt="Koala"
            loading="lazy"
            className="w-full h-full  object-cover object-center"
          />
        </div>
        <p className="text-[20px] text-[#CC2B52] leading-6 font-medium">
          Are you sure, you want to log out?
        </p>
        <div className="flex justify-between gap-4 border w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            className="w-full px-4 py-2 border border-[#CC2B52] text-[#CC2B52] rounded-md"
          >
            Log Out
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="w-full px-4 py-2 bg-[#CC2B52] text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
