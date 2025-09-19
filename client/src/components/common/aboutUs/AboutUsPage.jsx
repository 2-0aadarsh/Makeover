import SectionTitle from "../../ui/SectionTitle";
import model from "../../../assets/About/model.jpg";
import founder1 from "../../../assets/About/founder1.jpg";
import founder2 from "../../../assets/About/founder2.jpg";
import { useState } from "react";

const AboutUsPage = () => {
  const AboutUsContent =
    "Makeover began with a simple yet powerful vision—to bring the luxury and comfort of salon services to every doorstep. It started when we noticed how busy lives, travel hassles, and the lack of trusted professionals often made self-care feel like a chore. We set out to change that. Today, Makeover is more than just a beauty service—it's an experience tailored to you. From a relaxing facial after a long week to bridal glam that makes your big day unforgettable, we offer everything—skin care, hair treatments, waxing, mehendi, and more—delivered with professionalism, hygiene, and heart. Every artist we onboard is trained to not just serve, but to pamper. Our clients aren't just customers—they're the reason we exist. As we grow, our upcoming Android and iOS apps will make self-care even more effortless. Because we believe beauty shouldn't wait in a queue—it should come to you, whenever you need it most.";

  const whyChooseUsCards = [
    {
      title: "At-Home Luxury, On Your Schedule",
      description:
        "Enjoy premium salon and beauty services without stepping out—delivered at your convenience, whether it's a quick touch-up or a full bridal transformation.",
      bgColor: "#F9F9F9",
    },
    {
      title: "Certified Professionals & Hygiene First",
      description:
        "Every Makeover artist is trained, background-verified, and equipped with sanitized tools to ensure a safe, hygienic, and satisfying experience every time.",
      bgColor: "#FAF0EC",
    },
    {
      title: "Personalized Beauty For Every Need",
      description:
        "From express facials to detailed mehendi and full-body care, we tailor each session to your preferences—because your beauty needs are never one-size-fits-all.",
      bgColor: "#EDF7F4",
    },
  ];

  const foundersData = [
    {
      name: "Priyanshu Priya",
      designation: "Founder & Chief Executive Officer (CEO)",
      image: founder1,
      description:
        "A dynamic leader with a sharp eye for growth, Priyanshu brings in-depth expertise in sales, marketing, and team management. Her entrepreneurial spirit and people-first approach have played a pivotal role in building Makeover's trusted reputation. From crafting customer acquisition strategies to nurturing a high-performance team, Priyanshu ensures the brand stays aligned with evolving market needs while always putting customer delight at the forefront.",
    },
    {
      name: "Ravindu Ranjan",
      designation: "Co-Founder & Chief Technology Officer (CTO)",
      image: founder2,
      description:
        "The tech and product brain behind Makeover, Ravindu leads technology, product strategy, design, and cross-functional planning. With a strong foundation in building user-centric platforms, he focuses on driving innovation, operational efficiency, and seamless customer experiences. His holistic approach ensures that every service we deliver is backed by thoughtful design, reliable systems, and long-term vision.",
    },
  ];

  const [formData, setFormData] = useState({ email: "" });

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col gap-10 md:gap-16 lg:gap-20">
      {/* about us */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-16 lg:py-20">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="w-full lg:w-2/3 flex flex-col items-start gap-6 md:gap-8 lg:gap-12">
            <SectionTitle title="About Us" />
            <div className="font-inter text-sm sm:text-base md:text-[16px] leading-relaxed md:leading-[160%] tracking-normal text-gray-700">
              {AboutUsContent}
            </div>
          </div>

          <div className="w-full sm:w-80 lg:w-[260px] h-auto sm:h-[320px] lg:h-[383px] bg-[#FF2F54] p-3 sm:p-4 rounded-xl mt-6 lg:mt-0">
            <img
              src={model}
              alt="Makeover model"
              className="w-full h-full object-cover rounded-lg lg:rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* why choose us */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-16 lg:py-20">
        <div className="w-full flex flex-col items-start gap-8 md:gap-12">
          <SectionTitle title="Why Choose Us" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {whyChooseUsCards.map((card, index) => (
              <div
                key={index}
                className="w-full p-6 sm:p-8 md:p-9 rounded-xl shadow-lg flex flex-col items-center justify-between border-2 transition-all duration-300 hover:shadow-xl"
                style={{ borderColor: card.bgColor }}
              >
                <h3
                  style={{ backgroundColor: card.bgColor }}
                  className="text-sm sm:text-base font-semibold leading-tight sm:leading-[166%] p-2 sm:p-3 rounded text-center w-full mb-4"
                >
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* our founders */}
      <section className="bg-[#F3F3F3] py-10 md:py-16 lg:py-20">
        <div className="px-4 sm:px-6 md:px-10 lg:px-20 w-full flex flex-col items-start gap-8 md:gap-10 lg:gap-14">
          <SectionTitle title="Our Founders" />
          <p className="text-base sm:text-lg md:text-xl lg:text-[20px] leading-relaxed text-gray-700 w-full lg:pr-10">
            At the heart of Makeover is a vision powered by two driven
            individuals who blend creativity, strategy, and execution to
            redefine at-home beauty experiences.
          </p>

          <div className="flex flex-col gap-10 md:gap-14 lg:gap-16 w-full">
            {foundersData.map((founder, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12"
              >
                {/* Updated image container for full width on mobile */}
                <div className="w-full md:w-64 lg:w-[220px] h-auto md:h-80 lg:h-[294px] rounded-lg overflow-hidden">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div className="w-full md:w-[70%] lg:w-[1024px] text-base sm:text-lg md:text-[20px] font-inter leading-relaxed md:leading-[158%] flex flex-col gap-4 md:gap-6">
                  <h3 className="font-medium text-lg md:text-xl lg:text-2xl">
                    {founder.name} – {founder.designation}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base lg:text-lg">
                    {founder.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* newsletter */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-16 lg:py-20">
        <div className="w-full flex flex-col items-start gap-8 md:gap-12 lg:gap-16 font-inter">
          <SectionTitle title="Subscribe For Newsletters" />

          <div className="w-full p-6 sm:p-8 md:p-12 lg:p-20 bg-[#CC2B52] rounded-2xl text-white flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
            <div className="w-full lg:w-1/2 font-medium text-xl sm:text-2xl md:text-3xl lg:text-[28px] leading-tight sm:leading-relaxed flex flex-col items-start gap-3 md:gap-4">
              <h3>Stay in the loop</h3>
              <p className="font-normal text-sm sm:text-base md:text-lg lg:text-[18px] pr-0 lg:pr-10 tracking-normal">
                Subscribe to receive the latest news and updates about Makeover.
                We promise not to spam you!
              </p>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
              <form
                onSubmit={handleSubmit}
                className="w-full sm:w-96 lg:w-[422px] h-12 sm:h-14 bg-white rounded-lg relative"
              >
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full h-full rounded-lg text-black px-4 text-sm outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#CC2B52] absolute right-1 top-1 bottom-1 px-4 sm:px-6 md:px-9 py-1 sm:py-2 text-xs sm:text-sm capitalize rounded-[8px] cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default AboutUsPage;
