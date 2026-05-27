import pandas as pd
import numpy as np
from faker import Faker
import random
from tqdm import tqdm

fake = Faker()
Faker.seed(101)
np.random.seed(101)

def generate_smart_insurance_data(num_records):
    print(f"Generating {num_records} structured medical records...")
    data = []
    
    for _ in tqdm(range(num_records)):
        # 1. Demographics
        applicant_id = fake.unique.random_number(digits=8)
        first_name = fake.first_name()
        last_name = fake.last_name()
        age = random.randint(20, 70)
        gender = random.choice(["Male", "Female"])
        coverage_requested = random.choice([100000, 250000, 500000, 1000000])
        
        # 2. Base Health Behaviors
        smoker = random.choices(["Yes", "No"], weights=[0.15, 0.85])[0]
        bmi = round(random.uniform(18.5, 35.0) + (age // 20), 1)
        
        # 3. Correlated Vitals (The "Smart" Data for ML)
        # BP and Cholesterol rise naturally with age, BMI, and smoking
        systolic_bp = int(np.random.normal(115, 10)) + int(bmi - 20) + (15 if smoker == "Yes" else 0) + (age // 10)
        diastolic_bp = int(np.random.normal(75, 8)) + int((bmi - 20) / 2) + (10 if smoker == "Yes" else 0)
        cholesterol = int(np.random.normal(180, 20)) + int(bmi * 2) + (30 if smoker == "Yes" else 0)
        fasting_blood_sugar = int(np.random.normal(90, 10)) + (20 if bmi > 30 else 0)
        
        # 4. Underwriting Logic (The Target Variables)
        # If vitals are dangerous, downgrade the risk class and hike the premium
        if systolic_bp > 150 or cholesterol > 250 or (smoker == "Yes" and age > 50):
            risk_class = "Declined"
            premium = 0
            decision_reason = "Critical vitals exceed maximum allowable underwriting thresholds."
        elif systolic_bp > 135 or cholesterol > 220 or bmi > 30 or smoker == "Yes":
            risk_class = "Substandard (High Risk)"
            premium = random.randint(300, 600) + (coverage_requested // 5000)
            decision_reason = "Elevated risk markers present; premium adjusted for mortality risk."
        elif systolic_bp > 125 or cholesterol > 200:
            risk_class = "Standard"
            premium = random.randint(150, 299) + (coverage_requested // 10000)
            decision_reason = "Standard health profile; approved at base rates."
        else:
            risk_class = "Preferred Plus"
            premium = random.randint(50, 149) + (coverage_requested // 20000)
            decision_reason = "Excellent health profile; approved at preferred discount."

        data.append([
            applicant_id, first_name, last_name, age, gender, coverage_requested,
            bmi, smoker, systolic_bp, diastolic_bp, cholesterol, fasting_blood_sugar,
            risk_class, premium, decision_reason
        ])

    columns = [
        "Applicant_ID", "First_Name", "Last_Name", "Age", "Gender", "Coverage_Requested",
        "BMI", "Smoker", "Systolic_BP", "Diastolic_BP", "Cholesterol", "Fasting_Blood_Sugar",
        "Risk_Class", "Approved_Premium", "Decision_Reason"
    ]
    
    df = pd.DataFrame(data, columns=columns)
    df.to_csv("corebridge_synthetic_claims.csv", index=False)
    print("\nCSV Generation Complete: 'corebridge_synthetic_claims.csv'")

# Generating 25,000 records. This provides plenty of data for XGBoost.
generate_smart_insurance_data(25000)