import CityRequest from '../models/cityRequest.model.js';
import ServiceableCity from '../models/serviceableCity.model.js';

// --- Rate limit: in-memory by IP (e.g. 5 requests per 15 min per IP)
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const ipRequestTimestamps = new Map();

function isRateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  let timestamps = ipRequestTimestamps.get(ip) || [];
  timestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) return true;
  timestamps.push(now);
  ipRequestTimestamps.set(ip, timestamps);
  return false;
}

/** Normalize city/state to title case so "jaipur" / "JPR" / "Jaipur" become consistent */
function normalizeCityName(value) {
  if (value == null || typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * @route   GET /api/city-requests/suggest-city
 * @desc    Suggest city/state from client IP (fallback for form pre-fill)
 * @access  Public
 */
export const getSuggestedCityByIP = async (req, res) => {
  try {
    const ip = req.ip || req.connection?.remoteAddress || req.get('x-forwarded-for')?.split(',')[0]?.trim();
    if (!ip || ip === '::1' || ip === '127.0.0.1') {
      return res.status(200).json({ success: true, data: { city: null, state: null } });
    }
    const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=city,regionName,country`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data && data.city) {
      return res.status(200).json({
        success: true,
        data: {
          city: normalizeCityName(data.city),
          state: normalizeCityName(data.regionName || '') || null,
        },
      });
    }
    return res.status(200).json({ success: true, data: { city: null, state: null } });
  } catch (err) {
    console.error('Suggest city by IP error:', err);
    return res.status(200).json({ success: true, data: { city: null, state: null } });
  }
};

/**
 * @route   POST /api/city-requests
 * @desc    Submit a city request (public)
 * @access  Public
 */
export const submitCityRequest = async (req, res) => {
  try {
    const ip = req.ip || req.connection?.remoteAddress || null;
    if (isRateLimited(ip)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    const { requestedCity, requestedState, name, email, phone, message, source } = req.body;
    const userId = req.user?._id || req.user?.id || null;

    if (!requestedCity || typeof requestedCity !== 'string' || !requestedCity.trim()) {
      return res.status(400).json({
        success: false,
        message: 'City name is required',
      });
    }
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required',
      });
    }

    const metadata = {
      ipAddress: ip,
      userAgent: req.get('user-agent') || null,
    };

    const normalizedCity = normalizeCityName(requestedCity);
    const normalizedState = requestedState?.trim() ? normalizeCityName(requestedState) : 'Bihar';

    // If we already serve this city, tell the user instead of creating a request
    const stateToCheck = normalizedState || 'Bihar';
    const alreadyServing = await ServiceableCity.findOne({
      city: new RegExp(`^${normalizedCity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
      state: new RegExp(`^${stateToCheck.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
      isActive: true,
    });

    if (alreadyServing) {
      return res.status(200).json({
        success: true,
        alreadyServiceable: true,
        message: "We're already available in your city! You can book our services now.",
      });
    }

    const allowedSource = source === 'contact_page' ? 'contact_page' : 'footer_modal';

    const cityRequest = new CityRequest({
      userId: userId || undefined,
      requestedCity: normalizedCity,
      requestedState: normalizedState || null,
      userDetails: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: String(phone).trim(),
      },
      message: message?.trim()?.slice(0, 500) || '',
      source: allowedSource,
      metadata,
    });

    await cityRequest.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! We’ll consider adding your city.',
      data: {
        requestId: cityRequest._id,
        requestNumber: cityRequest.requestNumber,
        status: cityRequest.status,
      },
    });
  } catch (error) {
    console.error('Error submitting city request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit request',
    });
  }
};
