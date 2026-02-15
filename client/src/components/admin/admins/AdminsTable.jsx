/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleAdminStatus, deleteAdmin, resendOnboardingLink, invalidateOnboardingLink, getOnboardingStatus } from "../../../features/admin/admins/adminAdminsThunks";
import { fetchAllAdmins } from "../../../features/admin/admins/adminAdminsThunks";
import DeleteAdminModal from "../../modals/admin/DeleteAdminModal";
import ToggleAdminStatusModal from "../../modals/admin/ToggleAdminStatusModal";
import InvalidateOnboardingLinkModal from "../../modals/admin/InvalidateOnboardingLinkModal";
import { toast } from "react-hot-toast";

/**
 * AdminsTable - Table component for displaying admins
 * Shows admins with actions: View, Edit, Delete, Toggle Status
 */
const AdminsTable = ({ admins = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const currentAdminId = user?.id || user?._id;
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, admin: null });
  const [toggleStatusModal, setToggleStatusModal] = useState({ isOpen: false, admin: null });
  const [invalidateLinkModal, setInvalidateLinkModal] = useState({ isOpen: false, admin: null });
  const [onboardingStatuses, setOnboardingStatuses] = useState({});
  const [loadingStatus, setLoadingStatus] = useState({});

  if (admins.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500 font-sans" style={{ fontSize: "16px", fontWeight: 500 }}>
          No admins found
        </p>
      </div>
    );
  }

  const handleView = (admin) => {
    navigate(`/admin/admins/update/${admin.id || admin._id}`);
  };

  const handleEdit = (admin) => {
    navigate(`/admin/admins/update/${admin.id || admin._id}`);
  };

  const handleToggleStatus = (admin) => {
    const adminId = admin.id || admin._id;
    
    // Prevent self-toggle
    if (adminId === currentAdminId?.toString()) {
      alert("You cannot change your own status");
      return;
    }

    setToggleStatusModal({ isOpen: true, admin });
  };

  const confirmToggleStatus = async () => {
    if (!toggleStatusModal.admin) return;
    
    const adminId = toggleStatusModal.admin.id || toggleStatusModal.admin._id;
    
    try {
      await dispatch(toggleAdminStatus(adminId)).unwrap();
      // Refresh the list
      dispatch(fetchAllAdmins({}));
      setToggleStatusModal({ isOpen: false, admin: null });
    } catch (error) {
      alert(error || "Failed to toggle admin status");
      setToggleStatusModal({ isOpen: false, admin: null });
    }
  };

  const handleDelete = (admin) => {
    const adminId = admin.id || admin._id;
    
    // Prevent self-deletion
    if (adminId === currentAdminId?.toString()) {
      alert("You cannot delete your own account");
      return;
    }

    setDeleteModal({ isOpen: true, admin });
  };

  const confirmDelete = async () => {
    if (!deleteModal.admin) return;
    
    const adminId = deleteModal.admin.id || deleteModal.admin._id;
    
    try {
      await dispatch(deleteAdmin(adminId)).unwrap();
      // Refresh the list
      dispatch(fetchAllAdmins({}));
      setDeleteModal({ isOpen: false, admin: null });
    } catch (error) {
      alert(error || "Failed to delete admin");
      setDeleteModal({ isOpen: false, admin: null });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleResendOnboardingLink = async (admin) => {
    const adminId = admin.id || admin._id;
    setLoadingStatus({ ...loadingStatus, [adminId]: true });
    
    try {
      await dispatch(resendOnboardingLink(adminId)).unwrap();
      toast.success("Onboarding link has been resent successfully");
      // Refresh status
      fetchOnboardingStatus(adminId);
      // Refresh list
      dispatch(fetchAllAdmins({}));
    } catch (error) {
      toast.error(error || "Failed to resend onboarding link");
    } finally {
      setLoadingStatus({ ...loadingStatus, [adminId]: false });
    }
  };

  const handleInvalidateOnboardingLink = (admin) => {
    setInvalidateLinkModal({ isOpen: true, admin });
  };

  const confirmInvalidateLink = async () => {
    if (!invalidateLinkModal.admin) return;
    
    const adminId = invalidateLinkModal.admin.id || invalidateLinkModal.admin._id;
    setLoadingStatus({ ...loadingStatus, [adminId]: true });
    
    try {
      await dispatch(invalidateOnboardingLink(adminId)).unwrap();
      toast.success("Onboarding link has been invalidated successfully");
      // Refresh status
      fetchOnboardingStatus(adminId);
      // Refresh list
      dispatch(fetchAllAdmins({}));
      setInvalidateLinkModal({ isOpen: false, admin: null });
    } catch (error) {
      toast.error(error || "Failed to invalidate onboarding link");
    } finally {
      setLoadingStatus({ ...loadingStatus, [adminId]: false });
    }
  };

  const fetchOnboardingStatus = async (adminId) => {
    try {
      const response = await dispatch(getOnboardingStatus(adminId)).unwrap();
      setOnboardingStatuses((prev) => ({
        ...prev,
        [adminId]: response.data,
      }));
      return response.data;
    } catch (error) {
      console.error("Failed to fetch onboarding status:", error);
      return null;
    }
  };

  const getOnboardingStatusBadge = (admin) => {
    if (admin.isVerified) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          Completed
        </span>
      );
    }
    
    const status = onboardingStatuses[admin.id || admin._id];
    if (status) {
      switch (status.status) {
        case "pending":
          return (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
              Pending
            </span>
          );
        case "expired":
          return (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
              Expired
            </span>
          );
        case "invalidated":
          return (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
              Invalidated
            </span>
          );
        default:
          return (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
              Pending
            </span>
          );
      }
    }
    
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#CC2B52",
                }}
              >
                Name
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#CC2B52",
                }}
              >
                Email
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#292D32",
                }}
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#292D32",
                }}
              >
                Created By
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#292D32",
                }}
              >
                Created Date
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#292D32",
                }}
              >
                Onboarding
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#CC2B52",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin, index) => {
              const isCurrentAdmin = (admin.id || admin._id) === currentAdminId?.toString();
              
              return (
                <tr key={admin.id || admin._id || index} className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 whitespace-nowrap font-sans"
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#292D32",
                    }}
                  >
                    {admin.name || "N/A"}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap font-sans"
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#292D32",
                    }}
                  >
                    {admin.email || "N/A"}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap font-sans"
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#292D32",
                    }}
                  >
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        admin.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap font-sans"
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#292D32",
                    }}
                  >
                    {admin.createdBy?.name || "System"}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap font-sans"
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#292D32",
                    }}
                  >
                    {formatDate(admin.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      {getOnboardingStatusBadge(admin)}
                      {!admin.isVerified && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const adminId = admin.id || admin._id;
                              if (!onboardingStatuses[adminId]) {
                                fetchOnboardingStatus(adminId);
                              }
                              const status = onboardingStatuses[adminId];
                              if (status?.status === "expired" || status?.status === "invalidated" || !status) {
                                handleResendOnboardingLink(admin);
                              }
                            }}
                            disabled={loadingStatus[admin.id || admin._id]}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                            title="Resend onboarding link"
                          >
                            {loadingStatus[admin.id || admin._id] ? "..." : "Resend"}
                          </button>
                          {(() => {
                            const adminId = admin.id || admin._id;
                            const status = onboardingStatuses[adminId];
                            // Show invalidate button if:
                            // 1. Admin is not verified (onboarding not completed)
                            // 2. Status is "pending" (active link) OR status hasn't been fetched yet
                            const canInvalidate = !admin.isVerified && 
                              (status?.status === "pending" || !status);
                            
                            if (!canInvalidate) return null;
                            
                            return (
                              <button
                                onClick={async () => {
                                  // Fetch status first if not available
                                  let currentStatus = status;
                                  if (!status) {
                                    currentStatus = await fetchOnboardingStatus(adminId);
                                  }
                                  
                                  // Check if we can invalidate
                                  if (currentStatus?.status === "pending") {
                                    handleInvalidateOnboardingLink(admin);
                                  } else {
                                    toast.error("No active onboarding link to invalidate. Link may be expired or already invalidated.");
                                  }
                                }}
                                disabled={loadingStatus[adminId]}
                                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                                title="Invalidate active onboarding link for security reasons"
                              >
                                {loadingStatus[adminId] ? "..." : "Invalidate"}
                              </button>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {/* View/Edit Button */}
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View/Edit"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>

                      {/* Toggle Status Button */}
                      <button
                        onClick={() => handleToggleStatus(admin)}
                        disabled={isCurrentAdmin}
                        className={`${
                          isCurrentAdmin
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-yellow-600 hover:text-yellow-800"
                        } transition-colors`}
                        title={isCurrentAdmin ? "Cannot change own status" : admin.isActive ? "Deactivate" : "Activate"}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                          />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(admin)}
                        disabled={isCurrentAdmin}
                        className={`${
                          isCurrentAdmin
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:text-red-800"
                        } transition-colors`}
                        title={isCurrentAdmin ? "Cannot delete own account" : "Delete"}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.admin && (
        <DeleteAdminModal
          adminName={deleteModal.admin.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({ isOpen: false, admin: null })}
        />
      )}

      {/* Toggle Status Confirmation Modal */}
      {toggleStatusModal.isOpen && toggleStatusModal.admin && (
        <ToggleAdminStatusModal
          adminName={toggleStatusModal.admin.name}
          isActive={toggleStatusModal.admin.isActive}
          onConfirm={confirmToggleStatus}
          onCancel={() => setToggleStatusModal({ isOpen: false, admin: null })}
        />
      )}

      {/* Invalidate Onboarding Link Modal */}
      {invalidateLinkModal.isOpen && invalidateLinkModal.admin && (
        <InvalidateOnboardingLinkModal
          adminName={invalidateLinkModal.admin.name}
          onConfirm={confirmInvalidateLink}
          onCancel={() => setInvalidateLinkModal({ isOpen: false, admin: null })}
        />
      )}
    </div>
  );
};

export default AdminsTable;
