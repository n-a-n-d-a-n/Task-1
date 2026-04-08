# AI Model Performance Simulator

A full-stack major-project starter that simulates how ML models degrade under real-world non-stationarity (data drift, noise, class imbalance, and distribution shift), then visualizes robustness over time.

## Why this project matters

Most ML pipelines report one-time validation performance. Production systems fail because input distributions evolve. This platform helps you:

- Evaluate degradation curves instead of single-point scores.
- Compare multiple model families under identical stress conditions.
- Detect robustness limits and failure patterns before deployment.
- Build monitoring and retraining policies using measurable thresholds.

## Current Full-Stack Features

### Frontend (multi-page)
- `index.html`: project overview and entry points.
- `methodology.html`: research-driven workflow and evaluation strategy.
- `simulator.html`: interactive stress controls + performance chart + summary cards.
- Existing auth pages (`register.html`, `login.html`, `dashboard.html`) remain available for expansion to role-based access.

### Backend
- `GET /api/simulations/catalog`: returns available models and datasets.
- `POST /api/simulations/run`: executes a configurable simulation timeline.
- Simulation engine produces per-step metrics: Accuracy, F1, Precision, Recall, AUC, Latency.

## Research-backed methodology (recommended for your semester major)

## 1) Baseline benchmark phase
For each model and dataset pair:
- Use fixed train/validation/test split (and stratification for imbalanced tasks).
- Capture baseline metrics: Accuracy, F1 (macro + weighted), ROC-AUC, PR-AUC, Brier score / ECE, latency.
- Save model cards (data version, hyperparameters, seed, feature schema).

## 2) Shift and stress protocol
Inject one perturbation at a time first, then combined stress:
- **Covariate drift**: feature means/variances shift over time.
- **Concept drift**: target conditional relationship changes.
- **Noise corruption**: label noise + feature noise.
- **Class imbalance drift**: minority proportion progressively reduced.
- **Abrupt distribution shift**: sudden domain jump at specific time step.

## 3) Time-series evaluation
At each time step `t`:
- Run inference on current slice.
- Record metric vector and stress index.
- Trigger alerts when thresholds are crossed (e.g., F1 drop > 10%).

## 4) Failure diagnostics
When failure is detected:
- Compare feature importance drift (e.g., SHAP rank correlation).
- Analyze subgroup fairness and calibration decay.
- Identify the earliest warning signal metric.

## 5) Mitigation loop
- Retraining policies: scheduled, performance-triggered, drift-triggered.
- Threshold adaptation and calibration refresh.
- Recovery benchmark: compare post-mitigation to baseline.

## Recommended models for final project version

- Logistic Regression (interpretable baseline)
- Random Forest (noise-robust baseline)
- XGBoost / LightGBM (strong tabular SOTA baseline)
- MLP / FT-Transformer (higher-capacity alternatives)
- Optional: TabPFN / CatBoost for advanced benchmarking

## Recommended datasets

- UCI Adult Income (binary tabular baseline)
- Credit Card Fraud Detection (extreme imbalance)
- Telecom Churn (business drift scenario)
- Covertype (large-scale multi-class tabular)
- Optional domain dataset from your department/lab for novelty

## Suggested project architecture (best-version target)

1. **Data Layer**: dataset registry, versioned preprocessing, shift injectors.
2. **Model Layer**: training pipelines + model zoo wrappers.
3. **Simulation Layer**: scenario generator and time-step evaluator.
4. **Monitoring Layer**: drift detectors + threshold rules.
5. **Visualization Layer**: multi-page dashboard, charts, comparative reports.
6. **Experiment Tracking**: MLflow / Weights & Biases for reproducibility.

## API quick reference

Base URL: `http://localhost:5000/api`

- `GET /health`
- `GET /simulations/catalog`
- `POST /simulations/run`

Example request:

```json
{
  "modelId": "xgboost",
  "datasetId": "credit-card-fraud",
  "timeSteps": 12,
  "driftLevel": 0.25,
  "noiseLevel": 0.15,
  "imbalanceLevel": 0.2,
  "shiftLevel": 0.1,
  "volatility": 0.08
}
```

## Run locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
python3 -m http.server 8080
```
Open `http://localhost:8080`.

## Next upgrades to make this “major-project ready”

- Add real training pipelines in Python (scikit-learn + XGBoost + LightGBM).
- Persist simulation runs in MongoDB.
- Add experiment comparison page and downloadable PDF report.
- Add role-based auth (admin/reviewer/student).
- Add CI tests for API contracts and simulation consistency.

---

## 👨‍💻 Author

**Nandan (n-a-n-d-a-n)**  
AI & Data Science Student  
🚀 Open Source Enthusiast
