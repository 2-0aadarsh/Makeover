import Footer from "./Footer"
import Header from "./Header"
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="app min-h-screen flex flex-col justify-between">
        <Header />
      {/* <div className="mb-[69px]">
      </div> */}
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout