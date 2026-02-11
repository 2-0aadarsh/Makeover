import ContactMessage from '../../models/contactMessage.model.js';

/**
 * @route   GET /api/admin/contact-messages
 * @desc    Get all contact us messages with search and pagination
 * @access  Admin only
 */
export const getAllContactMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const search = (req.query.search || '').trim();
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = { [sortBy]: sortOrder };

    const [messages, totalMessages] = await Promise.all([
      ContactMessage.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      ContactMessage.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalMessages / limit);

    return res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: page,
          totalPages,
          totalMessages,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('getAllContactMessages error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch contact messages',
    });
  }
};
