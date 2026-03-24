const MODEL_LIBRARY = [
  {
    id: 'xgboost',
    name: 'XGBoost Classifier',
    family: 'Gradient Boosting',
    strengths: ['tabular-data', 'non-linear-patterns'],
    basePerformance: { accuracy: 0.93, f1: 0.91, precision: 0.9, recall: 0.92, auc: 0.95, latencyMs: 42 }
  },
  {
    id: 'lightgbm',
    name: 'LightGBM',
    family: 'Gradient Boosting',
    strengths: ['large-datasets', 'fast-inference'],
    basePerformance: { accuracy: 0.92, f1: 0.9, precision: 0.89, recall: 0.91, auc: 0.94, latencyMs: 30 }
  },
  {
    id: 'random-forest',
    name: 'Random Forest',
    family: 'Ensemble',
    strengths: ['robust-baseline', 'noise-tolerance'],
    basePerformance: { accuracy: 0.89, f1: 0.87, precision: 0.86, recall: 0.88, auc: 0.91, latencyMs: 28 }
  },
  {
    id: 'logistic-regression',
    name: 'Logistic Regression',
    family: 'Linear',
    strengths: ['interpretable', 'calibrated-probabilities'],
    basePerformance: { accuracy: 0.84, f1: 0.82, precision: 0.83, recall: 0.81, auc: 0.86, latencyMs: 8 }
  },
  {
    id: 'mlp',
    name: 'MLP Neural Network',
    family: 'Deep Learning',
    strengths: ['high-capacity', 'feature-interactions'],
    basePerformance: { accuracy: 0.91, f1: 0.9, precision: 0.88, recall: 0.92, auc: 0.93, latencyMs: 57 }
  }
];

const DATASET_LIBRARY = [
  {
    id: 'credit-card-fraud',
    name: 'Credit Card Fraud Detection',
    domain: 'Finance',
    taskType: 'Binary Classification',
    size: '284,807 rows',
    baselineDifficulty: 0.72
  },
  {
    id: 'telecom-churn',
    name: 'Telecom Customer Churn',
    domain: 'Telecom',
    taskType: 'Binary Classification',
    size: '7,043 rows',
    baselineDifficulty: 0.5
  },
  {
    id: 'covtype',
    name: 'Forest Cover Type',
    domain: 'Geospatial',
    taskType: 'Multi-class Classification',
    size: '581,012 rows',
    baselineDifficulty: 0.65
  },
  {
    id: 'adult-income',
    name: 'Adult Income',
    domain: 'Socioeconomic',
    taskType: 'Binary Classification',
    size: '48,842 rows',
    baselineDifficulty: 0.55
  }
];

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
  const dataset = DATASET_LIBRARY.find((item) => item.id === datasetId) || DATASET_LIBRARY[0];

  const stressScore = computeStress({ driftLevel, noiseLevel, imbalanceLevel, shiftLevel, volatility });
  const resilienceFactor = 1 - dataset.baselineDifficulty * 0.25;

  const timeline = [];

  for (let step = 0; step < timeSteps; step += 1) {
    const progression = step / Math.max(timeSteps - 1, 1);
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
    config: { timeSteps, driftLevel, noiseLevel, imbalanceLevel, shiftLevel, volatility },
    timeline,
    summary
  };
};

module.exports = {
  MODEL_LIBRARY,
  DATASET_LIBRARY,
  runSimulation
};
