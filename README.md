# 💻 Laptop Price Prediction

A full-stack machine learning application that predicts a laptop's price from its hardware and software specifications — a trained **Random Forest Regression** model served through a **FastAPI** backend, with a **React + Vite** frontend for the UI.

The frontend never hardcodes dropdown values. Instead, it pulls valid options live from the backend's `/options` endpoint, which reflects exactly what the trained model actually saw during training — so users can never submit a combination the model wasn't trained on.

## 🌐 Live Demo

| | |
|---|---|
| Frontend | https://laptop-price-prediction-five.vercel.app |
| Backend API | https://laptop-price-prediction-w6y0.onrender.com |
| API Docs (Swagger) | https://laptop-price-prediction-w6y0.onrender.com/docs |

## Overview

The user fills in specs — company, type, RAM, weight, display, CPU, storage, GPU, OS — on the React frontend. That request hits the FastAPI backend, which:
1. Validates the payload with Pydantic
2. Re-derives the same engineered features used at training time (pixel density, CPU category, OS category)
3. Runs the feature vector through the saved Scikit-learn pipeline
4. Reverses the log-transform applied to the target and returns the predicted price

```
User
 │
 ▼
React + Vite Frontend  ──HTTP──▶  FastAPI Backend
                                       │
                                       ├─ Pydantic validation
                                       ├─ PPI calculation
                                       ├─ CPU / OS categorization
                                       ▼
                              Scikit-learn Pipeline
                              (OneHotEncoder → RandomForestRegressor)
                                       │
                                       ▼
                              Predicted log(price) → exp() → Price
```

## Machine learning

**Dataset:** a synthetic dataset calibrated to current Indian retail laptop pricing, with features including company, type, RAM, weight, screen specs, CPU, storage (HDD/SSD), GPU, and OS.

**Models compared:** Linear Regression, Ridge Regression, KNN, Random Forest, and XGBoost. **Random Forest** gave the best result and was selected as the final model.

| Metric | Score |
|---|---|
| R² | 0.886 |
| MAE | 0.159 (on log-transformed price) |

**Key feature engineering steps:**
- **PPI (pixels per inch)** computed from resolution + screen size, replacing raw resolution columns
- **CPU categorization** — collapses dozens of specific CPU names into `Intel Core i3/i5/i7`, `Other Intel Processor`, or `AMD Processor`
- **OS categorization** — collapses OS versions into `Windows`, `Mac`, or `Other/No OS/Linux`
- **Log-transformed target** (`log(Price)`) to reduce skew, with `exp()` applied to predictions to return the actual price

The trained pipeline (preprocessing + model together) and the processed dataframe are serialized with `pickle` as `pipe.pkl` and `df.pkl`, so the API loads one artifact rather than reimplementing preprocessing separately.

## Tech stack

| Layer | Technology |
|---|---|
| Machine learning | Scikit-learn, Random Forest Regressor |
| Data processing | Pandas, NumPy |
| Backend | FastAPI, Uvicorn, Pydantic |
| Frontend | React, Vite, Tailwind CSS, Axios |
| Hosting | Vercel (frontend), Render (backend) |

## Project structure

```
Laptop-Price-Prediction/
├── backend/
│   ├── app.py                 # FastAPI app: /predict, /options endpoints
│   ├── schemas.py              # Pydantic request schema
│   ├── utils.py                 # CPU/OS categorization helpers
│   ├── model/
│   │   ├── pipe.pkl              # Trained sklearn pipeline
│   │   └── df.pkl                # Processed dataframe (valid options source)
│   ├── notebooks/
│   │   └── laptop-price-predictor.ipynb   # EDA + model training/comparison
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # LaptopForm, SelectField, PredictionCard, etc.
│   │   ├── pages/Home.jsx
│   │   └── api/laptopApi.js       # Axios client for the backend
│   └── package.json
└── README.md
```

## API

**`GET /options`** — returns the valid categorical/numeric values available in the training data, used to populate the frontend's dropdowns dynamically.

**`POST /predict`** — accepts a full laptop specification and returns the predicted price.

```json
// Request
{
  "Company": "Apple",
  "TypeName": "Ultrabook",
  "Ram": 8,
  "Weight": 1.37,
  "Touchscreen": 0,
  "Ips": 1,
  "Inches": 13.3,
  "X_res": 2560,
  "Y_res": 1600,
  "Cpu": "Intel Core i5",
  "HDD": 0,
  "SSD": 256,
  "Gpu": "Intel",
  "OpSys": "Mac"
}

// Response
{
  "Predicted Price": 71203.45
}
```

Any categorical value not seen during training (e.g. a CPU or GPU brand outside the trained set) is rejected with a `400` and a descriptive error, rather than silently mispredicting.

## Running locally

**1. Clone and enter the project**
```bash
git clone https://github.com/PranavThaker/Laptop-Price-Prediction.git
cd Laptop-Price-Prediction
```

**2. Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app:app --reload
```
API runs at `http://127.0.0.1:8000` (Swagger docs at `/docs`).

**3. Frontend** (in a separate terminal)
```bash
cd frontend
npm install
echo "VITE_API_URL=http://127.0.0.1:8000" > .env
npm run dev
```
App runs at `http://localhost:5173`.

## A note on model behavior

Random Forest models learn patterns from data rather than enforcing domain rules — so a "better" spec (e.g. i7 vs i5) won't always yield a strictly higher predicted price. The prediction reflects the full combination of features rather than any single one in isolation, which is expected behavior for this model family and not a bug.
