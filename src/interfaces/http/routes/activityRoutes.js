const express = require('express');
const { body } = require('express-validator');

function createActivityRoutes(activityController) {
  const router = express.Router();

  router.post(
    '/',
    [
      body('userId').notEmpty().withMessage('userId is required'),
      body('action').notEmpty().withMessage('action is required'),
      body('metadata').optional().isObject()
    ],
    (req, res, next) => activityController.createActivity(req, res, next)
  );

  router.get(
    '/',
    (req, res, next) => activityController.getActivities(req, res, next)
  );

  return router;
}

module.exports = createActivityRoutes;