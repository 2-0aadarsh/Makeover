import AboutUs from "../components/common/home/AboutUs"
import Cilents from "../components/common/home/Cilents"
import ContactUs from "../components/common/home/ContactUs"
import Hero from "../components/common/home/Hero"
import Feedback from "../components/common/home/Feedback"
import feedback from "../components/common/home/feedback"

const HomePage = () => {
  return (
    <div>
      <Hero />
      <AboutUs />
      <Cilents />
      <Feedback />
      <ContactUs />
    </div>
  );
}

export default HomePage