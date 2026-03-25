const test = require('node:test');
const assert = require('node:assert/strict');

const { MODEL_LIBRARY, DATASET_LIBRARY, runSimulation } = require('../services/simulationEngine');

test('catalogs are loaded from manifest', () => {
  assert.ok(Array.isArray(MODEL_LIBRARY));
  assert.ok(Array.isArray(DATASET_LIBRARY));
  assert.ok(MODEL_LIBRARY.length > 0);
  assert.ok(DATASET_LIBRARY.length > 0);
});

test('runSimulation returns timeline with normalized timeSteps', () => {
  const result = runSimulation({
    modelId: MODEL_LIBRARY[0].id,
    datasetId: DATASET_LIBRARY[0].id,
    timeSteps: 2
  });

  assert.equal(result.config.timeSteps, 4);
  assert.equal(result.timeline.length, 4);
  assert.ok(result.summary.stabilityGrade);
});

test('high stress should degrade f1 over time', () => {
  const result = runSimulation({
    modelId: MODEL_LIBRARY[0].id,
    datasetId: DATASET_LIBRARY[0].id,
    timeSteps: 20,
    driftLevel: 1,
    noiseLevel: 1,
    imbalanceLevel: 1,
    shiftLevel: 1,
    volatility: 1
  });

  const first = result.timeline[0].metrics.f1;
  const last = result.timeline[result.timeline.length - 1].metrics.f1;
  assert.ok(first >= last);
});
