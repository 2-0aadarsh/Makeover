import { Outlet } from "react-router-dom";
import AdminHeader from "../admin/layout/AdminHeader";

/**
 * AdminLayout - Layout wrapper for all admin pages
 * Similar to AppLayout but without Footer
 * Contains AdminHeader + main content area
 */
const AdminLayout = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />
      <main className="flex-1 w-full pt-20 lg:pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
