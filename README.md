# 💻 Laptop Price Prediction

A full-stack machine learning application that predicts the price of a laptop based on its hardware and software specifications.

The project uses a **Random Forest Regression model** trained on laptop specifications, a **FastAPI backend** for serving predictions, and a **React + Vite frontend** for the user interface.

The application dynamically loads valid input options from the preprocessed training dataframe, ensuring that users can only select values that are actually represented in the data used by the model.

---

## 🌐 Live Demo

### Frontend

https://laptop-price-prediction-five.vercel.app

### Backend API

https://laptop-price-prediction-w6y0.onrender.com

### API Documentation

https://laptop-price-prediction-w6y0.onrender.com/docs

---

# 📌 Project Overview

The application allows users to enter laptop specifications such as:

* Company
* Laptop type
* RAM
* Weight
* Touchscreen support
* IPS display
* Screen size
* Screen resolution
* CPU
* HDD
* SSD
* GPU
* Operating system

The submitted specifications are sent from the React frontend to the FastAPI backend.

The backend performs the same preprocessing used during model training, passes the resulting feature dataframe through the trained machine learning pipeline, reverses the logarithmic transformation applied to the target variable, and returns the predicted laptop price.

### Application flow

```text
User
 │
 ▼
React + Vite Frontend
 │
 │ HTTP request
 ▼
FastAPI Backend
 │
 ├── Input validation
 ├── PPI calculation
 ├── CPU categorization
 ├── OS categorization
 │
 ▼
Scikit-learn Pipeline
 │
 ├── OneHotEncoder
 └── RandomForestRegressor
 │
 ▼
Predicted log(price)
 │
 ▼
exp(prediction)
 │
 ▼
Predicted Laptop Price
```

---

# 🧠 Machine Learning

## Dataset

The model is trained on laptop specifications containing features such as:

```text
Company
TypeName
Ram
Weight
Price
Touchscreen
Ips
ppi
Cpu brand
HDD
SSD
Gpu brand
os
```

The target variable is:

```text
Price
```

---

# 🔧 Feature Engineering

Several transformations were performed before training the model.

## 1. Pixel Density / PPI

The dataset initially contained:

```text
X_res
Y_res
Inches
```

Pixel density was calculated using:

```python
df['ppi'] = (
    (
        (df['X_res'] ** 2) +
        (df['Y_res'] ** 2)
    ) ** 0.5
    / df['Inches']
).astype('float')
```

The resulting feature is:

```text
ppi
```

The original resolution columns are not passed directly to the final model.

---

## 2. CPU Categorization

The original CPU names were converted into broader CPU categories.

```python
def fetch_processor(text):
    if text == "Intel Core i7":
        return text
    elif text == "Intel Core i5":
        return text
    elif text == "Intel Core i3":
        return text
    else:
        if text.split()[0] == "Intel":
            return "Other Intel Processor"
        else:
            return "AMD Processor"
```

The resulting feature is:

```text
Cpu brand
```

Possible categories include:

```text
Intel Core i3
Intel Core i5
Intel Core i7
Other Intel Processor
AMD Processor
```

---

## 3. Operating System Categorization

Operating systems were grouped into broader categories.

```python
def categorize_os(os_name):
    if os_name in ["Windows 10", "Windows 10 S", "Windows 7"]:
        return "Windows"

    if os_name in ["macOS", "MAC OS X"]:
        return "Mac"

    return "Other/No OS/Linux"
```

The resulting feature is:

```text
os
```

---

# 🎯 Target Transformation

The target variable was transformed using the natural logarithm:

```python
y = np.log(df['Price'])
```

Therefore, the model predicts:

```text
log(Price)
```

rather than the raw laptop price.

After prediction, the transformation is reversed:

```python
price = np.exp(prediction)
```

This converts the model output back to the original price scale.

---

# 🤖 Machine Learning Model

The project uses a **Random Forest Regressor** inside a Scikit-learn Pipeline.

## Preprocessing

Categorical features are one-hot encoded using:

```python
OneHotEncoder(
    sparse_output=False,
    drop="first"
)
```

The categorical columns used for encoding are:

```text
Company
TypeName
Cpu brand
Gpu brand
os
```

The preprocessing is implemented using a `ColumnTransformer`.

---

## Random Forest Configuration

The model was trained using:

```python
RandomForestRegressor(
    n_estimators=100,
    random_state=3,
    max_samples=0.5,
    max_features=0.75,
    max_depth=15
)
```

The complete pipeline is:

```python
pipe = Pipeline([
    ('step1', step1),
    ('step2', step2)
])
```

This is important because the preprocessing and model are saved together.

---

# 💾 Model Export

After training, the complete pipeline and dataframe were serialized using Python's `pickle` module.

```python
pickle.dump(df, open('df.pkl', 'wb'))
pickle.dump(pipe, open('pipe.pkl', 'wb'))
```

The resulting files are:

```text
pipe.pkl
df.pkl
```

### `pipe.pkl`

Contains the complete machine learning pipeline:

```text
Input Data
   ↓
ColumnTransformer
   ↓
OneHotEncoder
   ↓
RandomForestRegressor
```

### `df.pkl`

Contains the processed dataframe used by the API to determine valid input options.

---

# 🚀 Backend

The backend is built using:

* Python
* FastAPI
* Pandas
* NumPy
* Scikit-learn
* Pydantic
* Uvicorn

## Backend structure

```text
backend/
│
├── main.py
├── schemas.py
├── utils.py
├── requirements.txt
│
└── model/
    ├── pipe.pkl
    └── df.pkl
```

---

# 📋 API Input Schema

The FastAPI backend validates incoming prediction requests using Pydantic.

```python
class LaptopInput(BaseModel):
    Company: str
    TypeName: str
    Ram: int
    Weight: float
    Touchscreen: int
    Ips: int

    Inches: float
    X_res: int
    Y_res: int

    Cpu: str
    HDD: int
    SSD: int
    Gpu: str
    OpSys: str
```

This prevents malformed request bodies from reaching the model.

---

# 🔌 API Endpoints

## `GET /`

Checks whether the API is running.

### Response

```json
{
    "message": "Laptop Price Prediction API is running"
}
```

---

# `GET /options`

Returns valid values available in the dataframe used by the model.

Example:

```json
{
    "Company": [
        "Acer",
        "Apple",
        "Asus",
        "Dell"
    ],
    "TypeName": [
        "2 in 1 Convertible",
        "Gaming",
        "Notebook",
        "Ultrabook"
    ],
    "Ram": [
        2,
        4,
        6,
        8,
        12,
        16,
        24,
        32,
        64
    ]
}
```

The frontend uses this endpoint to populate its dropdowns.

### Why dynamic options are used

Instead of hardcoding values such as:

```text
Apple
Dell
HP
Lenovo
```

the frontend obtains the available values from the backend.

This means the UI reflects the data available to the deployed model.

For example, if a particular category was removed during preprocessing and therefore does not exist in `df.pkl`, it will not appear in `/options`.

This reduces the possibility of sending unsupported categorical values to the model.

---

# `POST /predict`

Predicts the price of a laptop.

### Example request

```json
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
    "SSD": 128,
    "Gpu_brand": "Intel",
    "OpSys": "Mac"
}
```

### Example response

```json
{
    "Predicted Price": 72749.52
}
```

---

# 🔄 Prediction Processing

When `/predict` receives a request, the backend performs the following operations.

### Step 1 — Calculate PPI

```text
X resolution
Y resolution
Screen size
       ↓
     PPI
```

### Step 2 — Categorize CPU

```text
Raw CPU
   ↓
fetch_processor()
   ↓
Cpu brand
```

### Step 3 — Categorize operating system

```text
Raw OS
   ↓
categorize_os()
   ↓
os
```

### Step 4 — Construct model dataframe

The API creates a dataframe containing the exact features expected by the trained pipeline.

```text
Company
TypeName
Ram
Weight
Touchscreen
Ips
ppi
Cpu brand
HDD
SSD
Gpu brand
os
```

### Step 5 — Run prediction

```python
prediction = pipe.predict(input_df)
```

### Step 6 — Reverse logarithmic transformation

```python
price = np.exp(prediction[0])
```

### Step 7 — Return price

```json
{
    "Predicted Price": 59186.87
}
```

---

# 🎨 Frontend

The frontend is built using:

* React
* Vite
* Tailwind CSS
* Axios

The interface provides a dark, glassmorphism-style laptop price prediction form.

---

# 🖥️ Frontend Features

The frontend includes:

* Dynamic dropdown options
* Laptop specification form
* RAM selection
* CPU selection
* GPU selection
* Storage selection
* Operating system selection
* Touchscreen selection
* IPS selection
* Screen size input
* Screen resolution selection
* Weight input
* Price prediction
* Loading/error handling
* Responsive design

---

# 🔗 Frontend ↔ Backend Communication

The frontend communicates with FastAPI using HTTP requests.

Example:

```javascript
axios.get(`${API_URL}/options`)
```

and:

```javascript
axios.post(`${API_URL}/predict`, formData)
```

The API URL is configured using a Vite environment variable.

---

# 🔐 Environment Variables

The frontend uses:

```text
VITE_API_URL
```

## Local development

Create:

```text
frontend/.env
```

with:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Production

The Vercel environment variable is:

```env
VITE_API_URL=https://laptop-price-prediction-w6y0.onrender.com
```

This prevents the frontend from being permanently tied to the local development server.

---

# 🌍 CORS

Because the frontend and backend are deployed on different domains, Cross-Origin Resource Sharing (CORS) is enabled in FastAPI.

Allowed origins include:

```text
http://localhost:5173
```

and:

```text
https://laptop-price-prediction-five.vercel.app
```

This allows the React application to communicate with the FastAPI server from the browser.

---

# ☁️ Deployment

The project is deployed using two services.

```text
React + Vite
     ↓
  Vercel
     │
     │ HTTPS
     ▼
  FastAPI
     ↓
  Render
     ↓
pipe.pkl
```

## Frontend deployment

The React/Vite frontend is deployed on:

**Vercel**

Live application:

```text
https://laptop-price-prediction-five.vercel.app
```

---

## Backend deployment

The FastAPI backend is deployed on:

**Render**

API:

```text
https://laptop-price-prediction-w6y0.onrender.com
```

Swagger documentation:

```text
https://laptop-price-prediction-w6y0.onrender.com/docs
```

---

# 📁 Complete Project Structure

```text
laptop-price-prediction/
│
├── backend/
│   │
│   ├── main.py
│   ├── schemas.py
│   ├── utils.py
│   ├── requirements.txt
│   │
│   └── model/
│       ├── pipe.pkl
│       └── df.pkl
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── LaptopForm.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ...
│   │
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── .gitignore
└── README.md
```

---

# 🛠️ Local Setup

## Prerequisites

Install:

* Python 3.x
* Node.js
* npm
* Git

---

## 1. Clone the repository

```bash
git clone https://github.com/PranavThaker/Laptop-Price-Prediction/
cd laptop-price-prediction
```

---

# 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

Backend will be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Add:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start Vite:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🧪 Testing

The API can be tested using FastAPI Swagger UI:

```text
http://127.0.0.1:8000/docs
```

The main test cases are:

### Valid prediction

Submit a complete laptop configuration and verify that a price is returned.

### Missing field

Remove a required field.

Expected result:

```text
422 Unprocessable Entity
```

### Invalid categorical value

Try a category that isn't represented by the model's available options.

The frontend prevents this by using `/options`.

### Negative weight

The API should reject invalid physical values once numeric validation constraints are configured.

### Invalid screen size

Screen size should be greater than zero because it is used as the denominator when calculating PPI.

### Invalid resolution

Ensure X and Y resolution values are valid positive integers.

### Zero screen size

This should be rejected because:

```text
PPI = pixel resolution / screen size
```

and division by zero is invalid.

### Extreme values

Test unusually large values for:

```text
RAM
Weight
Screen size
HDD
SSD
Resolution
```

to evaluate model behavior and API validation.

---

# ⚠️ Important Machine Learning Consideration

A machine learning model does not necessarily produce monotonic predictions.

For example, a higher CPU tier does not guarantee that the predicted price will always be higher.

It is possible for:

```text
Intel Core i5 → ₹47,233
Intel Core i7 → ₹43,655
```

to occur.

This does not automatically indicate a programming error.

Random Forest models learn patterns from the training data rather than enforcing rules such as:

```text
i7 > i5 > i3
```

The prediction depends on the complete combination of features.

For example:

```text
Company
Laptop type
RAM
Weight
Display
CPU
GPU
SSD
HDD
OS
```

all contribute to the prediction.

Therefore, individual feature changes should not be interpreted as guaranteed price increases unless the model or training methodology explicitly enforces such relationships.

---

# 🔒 Input Validation

The application uses Pydantic for API-level validation.

Additional domain validation can be added using constraints such as:

```python
from pydantic import BaseModel, Field

class LaptopInput(BaseModel):
    Company: str
    TypeName: str

    Ram: int = Field(gt=0)
    Weight: float = Field(gt=0)

    Touchscreen: int
    Ips: int

    Inches: float = Field(gt=0)
    X_res: int = Field(gt=0)
    Y_res: int = Field(gt=0)

    Cpu: str

    HDD: int = Field(ge=0)
    SSD: int = Field(ge=0)

    Gpu_brand: str
    OpSys: str
```

Frontend validation should also be implemented for a better user experience, while backend validation remains the final security and data-integrity boundary.

---

# 🔍 Why `/options` Is Dynamic

A major design decision in this project is that categorical options are not manually duplicated between the model, backend, and frontend.

Instead:

```text
df.pkl
   ↓
FastAPI /options
   ↓
React
   ↓
Dropdowns
```

This reduces inconsistencies between:

```text
Training data
API
Frontend
```

If the training dataframe changes, the available options returned by the API change accordingly after the new `df.pkl` is deployed.

---

# 🔐 Security Considerations

The application currently exposes prediction functionality publicly.

For a production system, consider adding:

* Rate limiting
* Authentication if required
* Request logging
* Input bounds
* HTTPS
* Monitoring
* API versioning
* Model versioning
* Better exception handling
* Restricted CORS origins
* Dependency vulnerability scanning

Do not store API keys, passwords, database credentials, or other secrets in GitHub.

---

# 📦 Dependencies

### Backend

```text
FastAPI
Uvicorn
Pandas
NumPy
Scikit-learn
Pydantic
```

### Frontend

```text
React
Vite
Axios
Tailwind CSS
```

---

# 🧩 Model Reproducibility

The model artifact:

```text
pipe.pkl
```

contains the trained preprocessing pipeline and Random Forest model.

The Scikit-learn version used to train the model should remain compatible with the version used to load it in production.

For this reason, the backend dependency versions should be pinned when deploying the model.

For example:

```text
scikit-learn==<training-version>
```

Changing the Scikit-learn version without testing the serialized model can result in compatibility warnings or loading failures.

---

# 🚀 Production Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ React + Vite         │
                         │ Hosted on Vercel     │
                         └──────────┬───────────┘
                                    │
                              HTTPS / Axios
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ FastAPI              │
                         │ Hosted on Render     │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
              ┌───────────┐                   ┌───────────┐
              │ df.pkl    │                   │ pipe.pkl  │
              │           │                   │           │
              │ Valid     │                   │ ML Model  │
              │ Options   │                   │ Pipeline  │
              └───────────┘                   └─────┬─────┘
                                                     │
                                                     ▼
                                             Random Forest
                                                     │
                                                     ▼
                                            Price Prediction
```

---

# 📈 Future Improvements

Potential improvements include:

* Better frontend validation
* Confidence/uncertainty estimates
* Model performance dashboard
* Prediction history
* User authentication
* Database integration
* Model versioning
* Automated model retraining
* Feature importance visualization
* Prediction explanations
* Price comparison with similar laptops
* Monitoring model drift
* API rate limiting
* Automated CI/CD
* Unit and integration tests

---

# 📊 Model Evaluation

The model was evaluated using:

### R² Score

```python
0.8863
```

### Mean Absolute Error

```python
 0.15923526318538234
```

These metrics were calculated on the test dataset during model development.

---

# 🧑‍💻 Technologies Used

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Machine Learning | Scikit-learn            |
| Model            | Random Forest Regressor |
| Data Processing  | Pandas, NumPy           |
| Serialization    | Pickle                  |
| Backend          | FastAPI                 |
| API Server       | Uvicorn                 |
| Validation       | Pydantic                |
| Frontend         | React                   |
| Build Tool       | Vite                    |
| HTTP Client      | Axios                   |
| Styling          | Tailwind CSS            |
| Backend Hosting  | Render                  |
| Frontend Hosting | Vercel                  |

---


---

# 👤 Author

**Pranav Thaker**

GitHub:

```text
https://github.com/PranavThaker
```

---

# ⭐ Acknowledgements

This project was developed as a full-stack machine learning application combining:

```text
Machine Learning
       +
FastAPI
       +
React
       +
Vite
       +
Tailwind CSS
       +
Cloud Deployment
```

The project demonstrates how a trained machine learning model can be converted into a production-oriented API and consumed by a modern frontend application.

