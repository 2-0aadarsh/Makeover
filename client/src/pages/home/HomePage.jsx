import AboutUs from "../../components/common/home/AboutUs";
import Cilents from "../../components/common/home/Cilents";
import ContactUs from "../../components/common/home/ContactUs";
import Hero from "../../components/common/home/Hero";
// import ServiceableCitiesBanner from "../../components/common/home/ServiceableCitiesBanner";
import GalleryPage from "../../components/common/home/GalleryPage";
import Testimonial from "../../components/common/home/Testimonial";
import { useSelector } from "react-redux";
import ContactUsLoggedin from "../../components/common/home/ContactUsLoggedin";

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <div className="">
      <Hero />
      <AboutUs />
      <Cilents />
      <GalleryPage />
      <Testimonial />
      {/* <ServiceableCitiesBanner /> */}
      {isAuthenticated ? <ContactUsLoggedin /> : <ContactUs />}
    </div>
  );
};

export default HomePage;
