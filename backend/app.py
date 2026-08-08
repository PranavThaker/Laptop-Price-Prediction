from fastapi import FastAPI,HTTPException
import numpy as np
import pandas as pd
import pickle
from fastapi.middleware.cors import CORSMiddleware

from schemas import LaptopInput
from utils import fetch_processor, categorize_os
df = pickle.load(open("model/df.pkl", "rb"))


app = FastAPI(title="Laptop Price Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

pipe = pickle.load(open("model/pipe.pkl", "rb"))
df = pickle.load(open("model/df.pkl", "rb"))


def validate_categories(input_df):
    categorical_columns = [
        "Company",
        "TypeName",
        "Cpu brand",
        "Gpu brand",
        "os"
    ]

    errors = {}

    for column in categorical_columns:

        value = input_df.iloc[0][column]

        if value not in df[column].unique():
            errors[column] = (
                f"'{value}' was not present in the training data."
            )

    return errors

@app.post("/predict")
def predict(data: LaptopInput):

    # Calculate PPI
    ppi = (((data.X_res ** 2) + (data.Y_res ** 2)) ** 0.5) / data.Inches

    # Convert CPU and OS to the categories used during training
    cpu_brand = fetch_processor(data.Cpu)
    os_name = categorize_os(data.OpSys)

    # GPU brand comes directly from user input
    gpu_brand = data.Gpu

    # Create dataframe in EXACT training order
    input_df = pd.DataFrame([{
        "Company": data.Company,
        "TypeName": data.TypeName,
        "Ram": data.Ram,
        "Weight": data.Weight,
        "Touchscreen": data.Touchscreen,
        "Ips": data.Ips,
        "ppi": ppi,
        "Cpu brand": cpu_brand,
        "HDD": data.HDD,
        "SSD": data.SSD,
        "Gpu brand": gpu_brand,
        "os": os_name
    }])
    errors = validate_categories(input_df)

    if errors:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Input contains unsupported training-data categories.",
                "errors": errors
            }
        )
    prediction = pipe.predict(input_df)[0]

    price = float(np.exp(prediction))

    return {
        "Predicted Price": round(price, 2)
    }
    
@app.get("/options")
def get_options():
    return {
        "companies": sorted(df["Company"].unique().tolist()),
        "types": sorted(df["TypeName"].unique().tolist()),
        "ram": sorted(df["Ram"].unique().tolist()),
        "hdd": sorted(df["HDD"].unique().tolist()),
        "ssd": sorted(df["SSD"].unique().tolist()),
        "gpu": sorted(df["Gpu brand"].unique().tolist()),

        "cpu": [
            "Intel Core i3",
            "Intel Core i5",
            "Intel Core i7",
            "Other Intel Processor",
            "AMD Processor"
        ],

        "os": [
            "Windows 10",
            "Windows 10 S",
            "Windows 7",
            "macOS",
            "MAC OS X",
            "Linux",
            "No OS"
        ],

        "touchscreen": [
            {
                "label": "No",
                "value": 0
            },
            {
                "label": "Yes",
                "value": 1
            }
        ],

        "ips": [
            {
                "label": "No",
                "value": 0
            },
            {
                "label": "Yes",
                "value": 1
            }
        ],

        "resolution": [
            {
                "label": "1366 × 768",
                "x": 1366,
                "y": 768
            },
            {
                "label": "1600 × 900",
                "x": 1600,
                "y": 900
            },
            {
                "label": "1920 × 1080",
                "x": 1920,
                "y": 1080
            },
            {
                "label": "2256 × 1504",
                "x": 2256,
                "y": 1504
            },
            {
                "label": "2304 × 1440",
                "x": 2304,
                "y": 1440
            },
            {
                "label": "2560 × 1440",
                "x": 2560,
                "y": 1440
            },
            {
                "label": "2560 × 1600",
                "x": 2560,
                "y": 1600
            },
            {
                "label": "2880 × 1800",
                "x": 2880,
                "y": 1800
            },
            {
                "label": "3200 × 1800",
                "x": 3200,
                "y": 1800
            },
            {
                "label": "3840 × 2160",
                "x": 3840,
                "y": 2160
            }
        ]
    }
    