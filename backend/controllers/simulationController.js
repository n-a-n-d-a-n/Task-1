const { MODEL_LIBRARY, DATASET_LIBRARY, runSimulation } = require('../services/simulationEngine');

const getCatalog = (req, res) => {
  res.json({
    models: MODEL_LIBRARY,
    datasets: DATASET_LIBRARY
  });
};

const createSimulation = (req, res) => {
  const {
    modelId,
    datasetId,
    timeSteps,
    driftLevel,
    noiseLevel,
    imbalanceLevel,
    shiftLevel,
    volatility
  } = req.body;

  const simulation = runSimulation({
    modelId,
    datasetId,
    timeSteps,
    driftLevel,
    noiseLevel,
    imbalanceLevel,
    shiftLevel,
    volatility
  });

  res.status(201).json({
    message: 'Simulation completed successfully.',
    simulation
  });
};

module.exports = {
  getCatalog,
  createSimulation
};
