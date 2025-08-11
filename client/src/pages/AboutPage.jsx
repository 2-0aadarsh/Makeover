
import model from "../../src/assets/About/model.jpg";
import founder1 from "../../src/assets/About/founder1.jpg";
import founder2 from "../../src/assets/About/founder2.jpg";
const AboutPage = () => {
  return (
    <div className="space-y-16 p-8 bg-gray-100">

      {/* About Us */}
      <section className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-2/3">
          <h2 className="pt-8 text-3xl font-bold mb-4 text-red-600">About Us</h2>
          <p className="text-gray-700">
              Makeover began with a simple yet powerful vision—to bring the luxury and comfort of salon services to every doorstep. It started
              when we noticed how busy lives, travel hassles, and the lack of trusted professionals often made self-care feel like a chore.
              We set out to change that. Today, Makeover is more than just a beauty service—it's an experience tailored to you. From a relaxing
              facial after a long week to bridal glam that makes your big day unforgettable, we offer everything—skin care, hair treatments, 
              waxing, mehendi, and more—delivered with professionalism, hygiene, and heart. Every artist we onboard is trained to not just serve,
               but to pamper. Our clients aren’t just customers—they’re the reason we exist. As we grow, our upcoming Android and iOS apps will 
              make self-care even more effortless. Because we believe beauty shouldn't wait in a queue—it should come to you, whenever you need it most.
          </p>
        </div>
        <div className="md:w-1/3">
          <img src={model} alt="About Us" className="rounded-lg" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section>
        <h2 className="text-3xl font-bold text-red-600 mb-8">Why Choose Us</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="p-6 bg-white rounded-lg shadow text-center">
            <h3 className="font-semibold text-lg bg-[#eadaf2] inline px-1 text-[#CC2B52]">At-Home Luxury</h3>
            <p className="text-sm text-gray-600">Enjoy premium salon and beauty services without stepping out—delivered at your convenience,
               whether it’s a quick touch-up or a full bridal transformation.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow text-center">
            <h3 className="font-semibold text-lg bg-[#f2e1da] inline px-1 text-[#CC2B52]">Certified Professionals</h3>
            <p className="text-sm text-gray-600">Every Makeover artist is trained, background-verified, and equipped with sanitized tools to ensure a safe, hygienic,
               and satisfying experience every time.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow text-center">
            <h3 className="font-semibold text-lg bg-[#c1f2ae] inline px-1 text-[#CC2B52]">Personalized Beauty</h3>
            <p className="text-sm text-gray-600">From express facials to detailed mehendi and full-body care, we tailor each session to your preferences—because
               your beauty needs are never one-size-fits-all.</p>
          </div>
        </div>
      </section>

      {/* Our Founders */}
      <section>
        <h2 className="text-3xl font-bold text-red-600 mb-8 ">Our Founders</h2>
        <div className="space-y-8">
          {/* First Founder */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img src={founder1} alt="CEO"  className=" w-64 h-48 md:w-64 md:h-64  object-cover rounded-lg" />
            <div>
              <h3 className="font-semibold">Priyanshu Priya – Founder & Chief Executive Officer (CEO)</h3>
              <p className="text-gray-700">
                A dynamic leader with a sharp eye for growth, Priyanshu brings in-depth expertise in sales, marketing, and team management.
                Her entrepreneurial spirit and people-first approach have played a pivotal role in building Makeover’s trusted reputation.
                From crafting customer acquisition strategies to nurturing a high-performance team, Priyanshu ensures the brand stays aligned 
                with evolving market needs while always putting customer delight at the forefront.
              </p>
            </div>
          </div>
          {/* Second Founder */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img src={founder2} alt="CTO" className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg" />
            <div>
              <h3 className="font-semibold">Ravindu Ranjan – Co-Founder & Chief Technology Officer (CTO)</h3>
              <p className="text-gray-700">
                The tech and product brain behind Makeover, Ravindu leads technology, product strategy, design, and cross-functional planning.
                With a strong foundation in building user-centric platforms, he focuses on driving innovation, operational efficiency, and seamless
                customer experiences.His holistic approach ensures that every service we deliver is backed by thoughtful design, reliable systems, 
                and long-term vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe for Newsletters */}
      <section className="bg-pink-200 p-8 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Subscribe for Newsletters</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 rounded-md border"
        />
        <button className="w-full p-3 bg-red-600 text-white rounded-md">
          Subscribe
        </button>
      </section>

    </div>
  );
};

export default AboutPage;
