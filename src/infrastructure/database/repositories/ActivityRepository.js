const IActivityRepository = require('../../../domain/repositories/IActivityRepository');
const { ActivityModel } = require('../mongodb');
class ActivityRepository extends IActivityRepository {
  async save(activity) {
    const doc = new ActivityModel(activity);
    return await doc.save();
  }

  async findById(id) {
    return await ActivityModel.findById(id);
  }

  async findAll(filters = {}, pagination = {}) {
    const { skip = 0, limit = 10 } = pagination;
    
    const query = {};
    if (filters.userId) query.userId = filters.userId;
    if (filters.action) query.action = filters.action;
    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
      if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
    }

    const [data, total] = await Promise.all([
      ActivityModel.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityModel.countDocuments(query)
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    };
  }
}

module.exports = ActivityRepository;