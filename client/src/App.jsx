import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { useDispatch, useSelector } from "react-redux";
import { router } from "./routes/HomeRoutes.jsx";
import { checkLoginStatus } from "./features/auth/authThunks.js";
import { useCartAutoSave } from "./hooks/useCartAutoSave.js";
import { GOOGLE_CLIENT_ID } from "./constants.js";
import AdminDeactivatedModal from "./components/modals/admin/AdminDeactivatedModal.jsx";
import { logoutApi } from "./features/auth/authApi.js";

function App() {
  const dispatch = useDispatch();
  const [showAdminDeactivatedModal, setShowAdminDeactivatedModal] = useState(false);

  const { user } = useSelector((state) => state.auth);
  console.log("user role is ", user?.role);

  // Initialize auto-save functionality
  const { forceSaveCart, triggerAutoSave } = useCartAutoSave();

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  // Expose functions globally for testing and critical operations
  useEffect(() => {
    window.forceSaveCart = forceSaveCart;
    window.triggerAutoSave = triggerAutoSave;
    // Expose function to show admin deactivated modal from interceptors
    window.showAdminDeactivatedModal = () => {
      setShowAdminDeactivatedModal(true);
    };
  }, [forceSaveCart, triggerAutoSave]);

  const handleAdminDeactivatedRedirect = async () => {
    setShowAdminDeactivatedModal(false);
    
    try {
      // Step 1: Clear cookies by calling logout API
      await logoutApi();
      
      // Step 2: Clear Redux state (localStorage)
      localStorage.removeItem('persist:root');
      
      // Step 3: Clear cart from Redux if needed
      dispatch({ type: 'cart/clearCart' });
      
      // Step 4: Redirect to login page
      // Use window.location.replace to prevent back button navigation
      window.location.replace('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if logout fails, clear localStorage and redirect
      localStorage.removeItem('persist:root');
      dispatch({ type: 'cart/clearCart' });
      window.location.replace('/auth/login');
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="app w-full">
        <RouterProvider router={router} />
        <Toaster position="top-center" />
        <AdminDeactivatedModal
          isOpen={showAdminDeactivatedModal}
          onClose={() => setShowAdminDeactivatedModal(false)}
          onRedirect={handleAdminDeactivatedRedirect}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
