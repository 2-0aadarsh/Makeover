import ScrollToTop from "../../provider/ScrollToTop";
import Footer from "./Footer";
import Header from "./Header";
import { Outlet, ScrollRestoration } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-between">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pt-[61px] w-full">
        <Outlet />
      </main>
      <Footer />

      <ScrollRestoration />
    </div>
  );
};

export default AppLayout;
