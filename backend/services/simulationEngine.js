const manifest = require('../trained_models/model-manifest.json');

if (!manifest || !Array.isArray(manifest.models) || !Array.isArray(manifest.datasets)) {
  throw new Error('Invalid model-manifest.json format. Expected models[] and datasets[].');
}

const MODEL_LIBRARY = manifest.models.map((model) => ({
  id: model.id,
  name: model.name,
  family: model.family,
  trainedOn: model.trainedOn,
  artifactFile: model.artifactFile,
  trainingDate: model.trainingDate,
  basePerformance: model.basePerformance
}));

const DATASET_LIBRARY = manifest.datasets;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const computeStress = ({ driftLevel, noiseLevel, imbalanceLevel, shiftLevel, volatility }) => {
  return (
    driftLevel * 0.35 +
    noiseLevel * 0.25 +
    imbalanceLevel * 0.2 +
    shiftLevel * 0.2 +
    volatility * 0.12
  );
};

const sanitizeSteps = (steps) => {
  const parsed = Number(steps || 12);
  if (!Number.isFinite(parsed)) return 12;
  return Math.min(52, Math.max(4, Math.round(parsed)));
};

const runSimulation = ({
  modelId,
  datasetId,
  timeSteps = 12,
  driftLevel = 0.2,
  noiseLevel = 0.1,
  imbalanceLevel = 0.1,
  shiftLevel = 0.1,
  volatility = 0.08
}) => {
  const model = MODEL_LIBRARY.find((item) => item.id === modelId) || MODEL_LIBRARY[0];
  const normalizedTimeSteps = sanitizeSteps(timeSteps);
  const dataset = DATASET_LIBRARY.find((item) => item.id === datasetId) || DATASET_LIBRARY[0];

  const stressScore = computeStress({ driftLevel, noiseLevel, imbalanceLevel, shiftLevel, volatility });
  const resilienceFactor = 1 - dataset.baselineDifficulty * 0.25;

  const timeline = [];

  for (let step = 0; step < normalizedTimeSteps; step += 1) {
    const progression = step / Math.max(normalizedTimeSteps - 1, 1);
    const cyclicalFluctuation = Math.sin(step * Math.PI * 0.75) * volatility * 0.03;
    const degradation = stressScore * progression * (0.22 + dataset.baselineDifficulty * 0.08) * resilienceFactor;

    const accuracy = clamp(model.basePerformance.accuracy - degradation + cyclicalFluctuation, 0.5, 0.99);
    const f1 = clamp(model.basePerformance.f1 - degradation * 1.05 + cyclicalFluctuation * 0.8, 0.45, 0.98);
    const precision = clamp(model.basePerformance.precision - degradation * 0.92, 0.4, 0.98);
    const recall = clamp(model.basePerformance.recall - degradation * 1.12, 0.35, 0.98);
    const auc = clamp(model.basePerformance.auc - degradation * 0.86, 0.45, 0.99);
    const latencyMs = Math.round(model.basePerformance.latencyMs * (1 + progression * stressScore * 0.8 + shiftLevel * 0.3));

    timeline.push({
      step: step + 1,
      stressIndex: Number((stressScore * (1 + progression * 0.5)).toFixed(3)),
      metrics: {
        accuracy: Number(accuracy.toFixed(4)),
        f1: Number(f1.toFixed(4)),
        precision: Number(precision.toFixed(4)),
        recall: Number(recall.toFixed(4)),
        auc: Number(auc.toFixed(4)),
        latencyMs
      }
    });
  }

  const initial = timeline[0].metrics;
  const final = timeline[timeline.length - 1].metrics;

  const summary = {
    performanceDrop: {
      accuracy: Number((initial.accuracy - final.accuracy).toFixed(4)),
      f1: Number((initial.f1 - final.f1).toFixed(4)),
      recall: Number((initial.recall - final.recall).toFixed(4)),
      auc: Number((initial.auc - final.auc).toFixed(4))
    },
    stabilityGrade:
      stressScore < 0.15 ? 'A' : stressScore < 0.23 ? 'B' : stressScore < 0.31 ? 'C' : stressScore < 0.4 ? 'D' : 'E',
    failureRisk:
      final.f1 >= 0.8 ? 'Low' : final.f1 >= 0.7 ? 'Moderate' : final.f1 >= 0.6 ? 'Elevated' : 'Critical'
  };

  return {
    model,
    dataset,
    config: { timeSteps: normalizedTimeSteps, driftLevel, noiseLevel, imbalanceLevel, shiftLevel, volatility },
    timeline,
    summary
  };
};

module.exports = {
  MODEL_LIBRARY,
  DATASET_LIBRARY,
  runSimulation
};
