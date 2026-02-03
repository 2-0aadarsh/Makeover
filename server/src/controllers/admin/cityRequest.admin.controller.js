import CityRequest from '../../models/cityRequest.model.js';
import ServiceableCity from '../../models/serviceableCity.model.js';
import { invalidateCityCache } from '../../utils/cityValidator.js';
import mongoose from 'mongoose';

/**
 * @route   GET /api/admin/city-requests
 * @desc    Get all city requests with filters and pagination
 * @access  Admin only
 */
export const getAllCityRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const {
      status,
      search,
      city,
      state,
      source,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    if (status && ['pending', 'reviewed', 'planned', 'added', 'dismissed'].includes(status)) {
      query.status = status;
    }
    if (city && String(city).trim()) {
      query.requestedCity = { $regex: new RegExp(`^${String(city).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
    }
    if (state && String(state).trim()) {
      query.requestedState = { $regex: new RegExp(`^${String(state).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
    }
    if (source && ['footer_modal', 'contact_page'].includes(source)) {
      query.source = source;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }
    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { requestNumber: { $regex: term, $options: 'i' } },
        { requestedCity: { $regex: term, $options: 'i' } },
        { requestedState: { $regex: term, $options: 'i' } },
        { 'userDetails.name': { $regex: term, $options: 'i' } },
        { 'userDetails.email': { $regex: term, $options: 'i' } },
        { 'userDetails.phone': { $regex: term, $options: 'i' } },
      ];
    }

    const effectiveSortBy = sortBy === 'demand' ? 'createdAt' : sortBy;
    const effectiveSortOrder = sortOrder === 'asc' ? 1 : -1;

    let requests;
    const total = await CityRequest.countDocuments(query);

    if (sortBy === 'demand') {
      const cityOrder = await CityRequest.aggregate([
        { $match: query },
        { $group: { _id: '$requestedCity', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 1 } },
      ]);
      const cityRank = {};
      cityOrder.forEach((c, i) => { cityRank[c._id?.toLowerCase?.() || ''] = i; });
      const all = await CityRequest.find(query).sort({ createdAt: -1 }).lean();
      all.sort((a, b) => {
        const aKey = (a.requestedCity || '').toLowerCase();
        const bKey = (b.requestedCity || '').toLowerCase();
        return (cityRank[aKey] ?? 999) - (cityRank[bKey] ?? 999);
      });
      requests = all.slice(skip, skip + limit);
    } else {
      requests = await CityRequest.find(query)
        .sort({ [effectiveSortBy]: effectiveSortOrder })
        .skip(skip)
        .limit(limit)
        .lean();
    }

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'City requests retrieved successfully',
      data: {
        requests,
        pagination: {
          currentPage: page,
          totalPages,
          total,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching city requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch city requests',
    });
  }
};

/**
 * @route   GET /api/admin/city-requests/analytics
 * @desc    Get city request analytics (counts by status, top cities)
 * @access  Admin only
 */
export const getCityRequestAnalytics = async (req, res) => {
  try {
    const [byStatus, topCities, total, distinctCities, distinctStates] = await Promise.all([
      CityRequest.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      CityRequest.aggregate([
        { $group: { _id: '$requestedCity', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
        { $project: { city: '$_id', count: 1, _id: 0 } },
      ]),
      CityRequest.countDocuments(),
      CityRequest.distinct('requestedCity').then((arr) => arr.filter(Boolean).sort()),
      CityRequest.distinct('requestedState').then((arr) => arr.filter(Boolean).sort()),
    ]);

    const statusCounts = { pending: 0, reviewed: 0, planned: 0, added: 0, dismissed: 0 };
    byStatus.forEach((s) => {
      if (statusCounts.hasOwnProperty(s._id)) statusCounts[s._id] = s.count;
    });

    res.status(200).json({
      success: true,
      message: 'Analytics retrieved successfully',
      data: {
        total,
        byStatus: statusCounts,
        topRequestedCities: topCities,
        distinctCities: distinctCities || [],
        distinctStates: distinctStates || [],
      },
    });
  } catch (error) {
    console.error('Error fetching city request analytics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch analytics',
    });
  }
};

/**
 * @route   PATCH /api/admin/city-requests/:id/status
 * @desc    Update city request status
 * @access  Admin only
 */
export const updateCityRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid request ID' });
    }
    const allowed = ['pending', 'reviewed', 'planned', 'added', 'dismissed'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status is required' });
    }

    const update = { status };
    if (adminNotes !== undefined) update.adminNotes = String(adminNotes).slice(0, 1000);
    if (['added', 'dismissed'].includes(status)) {
      update.resolvedAt = new Date();
      update.resolvedBy = req.user?.id || req.user?._id;
    }

    const request = await CityRequest.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!request) {
      return res.status(404).json({ success: false, message: 'City request not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: request,
    });
  } catch (error) {
    console.error('Error updating city request status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update status',
    });
  }
};

/**
 * @route   POST /api/admin/city-requests/:id/add-to-serviceable
 * @desc    Add the requested city to serviceable cities and set request status to 'added'
 * @access  Admin only
 */
export const addRequestToServiceable = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid request ID' });
    }

    const cityRequest = await CityRequest.findById(id).lean();
    if (!cityRequest) {
      return res.status(404).json({ success: false, message: 'City request not found' });
    }

    const city = (cityRequest.requestedCity || '').trim();
    const state = (cityRequest.requestedState || '').trim() || 'Bihar';
    if (!city) {
      return res.status(400).json({ success: false, message: 'Request has no city name' });
    }

    const existing = await ServiceableCity.findOne({
      city: new RegExp(`^${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
      state: new RegExp(`^${state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
    });

    if (existing) {
      await CityRequest.findByIdAndUpdate(id, {
        status: 'added',
        resolvedAt: new Date(),
        resolvedBy: req.user?.id || req.user?._id,
      });
      invalidateCityCache();
      return res.status(200).json({
        success: true,
        message: `${city}, ${state} is already serviceable. Request marked as added.`,
        data: { alreadyExisted: true },
      });
    }

    await ServiceableCity.create({
      city,
      state,
      isActive: true,
      createdBy: req.user?.id || req.user?._id,
    });

    await CityRequest.findByIdAndUpdate(id, {
      status: 'added',
      resolvedAt: new Date(),
      resolvedBy: req.user?.id || req.user?._id,
    });

    invalidateCityCache();

    res.status(200).json({
      success: true,
      message: `${city}, ${state} has been added to serviceable cities`,
      data: { added: true },
    });
  } catch (error) {
    console.error('Error adding request to serviceable:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add city to serviceable list',
    });
  }
};
