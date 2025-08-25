import Footer from "./Footer"
import Header from "./Header"
import { Outlet } from "react-router-dom";

const AppLayout = () => {
   
  return (
    <div className="app min-h-screen flex flex-col justify-between">
      <Header />
      {/* <div className="mb-[69px]">
      </div> */}
      {/* Content wrapper with top padding to avoid overlap */}
      <main className="flex-1 pt-[61px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout