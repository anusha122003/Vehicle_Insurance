import os
import shutil
import pandas as pd
from fastapi import FastAPI, UploadFile, File, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from typing import List, Optional

# Import damage detector from role2
import sys
sys.path.append(str(Path(__file__).parent / "role2"))
from damage_detector import assess_damage

app = FastAPI(title="AutoShield Claims API", version="1.0.0")

# Enable CORS for React frontend (Vite runs on port 5173 by default)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_PATH = Path(__file__).parent / "processed_claims.csv"

def load_claims_df() -> pd.DataFrame:
    if not CSV_PATH.exists():
        raise FileNotFoundError("processed_claims.csv not found. Run dataset_mapper.py first.")
    df = pd.read_csv(CSV_PATH)
    df["FraudBinary"] = (df["FraudFound"] == "Yes").astype(int)
    # Handle NaNs
    df = df.fillna({
        "CV_Damage_Type": "unknown",
        "CV_Damage_Pct": 0.0,
        "EstimatedPayout": 0.0,
        "Deductible": 0.0
    })
    return df

@app.get("/api/claims")
def get_claims(
    year: Optional[List[int]] = Query(None),
    make: Optional[List[str]] = Query(None),
    base_policy: Optional[List[str]] = Query(None),
    fraud_status: Optional[str] = Query("All")
):
    df = load_claims_df()
    
    # Apply filters
    if year:
        df = df[df["Year"].isin(year)]
    if make:
        df = df[df["Make"].isin(make)]
    if base_policy:
        df = df[df["BasePolicy"].isin(base_policy)]
        
    if fraud_status == "Fraudulent Only":
        df = df[df["FraudBinary"] == 1]
    elif fraud_status == "Legitimate Only":
        df = df[df["FraudBinary"] == 0]

    # Convert to JSON record list (limit to 1000 for network performance)
    records = df.head(1000).to_dict(orient="records")
    return {
        "total_filtered": len(df),
        "claims": records
    }

@app.get("/api/filters")
def get_filter_options():
    df = load_claims_df()
    return {
        "years": sorted(df["Year"].dropna().unique().tolist()),
        "makes": sorted(df["Make"].dropna().unique().tolist()),
        "base_policies": sorted(df["BasePolicy"].dropna().unique().tolist())
    }

@app.get("/api/metrics")
def get_metrics(
    year: Optional[List[int]] = Query(None),
    make: Optional[List[str]] = Query(None),
    base_policy: Optional[List[str]] = Query(None),
    fraud_status: Optional[str] = Query("All")
):
    df = load_claims_df()
    
    # Apply same filters for consistency
    if year:
        df = df[df["Year"].isin(year)]
    if make:
        df = df[df["Make"].isin(make)]
    if base_policy:
        df = df[df["BasePolicy"].isin(base_policy)]
        
    if fraud_status == "Fraudulent Only":
        df = df[df["FraudBinary"] == 1]
    elif fraud_status == "Legitimate Only":
        df = df[df["FraudBinary"] == 0]

    total = len(df)
    fraud_count = int(df["FraudBinary"].sum()) if total else 0
    fraud_rate = float(fraud_count / total * 100) if total else 0.0
    total_payout = float(df["EstimatedPayout"].sum()) if total else 0.0
    avg_payout = float(df["EstimatedPayout"].mean()) if total else 0.0
    avg_damage = float(df["CV_Damage_Pct"].mean()) if total else 0.0
    unique_policies = int(df["PolicyNumber"].nunique()) if total else 0

    return {
        "total_claims": total,
        "fraud_count": fraud_count,
        "fraud_rate_pct": round(fraud_rate, 2),
        "total_payout": round(total_payout, 2),
        "avg_payout": round(avg_payout, 2),
        "avg_damage_pct": round(avg_damage, 2),
        "unique_policies": unique_policies
    }

# Temporary upload folder
UPLOAD_DIR = Path(__file__).parent / "temp_uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

@app.post("/api/assess")
async def assess_car_damage(
    file: UploadFile = File(...),
    vehicle_price: float = Form(25000.0),
    deductible: float = Form(500.0)
):
    # Save uploaded file
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Assess damage using hybrid AI-CV model
        result = assess_damage(str(file_path), vehicle_price=vehicle_price, deductible=deductible)
        
        # Cleanup uploaded file if requested, or keep it as history
        if file_path.exists():
            os.remove(file_path)
            
        return result
    except Exception as e:
        if file_path.exists():
            os.remove(file_path)
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
