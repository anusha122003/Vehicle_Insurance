"""
╔══════════════════════════════════════════════════════════════════════════════╗
║  ROLE 2 — train_model.py   (FIXED VERSION)                                 ║
║                                                                              ║
║  BUGS FIXED IN THIS VERSION:                                                ║
║                                                                              ║
║  BUG 1 — Wrong label column name                                            ║
║    OLD: df['label'] — crashes if Kaggle CSV uses different column name      ║
║    FIX: Auto-detects whether column is 'label', 'damage_class', 'class'     ║
║         etc. and maps correctly                                              ║
║                                                                              ║
║  BUG 2 — Hard-coded label → class mapping that breaks silently              ║
║    OLD: label_to_name = {label: actual_names[i] for i, label in ...}        ║
║         This maps by INDEX POSITION, so if labels are [0,1,2,3,4,5]        ║
║         it works, but if labels are [1,2,3,4,5,6] or strings, it breaks    ║
║    FIX: Proper mapping that works whether labels are integers or strings    ║
║                                                                              ║
║  BUG 3 — Silent failure when 0 images are copied to a class folder          ║
║    OLD: If no images matched a class, training would silently skip it       ║
║         YOLO would then train on incomplete data with no warning            ║
║    FIX: Validate before training — abort with clear message if < 10 images ║
║                                                                              ║
║  BUG 4 — epochs=10 is too low (model underfits)                             ║
║    FIX: epochs=30 default, early stopping at patience=5                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

HOW TO RUN:
  Step 1:  pip install -r requirements.txt
  Step 2:  Set up Kaggle API key (see below)
  Step 3:  python train_model.py
  Step 4:  Weights will be at role2_cv/best.pt

KAGGLE API KEY SETUP:
  1. Go to https://www.kaggle.com/account → "Create New API Token"
  2. This downloads kaggle.json
  3. Move it:   mv kaggle.json ~/.kaggle/kaggle.json
  4. On Mac/Linux:  chmod 600 ~/.kaggle/kaggle.json
"""

import os
import shutil
import random
import pandas as pd
from pathlib import Path
from collections import Counter


# ── Configuration ─────────────────────────────────────────────────────────────
DATASET_NAME = "sudhanshu2198/ripik-hackfest"
BASE_DIR     = Path("data/yolo_dataset")
TRAIN_DIR    = BASE_DIR / "train"
VAL_DIR      = BASE_DIR / "val"
WEIGHTS_OUT  = Path("role2_cv/best.pt")
VAL_SPLIT    = 0.2
RANDOM_SEED  = 42

# These are the 6 damage classes in the Ripik Hackfest dataset
CLASS_NAMES = ["crack", "dent", "glass_shatter", "lamp_broken", "scratch", "tire_flat"]


# ── Step 1: Download Dataset ───────────────────────────────────────────────────
def download_dataset() -> Path:
    print("=" * 60)
    print("STEP 1: Downloading dataset from Kaggle")
    print("=" * 60)

    try:
        import kagglehub
        raw_path = kagglehub.dataset_download(DATASET_NAME)
        print(f"✅ Downloaded to: {raw_path}")
        return Path(raw_path)
    except Exception as e:
        print(f"❌ Download failed: {e}")
        print("""
── MANUAL DOWNLOAD (if Kaggle API not set up) ──
1. Go to: https://www.kaggle.com/datasets/sudhanshu2198/ripik-hackfest
2. Click Download → unzip
3. Place folder contents at:  data/raw/
4. Re-run this script
        """)
        raise


# ── Step 2: Find & Validate CSV ────────────────────────────────────────────────
def load_csv(raw_path: Path) -> tuple[pd.DataFrame, str, str]:
    """
    Finds the CSV in the downloaded folder.
    Returns (dataframe, image_column_name, label_column_name).

    FIX: Instead of hard-coding column names, we detect them automatically.
    """
    print("\n" + "=" * 60)
    print("STEP 2: Loading CSV answer key")
    print("=" * 60)

    # Find all CSV files
    csvs = list(raw_path.rglob("*.csv"))
    if not csvs:
        raise FileNotFoundError(f"No CSV files found in {raw_path}")

    print(f"Found CSVs: {[c.name for c in csvs]}")

    # Prefer train.csv, else take the first one
    csv_path = next((c for c in csvs if "train" in c.name.lower()), csvs[0])
    print(f"Using: {csv_path.name}")

    df = pd.read_csv(csv_path)
    print(f"Shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
    print(f"First 3 rows:\n{df.head(3)}\n")

    # ── Auto-detect image filename column ─────────────────────────────────────
    # FIX: don't assume column is named 'filename'
    image_col = None
    for candidate in ["filename", "image", "img", "file", "image_name", "img_name"]:
        if candidate in df.columns:
            image_col = candidate
            break
    if image_col is None:
        # Fall back: pick column whose values end with common image extensions
        for col in df.columns:
            sample = str(df[col].iloc[0])
            if any(sample.lower().endswith(ext) for ext in [".jpg", ".jpeg", ".png"]):
                image_col = col
                break
    if image_col is None:
        raise ValueError(f"Cannot find image filename column. Columns: {df.columns.tolist()}")
    print(f"Image column detected: '{image_col}'")

    # ── Auto-detect label column ───────────────────────────────────────────────
    label_col = None
    for candidate in ["label", "damage_class", "class", "category", "damage", "type"]:
        if candidate in df.columns:
            label_col = candidate
            break
    if label_col is None:
        raise ValueError(f"Cannot find label column. Columns: {df.columns.tolist()}")
    print(f"Label column detected: '{label_col}'")

    # Print unique labels for visibility
    unique_labels = df[label_col].unique()
    print(f"Unique label values: {sorted(unique_labels)}")

    return df, image_col, label_col


# ── Step 3: Build Label → Class Name Mapping ───────────────────────────────────
def build_label_map(df: pd.DataFrame, label_col: str) -> dict:
    """
    FIX: Builds a robust mapping from CSV label values → class names.

    Handles 3 cases:
      Case A: Labels are already strings like "dent", "crack" → use directly
      Case B: Labels are integers 0-5 → map by sorted order
      Case C: Labels are integers 1-6 → adjust offset
    """
    print("\n" + "=" * 60)
    print("STEP 3: Building label → class name mapping")
    print("=" * 60)

    unique_labels = sorted(df[label_col].unique())
    label_map = {}

    # Case A: string labels
    if all(isinstance(v, str) for v in unique_labels):
        for lbl in unique_labels:
            clean = lbl.lower().strip().replace(" ", "_")
            if clean in CLASS_NAMES:
                label_map[lbl] = clean
            else:
                # fuzzy: find closest class name
                for cls in CLASS_NAMES:
                    if cls in clean or clean in cls:
                        label_map[lbl] = cls
                        break
        print("String labels detected — mapped directly:")

    # Case B/C: integer labels
    else:
        unique_ints = sorted(int(v) for v in unique_labels)
        # Normalise to 0-based index
        offset = min(unique_ints)
        for raw_int in unique_ints:
            idx = raw_int - offset
            if idx < len(CLASS_NAMES):
                label_map[raw_int] = CLASS_NAMES[idx]
        print(f"Integer labels detected (offset={offset}) — mapped by order:")

    for k, v in label_map.items():
        print(f"  {k!r:20s} → {v}")

    unmapped = [l for l in unique_labels if l not in label_map]
    if unmapped:
        print(f"⚠️  Unmapped labels (will be skipped): {unmapped}")

    return label_map


# ── Step 4: Scan all images from the download ──────────────────────────────────
def build_image_map(raw_path: Path) -> dict:
    """
    Returns a dict: filename → full Path object.
    Case-insensitive lookup so 'IMG_001.JPG' and 'img_001.jpg' both work.
    """
    print("\n" + "=" * 60)
    print("STEP 4: Scanning all downloaded images")
    print("=" * 60)

    image_map = {}
    for ext in ["*.jpg", "*.jpeg", "*.png", "*.bmp", "*.webp",
                "*.JPG", "*.JPEG", "*.PNG"]:
        for img in raw_path.rglob(ext):
            image_map[img.name]        = img        # original case
            image_map[img.name.lower()] = img       # lowercase fallback

    print(f"✅ Found {len(image_map) // 2} unique images")   # //2 because we store both cases
    return image_map


# ── Step 5: Sort images into train/val folders ─────────────────────────────────
def organise_dataset(df: pd.DataFrame,
                     image_col:  str,
                     label_col:  str,
                     label_map:  dict,
                     image_map:  dict) -> bool:
    """
    Copies images into:
      data/yolo_dataset/train/<class_name>/image.jpg
      data/yolo_dataset/val/<class_name>/image.jpg

    FIX: validates each class has enough images before returning.
    """
    print("\n" + "=" * 60)
    print("STEP 5: Organising images into train/val folders")
    print("=" * 60)

    # ── Skip if already done ───────────────────────────────────────────────────
    existing_images = list(BASE_DIR.rglob("*.jpg")) + list(BASE_DIR.rglob("*.png"))
    if len(existing_images) > 200:
        print(f"⚡ Dataset already organised ({len(existing_images)} images found). Skipping.")
        return True

    # ── Group rows by class ────────────────────────────────────────────────────
    random.seed(RANDOM_SEED)
    class_files: dict[str, list] = {cls: [] for cls in CLASS_NAMES}

    not_found = 0
    for _, row in df.iterrows():
        img_name  = str(row[image_col])
        label_val = row[label_col]
        cls_name  = label_map.get(label_val)

        if cls_name is None:
            continue

        img_path = image_map.get(img_name) or image_map.get(img_name.lower())
        if img_path and img_path.exists():
            class_files[cls_name].append(img_path)
        else:
            not_found += 1

    if not_found > 0:
        print(f"⚠️  {not_found} filenames from CSV not found on disk (normal if dataset has a test set)")

    # ── Validate minimum images per class ─────────────────────────────────────
    # FIX BUG 3: don't silently proceed with empty classes
    print("\nImage counts per class:")
    abort = False
    for cls, files in class_files.items():
        status = "✅" if len(files) >= 10 else "❌"
        print(f"  {status} {cls:20s}: {len(files)} images")
        if len(files) < 10:
            abort = True

    if abort:
        print("\n❌ Some classes have < 10 images. Training will fail.")
        print("   Check that the CSV label mapping is correct (see Step 3 output).")
        return False

    # ── Copy to train / val ────────────────────────────────────────────────────
    for cls, files in class_files.items():
        random.shuffle(files)
        split_idx  = int(len(files) * (1 - VAL_SPLIT))
        train_imgs = files[:split_idx]
        val_imgs   = files[split_idx:]

        for split, imgs in [("train", train_imgs), ("val", val_imgs)]:
            dest_dir = BASE_DIR / split / cls
            dest_dir.mkdir(parents=True, exist_ok=True)
            for img in imgs:
                shutil.copy2(str(img), dest_dir / img.name)

        print(f"  📁 {cls:20s}: {len(train_imgs)} train  |  {len(val_imgs)} val")

    print("\n✅ Dataset organised successfully.")
    return True


# ── Step 6: Train YOLOv8 Classifier ───────────────────────────────────────────
def train(epochs: int = 30, img_size: int = 224, batch: int = 16):
    """
    FIX: epochs increased from 10 → 30
         Added patience=5 for early stopping
         Added augmentation flags
    """
    print("\n" + "=" * 60)
    print("STEP 6: Training YOLOv8 Classifier")
    print("=" * 60)

    from ultralytics import YOLO

    # yolov8n-cls = smallest/fastest.  Use yolov8s-cls for more accuracy.
    model = YOLO("yolov8n-cls.pt")
    print(f"Model     : YOLOv8n-cls")
    print(f"Epochs    : {epochs}  (early stop at patience=5)")
    print(f"Image size: {img_size}px")
    print(f"Classes   : {CLASS_NAMES}")
    print(f"Data dir  : {BASE_DIR}\n")

    results = model.train(
        data       = str(BASE_DIR),
        epochs     = epochs,
        imgsz      = img_size,
        batch      = batch,
        name       = "car_damage_v1",
        project    = "runs/classify",
        patience   = 5,          # early stop if val accuracy stops improving
        optimizer  = "AdamW",
        lr0        = 0.001,
        augment    = True,        # random flip, rotate, colour jitter
        verbose    = True,
    )

    # ── Copy best weights ──────────────────────────────────────────────────────
    best_src = Path("runs/classify/car_damage_v1/weights/best.pt")
    if best_src.exists():
        WEIGHTS_OUT.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(str(best_src), str(WEIGHTS_OUT))
        print(f"\n✅ Training complete!")
        print(f"   Best weights → {WEIGHTS_OUT}")
        print(f"\n   Now set USE_YOLO = True in damage_detector.py")
    else:
        print(f"\n⚠️  best.pt not found at {best_src}")
        print("   Look inside runs/classify/ and copy the best.pt manually to role2_cv/best.pt")

    return results


# ── Step 7: Evaluate model on validation set ───────────────────────────────────
def evaluate():
    print("\n" + "=" * 60)
    print("STEP 7: Evaluating model on validation set")
    print("=" * 60)

    if not WEIGHTS_OUT.exists():
        print(f"❌ No weights found at {WEIGHTS_OUT}. Run training first.")
        return

    from ultralytics import YOLO
    model   = YOLO(str(WEIGHTS_OUT))
    metrics = model.val(data=str(BASE_DIR), verbose=True)

    top1 = metrics.top1   # accuracy: % of images where correct class is #1
    top5 = metrics.top5   # accuracy: correct class in top 5 predictions

    print(f"\n── Validation Results ──")
    print(f"  Top-1 Accuracy : {top1 * 100:.2f}%")
    print(f"  Top-5 Accuracy : {top5 * 100:.2f}%")

    if top1 >= 0.80:
        print("  ✅ Model is production-ready (≥80% accuracy)")
    elif top1 >= 0.65:
        print("  ⚠️  Decent but train longer — try epochs=50")
    else:
        print("  ❌ Model needs improvement — check data quality or increase epochs")

    return metrics


# ── Step 8: Quick single-image test ────────────────────────────────────────────
def test_on_image(image_path: str):
    print("\n" + "=" * 60)
    print("STEP 8: Quick single-image prediction test")
    print("=" * 60)

    if not WEIGHTS_OUT.exists():
        print(f"❌ No weights at {WEIGHTS_OUT}. Train first.")
        return

    from ultralytics import YOLO
    model   = YOLO(str(WEIGHTS_OUT))
    results = model(image_path, verbose=False)[0]

    print(f"\nImage: {image_path}")
    print("\nTop-5 predictions:")
    top5_idx = results.probs.top5
    for rank, idx in enumerate(top5_idx, 1):
        cls_name = model.names[idx]
        conf     = float(results.probs.data[idx]) * 100
        print(f"  #{rank}  {cls_name:20s}  {conf:.1f}%")


# ─────────────────────────────────────────────────────────────────────────────
#  MAIN PIPELINE
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════╗
║  ROLE 2 — Model Training Pipeline       ║
╚══════════════════════════════════════════╝
    """)

    # 1. Download
    raw_path = download_dataset()

    # 2. Load CSV
    df, image_col, label_col = load_csv(raw_path)

    # 3. Build label map
    label_map = build_label_map(df, label_col)

    # 4. Scan images
    image_map = build_image_map(raw_path)

    # 5. Organise folders
    ok = organise_dataset(df, image_col, label_col, label_map, image_map)
    if not ok:
        print("\n❌ Dataset preparation failed. Fix errors above and retry.")
        exit(1)

    # 6. Train
    train(epochs=30, img_size=224, batch=16)

    # 7. Evaluate
    evaluate()

    print("\n🎉 All done! Your model is ready at role2_cv/best.pt")
    print("   Open damage_detector.py and set USE_YOLO = True")
