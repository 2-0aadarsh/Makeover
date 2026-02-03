import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchTestimonials, fetchTestimonialStats } from "../../../features/testimonials/testimonialsSlice";
import TestimonialsCarousel from "./TestimonialsCarousel";

const FALLBACK_REVIEW = `"I loved how professional and well-prepared the beautician was—felt like a salon at home!" says one of our happy clients. Another shares, "Wemakeover is my go-to for last-minute grooming; always on time, clean, and super relaxing." Many of our customers rave about the convenience and quality of our professional makeup and grooming services.`;

const USE_MOCK_CAROUSEL_PREVIEW = false;
const MOCK_TESTIMONIALS = [
  { _id: "mock-1", comment: "1 Enjoyed the service alot. LOVED IT!!!! but I edited this review now", rating: 3.5, customerName: "Aman", serviceName: "Mamma Earth Ubtan Facial", orderNumber: "ORD000001", createdAt: "2026-02-15T10:00:00.000Z" },
  // { _id: "mock-2", comment: "2 The beautician was so professional and the facial left my skin glowing. Will definitely book again!", rating: 5, customerName: "Priya S.", serviceName: "Cleanup & Facial", orderNumber: "ORD000002", createdAt: "2026-02-10T14:30:00.000Z" },
  // { _id: "mock-3", comment: "3 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
  // { _id: "mock-4", comment: "4 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
  // { _id: "mock-5", comment: "5 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
  // { _id: "mock-6", comment: "6 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
  // { _id: "mock-6", comment: "7 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
  // { _id: "mock-6", comment: "8 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
  // { _id: "mock-6", comment: "9 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
  // { _id: "mock-6", comment: "10 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
  // { _id: "mock-6", comment: "11 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
  // { _id: "mock-6", comment: "12 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
  // { _id: "mock-6", comment: "13 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
  // { _id: "mock-6", comment: "14 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
  { _id: "mock-6", comment: "15 Amazing bridal makeup! Exactly what I wanted for my big day. Highly recommend.", rating: 4.5, customerName: "Kavya M.", serviceName: "Professional Makeup", orderNumber: "ORD000003", createdAt: "2026-02-08T09:00:00.000Z" },
];

export default function Testimonial() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { list: testimonials, loading, error } = useSelector((state) => state.testimonials);

  const scrollToServices = () => {
    const el = document.getElementById("hero");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleViewAllServices = () => {
    if (location.pathname === "/") {
      scrollToServices();
    } else {
      window.location.href = "/#hero";
    }
  };
  const { data: stats, loading: statsLoading } = useSelector((state) => state.testimonials.stats);

  useEffect(() => {
    dispatch(fetchTestimonials({ limit: 20 }));
    dispatch(fetchTestimonialStats());
  }, [dispatch]);

  const realList = Array.isArray(testimonials) ? testimonials : [];
  const displayTestimonials = USE_MOCK_CAROUSEL_PREVIEW && realList.length < 4
    ? [...realList, ...MOCK_TESTIMONIALS].slice(0, 8)
    : realList;
  const hasTestimonials = displayTestimonials.length > 0;

  const SERVICE_STATS = [
    { 
      label: "Total Services", 
      value: stats?.totalServices ? `${stats.totalServices}+` : "5+", 
      icon: "💄",
      gradient: "from-[#CC2B52]/5 to-white"
    },
    { 
      label: "Published Reviews", 
      value: stats?.totalReviews ? `${stats.totalReviews}+` : "0", 
      icon: "⭐",
      gradient: "from-[#FF9F1C]/5 to-white"
    },
    { 
      label: "Client Satisfaction", 
      value: stats?.satisfactionRate ? `${stats.satisfactionRate}%` : "98%", 
      icon: "😊",
      gradient: "from-[#10B981]/5 to-white"
    },
    { 
      label: "Cities Covered", 
      value: stats?.citiesCount ? `${stats.citiesCount}+` : "1+", 
      icon: "📍",
      gradient: "from-[#3B82F6]/5 to-white"
    },
  ];

  return (
    <section
      id="testimonial"
      className="relative w-full py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 50%, #FFFFFF 100%)',
      }}
    >
      {/* SECTION 1: HEADER WITH CLEAR SEPARATION */}
      <div className="relative max-w-7xl mx-auto mb-16">
        {/* Decorative top border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#CC2B52] to-transparent rounded-full" />
        
        <div className="text-center pt-8">
          <motion.div
            className="inline-flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-gray-300" />
            <div className="flex items-center gap-2 text-[#CC2B52] 
                          text-sm font-semibold tracking-widest uppercase px-4 py-2
                          bg-[#CC2B52]/5 rounded-full border border-[#CC2B52]/10">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              VERIFIED REVIEWS
            </div>
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-gray-300" />
          </motion.div>
          
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 
                       mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Beauty Experiences<br />
            <span className="text-[#CC2B52]">That Speak for Themselves</span>
          </motion.h2>
          
          <motion.p
            className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of satisfied clients who trust Wemakeover for 
            professional makeup, grooming, and wellness services at their doorstep
          </motion.p>
        </div>
      </div>

      {/* SECTION 2: STATS CARDS WITH BORDERS */}
      <motion.div 
        className="max-w-7xl mx-auto mb-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {SERVICE_STATS.map((stat, index) => (
            <div
              key={index}
              className={`text-center rounded-2xl border border-gray-200
                        shadow-[0_4px_20px_rgba(0,0,0,0.03)]
                        hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                        hover:border-gray-300
                        transition-all duration-300 relative
                        before:absolute before:inset-0 before:rounded-2xl
                        before:bg-gradient-to-b before:from-white/50 before:to-transparent
                        before:pointer-events-none
                        p-4 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-b ${stat.gradient}`}
            >
              <div className="text-xl sm:text-2xl md:text-3xl mb-1.5 sm:mb-2">{stat.icon}</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                {statsLoading ? (
                  <div className="h-5 sm:h-6 md:h-8 w-10 sm:w-12 md:w-16 mx-auto bg-gray-200 rounded animate-pulse" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-gray-600 text-xs sm:text-sm">{stat.label}</div>
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden rounded-tr-2xl">
                <div className="absolute -top-3 -right-3 w-12 h-12 rotate-45 bg-gradient-to-br from-current/5 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* SECTION 3: TESTIMONIAL CAROUSEL WITH DISTINCT CONTAINER */}
      <div className="relative max-w-7xl mx-auto mb-16">
        {/* Container with clear borders and background */}
        <div className="relative rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10
                      bg-gradient-to-b from-gray-50/50 to-white
                      border border-gray-200/80
                      shadow-[0_8px_32px_rgba(0,0,0,0.04)]
                      before:absolute before:inset-0 before:rounded-2xl md:before:rounded-3xl
                      before:bg-gradient-to-b before:from-white before:to-transparent
                      before:pointer-events-none">
          
          {/* Inner decorative border */}
          <div className="absolute inset-4 rounded-xl border border-gray-100/50 pointer-events-none" />
          
          {/* Loading state */}
          {loading && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white border border-gray-200
                            p-6 min-h-[280px] animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-full mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-4 w-4 rounded bg-gray-200" />
                    ))}
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-24" />
                      <div className="h-2 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Error state */}
          {!loading && error && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full 
                            bg-gradient-to-br from-[#CC2B52]/10 to-white
                            border border-[#CC2B52]/20 flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-[#CC2B52]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.282 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Unable to Load Reviews
              </h3>
              <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
                {error}
              </p>
              <button
                onClick={() => dispatch(fetchTestimonials({ limit: 20 }))}
                className="px-6 py-2.5 rounded-lg bg-white border border-[#CC2B52] 
                          text-[#CC2B52] font-semibold text-sm 
                          hover:bg-[#CC2B52] hover:text-white
                          transition-all duration-300 shadow-sm"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Success state with testimonials */}
          {!loading && !error && hasTestimonials && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <TestimonialsCarousel testimonials={displayTestimonials} visibleCount={3} />
            </motion.div>
          )}

          {/* Fallback state */}
          {!loading && !error && !hasTestimonials && (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="max-w-3xl mx-auto">
                <div className="text-5xl mb-4">💫</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Be the First to Share Your Experience!
                </h3>
                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  {FALLBACK_REVIEW}
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 
                              rounded-full bg-gradient-to-r from-white to-gray-50
                              border border-gray-200 shadow-sm">
                  <svg className="w-4 h-4 text-[#CC2B52]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#CC2B52] font-semibold text-sm">
                    Book a service and share your review!
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* SECTION 4: CTA WITH CLEAR SEPARATION */}
      <motion.div 
        className="max-w-4xl mx-auto px-4 pt-16 border-t border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready for Your Beauty Transformation?
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who choose professional beauty services at their doorstep
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              to="/Cart"
              className="px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-[#CC2B52] to-[#E83A6A]
                         text-white font-semibold text-base md:text-lg text-center
                         hover:shadow-xl hover:shadow-[#CC2B52]/20 
                         transition-all duration-300 transform hover:-translate-y-0.5
                         border border-[#CC2B52]"
            >
              Book Now
            </Link>
            <button
              type="button"
              onClick={handleViewAllServices}
              className="px-6 md:px-8 py-3 md:py-4 rounded-xl bg-white
                         border-2 border-gray-300 text-gray-700 font-semibold text-base md:text-lg
                         hover:border-[#CC2B52] hover:text-[#CC2B52]
                         transition-all duration-300"
            >
              View All Services
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}