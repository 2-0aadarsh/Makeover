

import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {/* <Header /> */}

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-6 sm:px-6 ">
        <Outlet />
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default AuthLayout;