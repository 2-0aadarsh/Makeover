import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-md">
          {/* Decorative elements */}
          <div className="relative mb-8">
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-[#FFD1DC]/60"></div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-[#FFD1DC]/40"></div>
              <Outlet />  
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AuthLayout;
