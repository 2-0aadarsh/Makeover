import SectionTitle from "../../ui/SectionTitle";
import NewsletterSubscription from "../../ui/NewsletterSubscription";
// import model from "../../../assets/About/model.jpg";
import model2 from "../../../assets/About/model2.svg";
import founder1 from "../../../assets/About/founder1.jpg";
import Aadarsh from "../../../assets/About/Aadarsh.jpg";
import Pushpraj from "../../../assets/About/Pushpraj.jpg";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaLinkedin, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

const socialIconConfig = {
  linkedin: {
    icon: FaLinkedin,
    color: "bg-blue-600 hover:bg-blue-700",
  },
  instagram: {
    icon: FaInstagram,
    color: "bg-pink-500 hover:bg-pink-600",
  },
  twitter: {
    icon: FaTwitter,
    color: "bg-sky-400 hover:bg-sky-500",
  },
  github: {
    icon: FaGithub,
    color: "bg-gray-700 hover:bg-gray-800",
  },
};

const AboutUsPage = () => {
  const AboutUsContent =
    "Wemakeover began with a simple yet powerful vision to bring the luxury and comfort of salon services to every doorstep. It started when we noticed how busy lives, travel hassles, and the lack of trusted professionals often made self-care feel like a chore. We set out to change that. Today, Wemakeover is more than just a beauty service—it's an experience tailored to you. From a relaxing facial after a long week to bridal glam that makes your big day unforgettable, we offer everything—skin care, hair treatments, waxing, mehendi, and more—delivered with professionalism, hygiene, and heart. Every artist we onboard is trained to not just serve, but to pamper. Our clients aren't just customers—they're the reason we exist. As we grow, our upcoming Android and iOS apps will make self-care even more effortless. Because we believe beauty shouldn't wait in a queue—it should come to you, whenever you need it most.";

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
        "Every Wemakeover artist is trained, background-verified, and equipped with sanitized tools to ensure a safe, hygienic, and satisfying experience every time.",
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
        "A dynamic leader with a sharp eye for growth, Priyanshu brings in-depth expertise in sales, marketing, and team management. Her entrepreneurial spirit and people-first approach have played a pivotal role in building Wemakeover's trusted reputation. From crafting customer acquisition strategies to nurturing a high-performance team, Priyanshu ensures the brand stays aligned with evolving market needs while always putting customer delight at the forefront.",
    },
    // {
    //   name: "Ravindu Ranjan",
    //   designation: "Co-Founder & Chief Technology Officer (CTO)",
    //   image: founder2,
    //   description:
    //     "The tech and product brain behind Wemakeover, Ravindu leads technology, product strategy, design, and cross-functional planning. With a strong foundation in building user-centric platforms, he focuses on driving innovation, operational efficiency, and seamless customer experiences. His holistic approach ensures that every service we deliver is backed by thoughtful design, reliable systems, and long-term vision.",
    // },
  ];

  // Enhanced Team Data with Social Media
  const teamData = [
    {
      name: "Aadarsh Upadhyay",
      designation: "Software Development Engineer (SDE)",
      image: Aadarsh,
      description:
        "A skilled software engineer with expertise in building scalable and responsive web applications. Aadarsh focuses on creating seamless user experiences and robust backend systems that power the Wemakeover platform, ensuring reliability and performance.",
      socialMedia: {
        linkedin:
          "https://www.linkedin.com/in/aadarsh-upadhyaybackenddeveloper",
        instagram: "https://www.instagram.com/notsoaadarshh",
        twitter: "https://x.com/Aadarsh_717",
        github: "https://github.com/2-0aadarsh",
      },
    },
    {
      name: "Pushpraj Ranjan",
      designation: "Software Development Engineer (SDE)",
      image: Pushpraj,
      description:
        "Passionate about modern web technologies and user-centric design, Pushpraj contributes to developing innovative features and maintaining code quality. His dedication to clean architecture and best practices helps deliver exceptional digital experiences.",
      socialMedia: {
        linkedin: "https://www.linkedin.com/in/pushpraj-ranjan-454931215",
        instagram:
          "https://www.instagram.com/pushpraj_31?igsh=MWJ3c2Z1eWxycHBnYg==",
        github: "https://github.com/Pushpraj31",
      },
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      rotateY: 10,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const socialIconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.2,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  // Social Media Icon Component
  const SocialIcon = ({ href, icon: Icon, color, delay }) => (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`p-2 rounded-full ${color} text-white hover:shadow-lg transform transition-all duration-200`}
      variants={socialIconVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay }}
    >
      <Icon className="w-4 h-4" />
    </motion.a>
  );

  SocialIcon.propTypes = {
    href: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    delay: PropTypes.number.isRequired,
  };

  // Team Member Card Component
  const TeamMemberCard = ({ member }) => (
    <motion.div
      variants={cardVariants}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
      whileHover={{ y: -5 }}
    >
      <div className="p-6 sm:p-8">
        {/* Image with different styling from founders */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="relative"
            variants={imageVariants}
            whileHover="hover"
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-1 shadow-lg">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover rounded-full border-4 border-white"
              />
            </div>
            {/* Animated ring effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 border-r-purple-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {member.name}
          </h3>
          <p className="text-blue-600 font-semibold mb-4 text-sm">
            {member.designation}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {member.description}
          </p>

          {/* Social Media Links */}
          <motion.div
            className="flex justify-center space-x-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {Object.entries(member.socialMedia || {})
              .filter(([platform, url]) => url && socialIconConfig[platform])
              .map(([platform, url], socialIndex) => {
                const { icon, color } = socialIconConfig[platform];

                return (
                  <SocialIcon
                    key={platform}
                    href={url}
                    icon={icon}
                    color={color}
                    delay={0.1 * (socialIndex + 1)}
                  />
                );
              })}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  TeamMemberCard.propTypes = {
    member: PropTypes.shape({
      name: PropTypes.string.isRequired,
      designation: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      socialMedia: PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
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

          <div className="w-full sm:w-80 lg:w-[260px] h-auto sm:h-[320px] lg:h-[383px] bg-[#FF2F54]  rounded-xl mt-6 lg:mt-0">
            <img
              src={model2}
              alt="Wemakeover model"
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
          <SectionTitle title="Our Founder" />
          <p className="text-base sm:text-lg md:text-xl lg:text-[20px] leading-relaxed text-gray-700 w-full lg:pr-10">
            At the heart of Wemakeover is a vision powered by two driven
            individuals who blend creativity, strategy, and execution to
            redefine at-home beauty experiences.
          </p>

          <div className="flex flex-col gap-10 md:gap-14 lg:gap-16 w-full">
            {foundersData.map((founder, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12"
              >
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

      {/* Enhanced Our Team Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-10 md:py-16 lg:py-20">
        <div className="px-4 sm:px-6 md:px-10 lg:px-20 w-full flex flex-col items-start gap-8 md:gap-10 lg:gap-14">
          <SectionTitle title="Our Team" />
          <p className="text-base sm:text-lg md:text-xl lg:text-[20px] leading-relaxed text-gray-700 w-full lg:pr-10">
            Meet the talented developers who bring technical excellence and
            innovation to the Wemakeover platform, ensuring seamless digital
            experiences for our users.
          </p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 w-full max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {teamData.map((member, index) => (
              <TeamMemberCard key={index} member={member} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* newsletter */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-16 lg:py-20">
        <div className="w-full flex flex-col items-start gap-8 md:gap-12 lg:gap-16 font-inter">
          <SectionTitle title="Subscribe For Newsletters" />

          <NewsletterSubscription
            source="about-page"
            variant="default"
            title="Stay in the loop"
            description="Subscribe to receive the latest news and updates about Wemakeover. We promise not to spam you!"
          />
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
