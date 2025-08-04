import Footer from "./Footer"
import Header from "./Header"
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="app min-h-screen flex flex-col justify-between">
      <div className="mb-24">
        <Header />
      </div>
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout