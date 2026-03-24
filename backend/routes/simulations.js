const express = require('express');
const { body } = require('express-validator');
const { getCatalog, createSimulation } = require('../controllers/simulationController');
const { validateRequest } = require('../middleware/errorMiddleware');

const router = express.Router();

router.get('/catalog', getCatalog);

router.post(
  '/run',
  [
    body('modelId').optional().isString(),
    body('datasetId').optional().isString(),
    body('timeSteps').optional().isInt({ min: 4, max: 52 }),
    body('driftLevel').optional().isFloat({ min: 0, max: 1 }),
    body('noiseLevel').optional().isFloat({ min: 0, max: 1 }),
    body('imbalanceLevel').optional().isFloat({ min: 0, max: 1 }),
    body('shiftLevel').optional().isFloat({ min: 0, max: 1 }),
    body('volatility').optional().isFloat({ min: 0, max: 1 })
  ],
  validateRequest,
  createSimulation
);

module.exports = router;
