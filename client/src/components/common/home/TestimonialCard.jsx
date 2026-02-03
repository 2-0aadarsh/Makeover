import { motion } from "framer-motion";

function getInitials(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function PremiumStarRating({ rating, size = "sm" }) {
  const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const value = Number(rating) || 0;
  const displayRating = value.toFixed(1);

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => {
          const filled = i < Math.floor(value);
          const halfFilled = !filled && i < Math.ceil(value) && value % 1 !== 0;
          
          return (
            <div key={i} className="relative">
              <svg className={`${starSize} text-gray-200`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              
              {(filled || halfFilled) && (
                <div 
                  className={`absolute inset-0 overflow-hidden ${halfFilled ? 'w-1/2' : 'w-full'}`}
                >
                  <svg className={`${starSize} text-[#FF9F1C]`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-gray-800 font-semibold text-sm">{displayRating}</span>
      <div className="flex items-center gap-1 px-2 py-0.5 bg-[#CC2B52]/10 rounded-full">
        <svg className="w-3 h-3 text-[#CC2B52]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-[#CC2B52] text-xs font-semibold">Verified</span>
      </div>
    </div>
  );
}

function PremiumServiceBadge({ serviceName }) {
  const serviceIcons = {
    'Professional Makeup': '💄',
    'Cleanup & Facial': '✨',
    'Professional Mehendi': '🪭',
    'Mani/Pedi & Massage': '💅',
    'Waxing': '🪒',
    'Detan & Bleach': '🌟',
    'Mamma Earth Ubtan Facial': '🌿'
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm">
      <span className="text-sm">{serviceIcons[serviceName] || '💫'}</span>
      <span className="text-gray-700 text-xs font-medium truncate max-w-[120px]">
        {serviceName}
      </span>
    </div>
  );
}

export default function TestimonialCard({ testimonial, className = "" }) {
  const {
    comment = "",
    rating,
    customerName = "Customer",
    serviceName = "",
    orderNumber,
    createdAt,
  } = testimonial || {};

  const initials = getInitials(customerName);
  const displayDate = formatDate(createdAt);
  const quote = comment.length > 180 ? `${comment.slice(0, 180).trim()}…` : comment;

  return (
    <motion.article
      className={`relative rounded-xl p-4 sm:p-5 md:p-6 flex flex-col min-h-[280px] sm:min-h-[300px] min-w-0 overflow-hidden
                  bg-white 
                  border border-gray-200
                  shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]
                  hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_12px_32px_rgba(204,43,82,0.08)]
                  hover:border-[#CC2B52]/40
                  transition-all duration-300 group
                  before:absolute before:inset-0 before:rounded-xl
                  before:bg-gradient-to-br before:from-transparent before:via-transparent before:to-[#CC2B52]/[0.02]
                  before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-500
                  ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      {/* Premium decorative accent */}
      <div className="absolute top-0 right-0 w-20 h-1">
        <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-[#CC2B52]/30 to-transparent rounded-bl-lg" />
      </div>
      
      {/* Quote section with improved typography */}
      <div className="relative mb-4 sm:mb-5 md:mb-6 flex-1 min-w-0">
        <div className="absolute -left-2 sm:-left-3 -top-2 text-3xl sm:text-4xl text-gray-100 font-serif select-none">
          "
        </div>
        
        <p 
          className="text-gray-700 text-sm sm:text-[15px] leading-[1.65] sm:leading-[1.7] font-normal
                     font-sans line-clamp-4 relative z-10"
          title={comment}
        >
          {quote}
        </p>
        
        <div className="absolute -right-2 sm:-right-3 -bottom-2 text-3xl sm:text-4xl text-gray-100 font-serif rotate-180 select-none">
          "
        </div>
      </div>
      
      {/* Rating with better spacing */}
      {rating != null && (
        <div className="mb-4 sm:mb-5">
          <PremiumStarRating rating={rating} size="sm" />
        </div>
      )}

      {/* Service badge */}
      {serviceName && (
        <div className="mb-4 sm:mb-5">
          <PremiumServiceBadge serviceName={serviceName} />
        </div>
      )}

      {/* Customer info with enhanced design */}
      <div className="flex items-center gap-4 pt-5 mt-auto border-t border-gray-100 group-hover:border-gray-200 transition-colors">
        <div className="relative">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center 
                      text-white font-bold text-sm 
                      bg-gradient-to-br from-[#CC2B52] to-[#E83A6A]
                      shadow-md group-hover:shadow-lg transition-shadow"
            aria-hidden
          >
            {initials}
          </div>
          
          {/* Verified badge */}
          <div 
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full 
                      bg-gradient-to-br from-[#CC2B52] to-[#E83A6A]
                      border-2 border-white flex items-center justify-center shadow-sm"
          >
            <svg 
              className="w-2.5 h-2.5 text-white" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-gray-900 font-semibold text-[15px] truncate">
                {customerName}
              </h4>
              <div className="flex items-center gap-2 text-gray-500 text-xs mt-0.5">
                {displayDate && (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{displayDate}</span>
                  </>
                )}
              </div>
            </div>
            
            {orderNumber && (
              <span className="text-gray-400 text-xs font-medium bg-gray-50 px-2 py-1 rounded">
                #{orderNumber}
              </span>
            )}
          </div>
          
          {serviceName && (
            <div className="mt-2">
              <span className="text-[#CC2B52] text-xs font-medium px-2 py-1 bg-[#CC2B52]/5 rounded">
                {serviceName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover effect line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 
                    bg-gradient-to-r from-transparent via-[#CC2B52] to-transparent
                    group-hover:w-20 transition-all duration-300" />
    </motion.article>
  );
}