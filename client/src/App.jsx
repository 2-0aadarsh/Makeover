import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { router } from "./routes/HomeRoutes.jsx";
import { checkLoginStatus } from "./features/auth/authThunks.js";
import { useCartAutoSave } from "./hooks/useCartAutoSave.js";
import AutoSaveDebug from "./components/debug/AutoSaveDebug.jsx";

function App() {
  const dispatch = useDispatch();

  useSelector((state) => state.auth);

  // Initialize auto-save functionality
  const { forceSaveCart, triggerAutoSave } = useCartAutoSave();

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  // Expose functions globally for testing and critical operations
  useEffect(() => {
    window.forceSaveCart = forceSaveCart;
    window.triggerAutoSave = triggerAutoSave;
  }, [forceSaveCart, triggerAutoSave]);

  return (
    <div className="app w-full">
      <RouterProvider router={router} />;
      <ToastContainer position="top-right" autoClose={3000} />
      
    </div>
  );
}

export default App;
