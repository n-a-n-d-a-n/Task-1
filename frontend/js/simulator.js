let simChart;

const renderSummary = (simulation) => {
  const summaryGrid = document.querySelector('#summary-grid');
  const { summary, model, dataset } = simulation;

  summaryGrid.innerHTML = `
    <div class="col-md-4"><div class="p-3 bg-light rounded"><small class="text-muted">Model</small><div class="fw-bold">${model.name}</div></div></div>
    <div class="col-md-4"><div class="p-3 bg-light rounded"><small class="text-muted">Dataset</small><div class="fw-bold">${dataset.name}</div></div></div>
    <div class="col-md-4"><div class="p-3 bg-light rounded"><small class="text-muted">Stability Grade</small><div class="fw-bold">${summary.stabilityGrade}</div></div></div>
    <div class="col-md-6"><div class="p-3 bg-light rounded"><small class="text-muted">Accuracy Drop</small><div class="fw-bold">${summary.performanceDrop.accuracy}</div></div></div>
    <div class="col-md-6"><div class="p-3 bg-light rounded"><small class="text-muted">Failure Risk</small><div class="fw-bold">${summary.failureRisk}</div></div></div>
    <div class="col-md-6"><div class="p-3 bg-light rounded"><small class="text-muted">Trained On</small><div class="fw-bold">${model.trainedOn}</div></div></div>
    <div class="col-md-6"><div class="p-3 bg-light rounded"><small class="text-muted">Artifact</small><div class="fw-bold">${model.artifactFile}</div></div></div>
  `;
};

const renderChart = (timeline) => {
  const labels = timeline.map((point) => `T${point.step}`);
  const accuracy = timeline.map((point) => point.metrics.accuracy);
  const f1 = timeline.map((point) => point.metrics.f1);
  const auc = timeline.map((point) => point.metrics.auc);

  const ctx = document.querySelector('#simChart');

  if (simChart) {
    simChart.destroy();
  }

  simChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Accuracy', data: accuracy, borderColor: '#1e40af', tension: 0.25 },
        { label: 'F1 Score', data: f1, borderColor: '#f59e0b', tension: 0.25 },
        { label: 'AUC', data: auc, borderColor: '#16a34a', tension: 0.25 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          min: 0.4,
          max: 1
        }
      }
    }
  });
};

const populateCatalog = async () => {
  const catalog = await apiRequest('/simulations/catalog');

  const modelSelect = document.querySelector('#model');
  const datasetSelect = document.querySelector('#dataset');

  modelSelect.innerHTML = catalog.models
    .map((model) => `<option value="${model.id}">${model.name} (${model.family})</option>`)
    .join('');

  datasetSelect.innerHTML = catalog.datasets
    .map((dataset) => `<option value="${dataset.id}">${dataset.name} - ${dataset.domain}</option>`)
    .join('');
};

const handleSimulate = async (event) => {
  event.preventDefault();

  const alertContainer = document.querySelector('#sim-alert');
  const submitButton = document.querySelector('#simulate-btn');

  const payload = {
    modelId: document.querySelector('#model').value,
    datasetId: document.querySelector('#dataset').value,
    timeSteps: Number(document.querySelector('#timeSteps').value),
    driftLevel: Number(document.querySelector('#drift').value),
    noiseLevel: Number(document.querySelector('#noise').value),
    imbalanceLevel: Number(document.querySelector('#imbalance').value),
    shiftLevel: Number(document.querySelector('#shift').value),
    volatility: Number(document.querySelector('#volatility').value)
  };

  try {
    showLoading(submitButton, true, 'Simulating...');
    const response = await apiRequest('/simulations/run', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    renderChart(response.simulation.timeline);
    renderSummary(response.simulation);
    showAlert(alertContainer, response.message, 'success');
  } catch (error) {
    showAlert(alertContainer, error.message);
  } finally {
    showLoading(submitButton, false, 'Run Simulation');
  }
};

const initSimulator = async () => {
  try {
    await populateCatalog();
    document.querySelector('#sim-form').addEventListener('submit', handleSimulate);
    document.querySelector('#sim-form').dispatchEvent(new Event('submit'));
  } catch (error) {
    showAlert(document.querySelector('#sim-alert'), error.message);
  }
};

document.addEventListener('DOMContentLoaded', initSimulator);
