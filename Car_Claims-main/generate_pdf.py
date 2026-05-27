import pandas as pd
from fpdf import FPDF
import os
from tqdm import tqdm
from datetime import datetime, timedelta
import random

# Create directory for the massive PDF dataset
output_dir = "medical_records_dataset"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

print("Loading CSV data...")
df = pd.read_csv("corebridge_synthetic_claims.csv")

def create_multipage_medical_pdf(row):
    pdf = FPDF()
    
    # --- PAGE 1: Applicant Summary ---
    pdf.add_page()
    pdf.set_font("Arial", "B", 18)
    pdf.cell(200, 10, txt="COREBRIDGE FINANCIAL - PARAMEDICAL EXAM", ln=True, align="C")
    pdf.set_font("Arial", "I", 10)
    
    exam_date = (datetime.now() - timedelta(days=random.randint(5, 60))).strftime("%Y-%m-%d")
    pdf.cell(200, 10, txt=f"Date of Examination: {exam_date}", ln=True, align="C")
    pdf.line(10, 30, 200, 30)
    pdf.ln(10)
    
    # Patient Demographics
    pdf.set_font("Arial", "B", 12)
    pdf.cell(200, 10, txt="Section 1: Applicant Demographics", ln=True)
    pdf.set_font("Arial", "", 11)
    pdf.cell(100, 8, txt=f"Name: {row['Last_Name']}, {row['First_Name']}", ln=False)
    pdf.cell(100, 8, txt=f"Applicant ID: {row['Applicant_ID']}", ln=True)
    pdf.cell(100, 8, txt=f"Age: {row['Age']} yrs", ln=False)
    pdf.cell(100, 8, txt=f"Gender: {row['Gender']}", ln=True)
    pdf.cell(200, 8, txt=f"Requested Coverage: ${row['Coverage_Requested']:,.2f}", ln=True)
    pdf.ln(10)
    
    # --- PAGE 2: Lab Results & Clinical Notes ---
    pdf.add_page()
    pdf.set_font("Arial", "B", 12)
    pdf.cell(200, 10, txt="Section 2: Laboratory & Vital Results", ln=True)
    
    # Creating a table for LayoutLM/OCR to learn from
    pdf.set_font("Arial", "B", 10)
    pdf.cell(60, 10, "Test Name", border=1)
    pdf.cell(60, 10, "Result", border=1)
    pdf.cell(60, 10, "Standard Range", border=1, ln=True)
    
    pdf.set_font("Arial", "", 10)
    pdf.cell(60, 10, "Body Mass Index (BMI)", border=1)
    pdf.cell(60, 10, str(row['BMI']), border=1)
    pdf.cell(60, 10, "18.5 - 24.9", border=1, ln=True)
    
    pdf.cell(60, 10, "Blood Pressure", border=1)
    pdf.cell(60, 10, f"{row['Systolic_BP']} / {row['Diastolic_BP']}", border=1)
    pdf.cell(60, 10, "< 120 / 80", border=1, ln=True)
    
    pdf.cell(60, 10, "Total Cholesterol", border=1)
    pdf.cell(60, 10, f"{row['Cholesterol']} mg/dL", border=1)
    pdf.cell(60, 10, "< 200 mg/dL", border=1, ln=True)
    
    pdf.cell(60, 10, "Fasting Blood Sugar", border=1)
    pdf.cell(60, 10, f"{row['Fasting_Blood_Sugar']} mg/dL", border=1)
    pdf.cell(60, 10, "< 100 mg/dL", border=1, ln=True)
    pdf.ln(10)
    
    # Clinical Physician Notes (For GenAI RAG processing)
    pdf.set_font("Arial", "B", 12)
    pdf.cell(200, 10, txt="Section 3: Attending Physician Notes", ln=True)
    pdf.set_font("Arial", "", 11)
    
    notes = (f"The applicant, a {row['Age']}-year-old {row['Gender'].lower()}, presented for a standard "
             f"life insurance underwriting evaluation. The applicant self-reported their tobacco/nicotine "
             f"usage status as: '{row['Smoker']}'. Vitals were taken in a seated resting position. "
             f"Based on the clinical findings, the applicant's BMI is calculated at {row['BMI']}. "
             f"The blood panel and vital signs indicate the following systemic status: {row['Decision_Reason']} "
             f"All samples have been routed to the primary Corebridge actuarial lab for final verification.")
    
    pdf.multi_cell(0, 8, txt=notes)
    
    # Save file
    file_name = f"{output_dir}/{row['Applicant_ID']}_Medical_Report.pdf"
    pdf.output(file_name)

# Generate 25,000 PDFs. This will take a few minutes and push the folder over 1GB.
print(f"Generating 25,000 multi-page PDFs. This will hit the 1GB+ requirement...")
for index, row in tqdm(df.iterrows(), total=df.shape[0]):
    create_multipage_medical_pdf(row)

print("\nSuccess! 1GB+ Medical Document Dataset Generated.")