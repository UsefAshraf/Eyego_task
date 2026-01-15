const { validationResult } = require('express-validator');
class ActivityController {
  constructor(createActivityUseCase, getActivitiesUseCase) {
    this.createActivityUseCase = createActivityUseCase;
    this.getActivitiesUseCase = getActivitiesUseCase;
  }

  async createActivity(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const activityData = {
        ...req.body,
        ipAddress: req.ip
      };

      const result = await this.createActivityUseCase.execute(activityData);
      
      res.status(202).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getActivities(req, res, next) {
    try {
      const filters = {
        userId: req.query.userId,
        action: req.query.action,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const result = await this.getActivitiesUseCase.execute(filters, pagination);
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivityController;