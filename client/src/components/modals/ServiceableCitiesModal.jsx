import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitCityRequest, getSuggestedCity } from "../../features/cityRequests/cityRequestsApi";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

const PinIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

/**
 * Compact city group: letter + list of cities
 */
function CityGroup({ letter, cities }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 flex items-center justify-center bg-[#CC2B52]/10 rounded text-[#CC2B52] font-semibold text-xs">
          {letter}
        </span>
        <span className="text-xs text-gray-500">{cities.length} {cities.length === 1 ? "city" : "cities"}</span>
      </div>
      <ul className="space-y-1">
        {cities.map((city) => (
          <li
            key={city.id || city.city}
            className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-gray-50/80 hover:bg-[#CC2B52]/5 text-gray-700"
          >
            <PinIcon className="w-3 h-3 text-[#CC2B52] shrink-0" />
            <span className="text-sm font-medium">{city.city}</span>
            {city.state && <span className="text-xs text-gray-400">· {city.state}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Minimal Serviceable Cities Modal – compact, scalable, minimal text
 */
export default function ServiceableCitiesModal({ isOpen, onClose, cities = [], loading, error }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({ city: "", state: "", name: "", email: "", phone: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: false, error: null, message: null });

  // Pre-fill city/state from IP when user opens the request form
  useEffect(() => {
    if (!isOpen || !showRequestForm) return;
    let cancelled = false;
    getSuggestedCity()
      .then((res) => {
        if (cancelled || !res?.data?.data) return;
        const { city, state } = res.data.data;
        if (city || state) {
          setRequestForm((prev) => ({
            ...prev,
            ...(city && !prev.city ? { city } : {}),
            ...(state && !prev.state ? { state } : {}),
          }));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [isOpen, showRequestForm]);

  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return [...cities].sort((a, b) => a.city.localeCompare(b.city));
    const q = searchTerm.toLowerCase();
    return [...cities]
      .filter((c) => c.city.toLowerCase().includes(q))
      .sort((a, b) => a.city.localeCompare(b.city));
  }, [cities, searchTerm]);

  const groupedCities = useMemo(() => {
    return filteredCities.reduce((acc, city) => {
      const letter = city.city.charAt(0).toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(city);
      return acc;
    }, {});
  }, [filteredCities]);

  const showSearch = cities.length > 8;
  const groupEntries = Object.entries(groupedCities);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestForm.city?.trim() || !requestForm.name?.trim() || !requestForm.email?.trim() || !requestForm.phone?.trim()) {
      setSubmitStatus({ loading: false, success: false, error: "City, name, email and phone are required." });
      return;
    }
    setSubmitStatus({ loading: true, success: false, error: null, message: null });
    try {
      const res = await submitCityRequest({
        requestedCity: requestForm.city.trim(),
        requestedState: requestForm.state?.trim() || undefined,
        name: requestForm.name.trim(),
        email: requestForm.email.trim(),
        phone: requestForm.phone.trim(),
        message: requestForm.message?.trim() || undefined,
      });
      const body = res?.data ?? res;
      const alreadyServiceable = body?.alreadyServiceable === true;
      setSubmitStatus({
        loading: false,
        success: true,
        error: null,
        message: alreadyServiceable ? (body?.message || "We're already available in your city!") : null,
      });
      setRequestForm({ city: "", state: "", name: "", email: "", phone: "", message: "" });
    } catch (err) {
      const message = err.response?.data?.message || err?.message || "Request failed. Please try again.";
      setSubmitStatus({ loading: false, success: false, error: message, message: null });
    }
  };

  const closeAfterSuccess = () => {
    setShowRequestForm(false);
    setSubmitStatus({ loading: false, success: false, error: null, message: null });
    onClose();
  };

  useBodyScrollLock(!!isOpen);
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 overflow-hidden overscroll-contain"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl shadow-xl w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header – minimal */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <PinIcon className="w-4 h-4 text-[#CC2B52]" />
              <h3 className="text-sm font-semibold text-gray-800">Service areas</h3>
              <span className="text-xs text-gray-400">({cities.length})</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search – only when many cities */}
          {showSearch && (
            <div className="relative px-4 py-2 border-b border-gray-50">
              <svg className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm py-2 px-3 pl-9 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#CC2B52] focus:border-[#CC2B52]"
              />
            </div>
          )}

          {/* Content – scrollable list or request form */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4" data-modal-scroll>
            {showRequestForm ? (
              <div className="space-y-3">
                {submitStatus.success ? (
                  <>
                    <p className="text-sm text-gray-700">
                      {submitStatus.message || "Thanks! We’ll consider adding your city."}
                    </p>
                    <button
                      type="button"
                      onClick={closeAfterSuccess}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#CC2B52] text-white"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleRequestSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="City name *"
                      value={requestForm.city}
                      onChange={(e) => setRequestForm((p) => ({ ...p, city: e.target.value }))}
                      className="w-full text-sm py-2 px-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#CC2B52] focus:border-[#CC2B52]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State (optional)"
                      value={requestForm.state}
                      onChange={(e) => setRequestForm((p) => ({ ...p, state: e.target.value }))}
                      className="w-full text-sm py-2 px-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#CC2B52] focus:border-[#CC2B52]"
                    />
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={requestForm.name}
                      onChange={(e) => setRequestForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full text-sm py-2 px-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#CC2B52] focus:border-[#CC2B52]"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={requestForm.email}
                      onChange={(e) => setRequestForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full text-sm py-2 px-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#CC2B52] focus:border-[#CC2B52]"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone *"
                      value={requestForm.phone}
                      onChange={(e) => setRequestForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full text-sm py-2 px-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#CC2B52] focus:border-[#CC2B52]"
                      required
                    />
                    <textarea
                      placeholder="Message (optional)"
                      value={requestForm.message}
                      onChange={(e) => setRequestForm((p) => ({ ...p, message: e.target.value }))}
                      rows={2}
                      className="w-full text-sm py-2 px-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#CC2B52] focus:border-[#CC2B52] resize-none"
                    />
                    {submitStatus.error && (
                      <p className="text-xs text-red-600">{submitStatus.error}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setShowRequestForm(false); setSubmitStatus({ loading: false, success: false, error: null }); }}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitStatus.loading}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#CC2B52] text-white disabled:opacity-60"
                      >
                        {submitStatus.loading ? "Submitting..." : "Submit request"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-[#CC2B52] border-t-transparent rounded-full animate-spin" />
                <p className="mt-2 text-xs text-gray-500">Loading...</p>
              </div>
            ) : error ? (
              <p className="text-xs text-red-600 text-center py-6">Could not load cities.</p>
            ) : filteredCities.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">
                {searchTerm ? `No city matching "${searchTerm}"` : "No cities yet."}
              </p>
            ) : (
              <div className="space-y-4">
                {groupEntries.map(([letter, cityList]) => (
                  <CityGroup key={letter} letter={letter} cities={cityList} />
                ))}
              </div>
            )}
          </div>

          {/* Footer – minimal CTA */}
          {!showRequestForm && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500">Need your city?</p>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(true)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#CC2B52] text-white hover:bg-[#b02448]"
                >
                  Request city
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
