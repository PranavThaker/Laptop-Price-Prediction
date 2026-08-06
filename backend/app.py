from fastapi import FastAPI
import numpy as np
import pandas as pd
import pickle
from fastapi.middleware.cors import CORSMiddleware

from schemas import LaptopInput
from utils import fetch_processor, categorize_os


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
        "gpu": sorted(df["Gpu brand"].unique().tolist())
    }