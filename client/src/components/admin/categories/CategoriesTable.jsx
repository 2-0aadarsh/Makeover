/* eslint-disable react/prop-types */
import { useState } from "react";
import { Edit2, Trash2, Power, PowerOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateCategory, deleteCategory, toggleCategoryActive, fetchAllCategories } from "../../../features/admin/categories/adminCategoriesThunks";
import UpdateCategoryModal from "../../modals/admin/UpdateCategoryModal";
import DeleteCategoryModal from "../../modals/admin/DeleteCategoryModal";
import ToggleCategoryStatusModal from "../../modals/admin/ToggleCategoryStatusModal";
import toast from "react-hot-toast";

/**
 * CategoriesTable - Table component for displaying categories
 * Shows categories with actions: Edit, Delete, Toggle Status (Active/Inactive)
 */
const CategoriesTable = ({ categories = [], loading = false }) => {
  const dispatch = useDispatch();
  
  const [updateModal, setUpdateModal] = useState({ isOpen: false, category: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });
  const [toggleModal, setToggleModal] = useState({ isOpen: false, category: null });
  const [operationLoading, setOperationLoading] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500 font-sans" style={{ fontSize: "16px", fontWeight: 500 }}>
          No categories found
        </p>
      </div>
    );
  }

  const handleEdit = (category) => {
    setUpdateModal({ isOpen: true, category });
  };

  const handleDelete = (category) => {
    setDeleteModal({ isOpen: true, category });
  };

  const handleToggleStatus = (category, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setToggleModal({ isOpen: true, category });
  };

  const confirmToggleStatus = async () => {
    if (!toggleModal.category) return;
    const categoryId = String(toggleModal.category.id || toggleModal.category._id);
    try {
      setOperationLoading(true);
      const result = await dispatch(toggleCategoryActive(categoryId)).unwrap();
      const newStatus = result?.isActive ?? !toggleModal.category.isActive;
      toast.success(newStatus ? "Category activated successfully!" : "Category deactivated successfully!");
      setToggleModal({ isOpen: false, category: null });
      await dispatch(fetchAllCategories({ limit: 100, sortBy: 'displayOrder', sortOrder: 'asc' }));
    } catch (error) {
      toast.error(error || "Failed to toggle category status");
      setToggleModal({ isOpen: false, category: null });
    } finally {
      setOperationLoading(false);
    }
  };

  const confirmUpdate = async (formData) => {
    if (!updateModal.category) return;
    
    const categoryId = updateModal.category.id || updateModal.category._id;
    
    try {
      setOperationLoading(true);
      await dispatch(updateCategory({ categoryId, formData })).unwrap();
      toast.success("Category updated successfully!");
      // Refresh the list
      await dispatch(fetchAllCategories({ limit: 100, sortBy: 'displayOrder', sortOrder: 'asc' }));
      setUpdateModal({ isOpen: false, category: null });
    } catch (error) {
      toast.error(error || "Failed to update category");
    } finally {
      setOperationLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.category) return;
    
    const categoryId = deleteModal.category.id || deleteModal.category._id;
    
    try {
      setOperationLoading(true);
      await dispatch(deleteCategory(categoryId)).unwrap();
      toast.success("Category deleted successfully!");
      // Refresh the list
      await dispatch(fetchAllCategories({ limit: 100, sortBy: 'displayOrder', sortOrder: 'asc' }));
      setDeleteModal({ isOpen: false, category: null });
    } catch (error) {
      toast.error(error || "Failed to delete category");
      setDeleteModal({ isOpen: false, category: null });
    } finally {
      setOperationLoading(false);
    }
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Inactive
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Display Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id || category._id} className="hover:bg-gray-50 transition-colors">
                  {/* Image */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/48?text=No+Image";
                      }}
                    />
                  </td>
                  
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.slug}
                    </div>
                  </td>
                  
                  {/* Description */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-xs truncate">
                      {category.description || "-"}
                    </div>
                  </td>
                  
                  {/* Services Count */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {category.serviceCount || 0}
                    </div>
                  </td>
                  
                  {/* Display Order */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {category.displayOrder !== undefined ? category.displayOrder : 0}
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(category.isActive)}
                  </td>
                  
                  {/* Created Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(category.createdAt)}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      {/* Toggle Status (Active/Inactive) */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleStatus(category, e)}
                        className={category.isActive
                          ? "text-amber-600 hover:text-amber-800 transition-colors"
                          : "text-green-600 hover:text-green-800 transition-colors"
                        }
                        title={category.isActive ? "Deactivate category" : "Activate category"}
                      >
                        {category.isActive ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </button>
                      
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleEdit(category); }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDelete(category); }}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Category Modal */}
      {updateModal.isOpen && updateModal.category && (
        <UpdateCategoryModal
          category={updateModal.category}
          onConfirm={confirmUpdate}
          onCancel={() => setUpdateModal({ isOpen: false, category: null })}
          loading={operationLoading}
        />
      )}

      {/* Delete Category Modal */}
      {deleteModal.isOpen && deleteModal.category && (
        <DeleteCategoryModal
          categoryName={deleteModal.category.name}
          serviceCount={deleteModal.category.serviceCount || 0}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({ isOpen: false, category: null })}
        />
      )}

      {/* Toggle Category Status Modal */}
      {toggleModal.isOpen && toggleModal.category && (
        <ToggleCategoryStatusModal
          categoryName={toggleModal.category.name}
          isActive={toggleModal.category.isActive}
          onConfirm={confirmToggleStatus}
          onCancel={() => setToggleModal({ isOpen: false, category: null })}
        />
      )}
    </>
  );
};

export default CategoriesTable;
