import AboutUs from "../../components/common/home/AboutUs";
import Cilents from "../../components/common/home/Cilents";
import ContactUs from "../../components/common/home/ContactUs";
import Hero from "../../components/common/home/Hero";

import GalleryPage from "../../components/common/home/GalleryPage";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <AboutUs />
      <Cilents />
      <GalleryPage />
      <ContactUs />
    </div>
  );
};

export default HomePage;
