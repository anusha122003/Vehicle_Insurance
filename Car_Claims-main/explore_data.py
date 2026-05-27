import os
import pandas as pd
from pathlib import Path

# This points to where Kaggle downloaded the raw data on your computer
dataset_path = Path(r"C:\Users\mdaamir.sohail\.cache\kagglehub\datasets\sudhanshu2198\ripik-hackfest")

print("🔍 Exploring Kaggle Dataset...\n")

# 1. Look for CSV "Answer Keys"
csv_files = list(dataset_path.rglob("*.csv"))
if csv_files:
    print(f"✅ FOUND CSV FILES: {[f.name for f in csv_files]}")
    # Print the columns of the first CSV so we know how to read it
    df = pd.read_csv(csv_files[0])
    print(f"📊 Columns in {csv_files[0].name}: {df.columns.tolist()}")
    print("Sample row:")
    print(df.head(1).to_string())
else:
    print("❌ NO CSV FILES FOUND.")

print("\n-----------------------------------\n")

# 2. Look at what is actually inside the 'train' folder
train_folder = None
for p in dataset_path.rglob("train"):
    if p.is_dir():
        train_folder = p
        break

if train_folder:
    contents = os.listdir(train_folder)
    print(f"📂 Contents of the 'train' folder (showing first 5 items):")
    for item in contents[:5]:
        if os.path.isdir(os.path.join(train_folder, item)):
            print(f"   📁 [FOLDER] {item}")
        else:
            print(f"   🖼️ [FILE] {item}")
else:
    print("❌ Could not find 'train' folder.")