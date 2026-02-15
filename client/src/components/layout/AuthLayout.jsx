import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "./Footer";
import ScrollToTop from "../../provider/ScrollToTop";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {/* Header */}
      {/* <Header /> */}

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-6 sm:px-6 ">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
      <ScrollRestoration />
    </div>
  );
};

export default AuthLayout;