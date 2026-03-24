# Trained Model Artifacts

This folder stores **trained model artifacts metadata** used by the simulator.

## Files
- `model-manifest.json`: index of available models/datasets + baseline scores.
- `artifacts/*.json`: per-model exported training snapshots (feature schema, tuning notes, and baseline metrics).

## How to replace with real model binaries
For production/academic final submission, replace JSON artifacts with real files such as:
- `*.pkl` / `*.joblib` (scikit-learn)
- `*.onnx` (portable deployment)
- `*.pt` (PyTorch)

Then keep `model-manifest.json` pointing to your real files.
