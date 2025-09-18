import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { router } from "./routes/HomeRoutes.jsx";
import { checkLoginStatus } from "./features/auth/authThunks.js";

function App() {
  const dispatch = useDispatch();

  useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, []);

  return (
    <div className="app">
      <RouterProvider router={router} />;
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
