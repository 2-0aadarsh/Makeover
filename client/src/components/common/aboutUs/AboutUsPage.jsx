import SectionTitle from "../../ui/SectionTitle";
import model from "../../../assets/About/model.jpg"

import founder1 from "../../../assets/About/founder1.jpg";
import founder2 from "../../../assets/About/founder2.jpg";
import { useState } from "react";


const AboutUsPage = () => {
  const AboutUsContent = "Makeover began with a simple yet powerful vision—to bring the luxury and comfort of salon services to every doorstep. It started when we noticed how busy lives, travel hassles, and the lack of trusted professionals often made self-care feel like a chore. We set out to change that. Today, Makeover is more than just a beauty service—it's an experience tailored to you. From a relaxing facial after a long week to bridal glam that makes your big day unforgettable, we offer everything—skin care, hair treatments, waxing, mehendi, and more—delivered with professionalism, hygiene, and heart. Every artist we onboard is trained to not just serve, but to pamper. Our clients aren’t just customers—they’re the reason we exist. As we grow, our upcoming Android and iOS apps will make self-care even more effortless. Because we believe beauty shouldn't wait in a queue—it should come to you, whenever you need it most.";
  
  const whyChooseUsCards = [
    {
      title: "At-Home Luxury, On Your Schedule",
      description:
        "Enjoy premium salon and beauty services without stepping out—delivered at your convenience, whether it’s a quick touch-up or a full bridal transformation.",
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
        "A dynamic leader with a sharp eye for growth, Priyanshu brings in-depth expertise in sales, marketing, and team management. Her entrepreneurial spirit and people-first approach have played a pivotal role in building Makeover’s trusted reputation. From crafting customer acquisition strategies to nurturing a high-performance team, Priyanshu ensures the brand stays aligned with evolving market needs while always putting customer delight at the forefront.",
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
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  
  return (
    <div className="border min-h-screen  flex flex-col gap-5">
      {/* about us */}
      <section className="px-20 py-20">
        <div className="w-full h-[452px]  py-9 flex items-center justify-between ">
          <div className="w-2/3 flex flex-col items-start justify-between gap-12">
            <SectionTitle title="About Us" />

            <div className="font-inter text-[16px] leading-[160%] tracking-[1%] font-normal">
              {AboutUsContent}
            </div>
          </div>

          <div className="w-[260px] h-[383px] bg-[#FF2F54] p-4">
            <img
              src={model}
              alt=""
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* why choose us */}

      <section className="px-20 py-20">
        <div className="w-full h-[380px] flex flex-col items-start justify-between">
          <SectionTitle title="Why Choose Us" />

          <div className="grid grid-cols-3 gap-6">
            {whyChooseUsCards.map((card, index) => (
              <div
                key={index}
                className="w-[396px] h-[254px] p-9 rounded-xl shadow-2xl flex flex-col items-center justify-between border-2"
                style={{ borderColor: card.bgColor }}
              >
                <h3
                  style={{ backgroundColor: card.bgColor }}
                  className="text-[16px] font-semibold bg-slate-600 leading-[166%] p-2 rounded"
                >
                  {card.title}
                </h3>
                <p className="font-poppins p-1 border text-sm font-medium tracking-normal">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* our founders */}
      <section className="">
        <div className="px-20 py-20 w-full h-[952px] flex flex-col items-start justify-between gap-14 bg-[#F3F3F3]">
          <SectionTitle title="Why Choose Us" />
          <p className="leading-[160%] w-full text-[20px] pr-10 ">
            At the heart of Makeover is a vision powered by two driven
            individuals who blend creativity, strategy, and execution to
            redefine at-home beauty experiences.
          </p>

          <div className="flex flex-col gap-16">
            {foundersData.map((founder, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-12 "
              >
                <div className="w-[220px] h-[294px] rounded-lg overflow-hidden">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full rounded-[12px] object-cover"
                  />
                </div>

                <div className="w-[1024px] text-[20px]  font-inter leading-[158%] flex flex-col gap-6">
                  <h3 className=" font-medium ">
                    {founder.name} – {founder.designation}
                  </h3>
                  <p className="mt-2 text-gray-800 text-wrap">
                    {founder.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* news letters */}
      <section id="news-letter" className="px-20 py-20 ">
        <div className="w-full h-[288px] flex flex-col items-start justify-between gap-16 font-inter">
          <SectionTitle title="Subscribe For Newsletters" />

          <div className="p-20 w-full min-h-[190px] bg-[#CC2B52] rounded-2xl text-white flex items-center justify-between gap-10">
            <div className="w-1/2 font-medium text-[28px] leading-[100%] flex flex-col items-start justify-center gap-4">
              <h3>Stay in loop</h3>
              <p className="font-normal text-[18px] pr-10 tracking-normal">
                Subscribe to receive the latest news and updates about Makeover.
                We promise not to spam you!
              </p>
            </div>

            <div className="w-1/2 flex items-end justify-end">
              <form
                onSubmit={handleSubmit}
                className="input-fields w-[422px] h-14 bg-white rounded-lg relative "
              >
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full h-full rounded-lg text-black px-4 text-sm outline-none"
                />
                <button className="bg-[#CC2B52] absolute right-9 top-3 px-9 py-2 text-[12px] capitalize rounded-[8px] cursor-pointer ">
                  subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage