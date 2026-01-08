# 📦 Model File Upload Guide

Your trained ViT model files are too large for GitHub (309 MB). Here are **3 methods** to upload them:

---

## 🎯 Method 1: Git LFS (Recommended for GitHub)

Git Large File Storage handles large files efficiently.

### Setup Git LFS:

```bash
# Install Git LFS
# Windows: Download from https://git-lfs.github.com
# Mac: brew install git-lfs
# Linux: sudo apt-get install git-lfs

# Initialize Git LFS in your repo
cd cattle-disease-detection-pro
git lfs install

# Track .pth files
git lfs track "*.pth"
git lfs track "ml-server/models/*.pth"

# Add .gitattributes
git add .gitattributes

# Add your model file
git add ml-server/models/cattle_disease_vit_model.pth

# Commit and push
git commit -m "Add model file with Git LFS"
git push origin main
```

### Verify Upload:
```bash
git lfs ls-files
# Should show your .pth file
```

---

## 🚂 Method 2: Railway Volumes (Best for Production)

Upload directly to Railway's persistent storage.

### Step-by-Step:

1. **Install Railway CLI**:
   ```bash
   # Windows (PowerShell):
   iwr https://railway.app/install.ps1 | iex
   
   # Mac/Linux:
   curl -fsSL https://railway.app/install.sh | sh
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Link to your project**:
   ```bash
   cd cattle-disease-detection-pro/ml-server
   railway link
   # Select your ML server service
   ```

4. **Create Volume**:
   - Go to Railway Dashboard
   - Select ML Server service
   - **Variables** → **Volumes** → **New Volume**
   - **Mount Path**: `/app/models`
   - **Size**: 1GB

5. **Upload Model**:
   ```bash
   # Connect to Railway shell
   railway run bash
   
   # Inside container, create models directory
   mkdir -p /app/models
   cd /app/models
   
   # Exit and upload from local
   exit
   
   # Use railway CLI to copy file
   railway run --service ml-server cp /path/to/your/cattle_disease_vit_model.pth /app/models/
   ```

---

## ☁️ Method 3: Cloud Storage (Professional Solution)

Upload to cloud storage and download on startup.

### A. Using Google Drive (Free & Easy)

1. **Upload to Google Drive**:
   - Upload `cattle_disease_vit_model.pth` to Google Drive
   - Right-click → **Get link** → **Anyone with the link**
   - Copy the file ID from URL: `https://drive.google.com/file/d/FILE_ID/view`

2. **Update `ml-server/app.py`**:
   ```python
   import gdown
   import os
   
   def download_model():
       if not os.path.exists(MODEL_PATH):
           print("📥 Downloading model from Google Drive...")
           file_id = "YOUR_FILE_ID_HERE"
           url = f"https://drive.google.com/uc?id={file_id}"
           gdown.download(url, MODEL_PATH, quiet=False)
           print("✅ Model downloaded successfully")
   
   # Call before loading model
   download_model()
   load_model()
   ```

3. **Add to `requirements.txt`**:
   ```
   gdown==4.7.1
   ```

### B. Using AWS S3

1. **Upload to S3**:
   ```bash
   aws s3 cp cattle_disease_vit_model.pth s3://your-bucket/models/
   ```

2. **Update `ml-server/app.py`**:
   ```python
   import boto3
   
   def download_model():
       if not os.path.exists(MODEL_PATH):
           s3 = boto3.client('s3')
           s3.download_file(
               'your-bucket',
               'models/cattle_disease_vit_model.pth',
               MODEL_PATH
           )
   ```

### C. Using Hugging Face Hub (Best for ML Models)

1. **Upload to Hugging Face**:
   ```bash
   pip install huggingface_hub
   
   python
   >>> from huggingface_hub import HfApi
   >>> api = HfApi()
   >>> api.upload_file(
   ...     path_or_fileobj="cattle_disease_vit_model.pth",
   ...     path_in_repo="cattle_disease_vit_model.pth",
   ...     repo_id="your-username/cattle-disease-model",
   ...     repo_type="model",
   ... )
   ```

2. **Update `ml-server/app.py`**:
   ```python
   from huggingface_hub import hf_hub_download
   
   def download_model():
       if not os.path.exists(MODEL_PATH):
           hf_hub_download(
               repo_id="your-username/cattle-disease-model",
               filename="cattle_disease_vit_model.pth",
               local_dir="./models"
           )
   ```

---

## 📋 Your Current Model Files

Based on your project, you have:
- `cattle_disease_vit_model.pth` (309 MB)
- Possibly other files like:
  - `config.json`
  - `labels.txt`
  - `preprocessing_params.pkl`

### Upload All Files:

```bash
# If using Git LFS
git lfs track "ml-server/models/*"
git add ml-server/models/
git commit -m "Add all model files"
git push

# If using Railway Volume
railway run bash
cd /app/models
# Upload all files here

# If using Cloud Storage
# Upload entire models/ folder
```

---

## ✅ Verification

After uploading, verify the model loads:

1. **Check ML Server Logs**:
   ```bash
   railway logs --service ml-server
   ```
   Should see: `✅ Model loaded from ./models/cattle_disease_vit_model.pth`

2. **Test Health Endpoint**:
   ```bash
   curl https://your-ml-server.railway.app/health
   ```
   Should return: `{"model_loaded": true}`

3. **Test Prediction**:
   ```bash
   curl -X POST https://your-ml-server.railway.app/predict \
     -H "Content-Type: application/json" \
     -d '{"image": "base64_encoded_image_here"}'
   ```

---

## 🚨 Common Issues

### Issue: "Model file not found"
**Solution**: Check MODEL_PATH environment variable matches upload location

### Issue: "Out of memory"
**Solution**: Increase Railway service memory (Settings → Resources)

### Issue: "Git push fails with large file"
**Solution**: Use Git LFS or remove file from git:
```bash
git rm --cached ml-server/models/*.pth
git commit -m "Remove large files"
git push
```

---

## 💡 Recommended Approach

For your project, I recommend:

1. **Development**: Git LFS (easy to share with team)
2. **Production**: Hugging Face Hub or Google Drive (free, reliable)
3. **Enterprise**: AWS S3 or Azure Blob (scalable, secure)

---

## 📞 Need Help?

If you're stuck:
1. Share error logs
2. Confirm model file size: `ls -lh ml-server/models/`
3. Check Railway service logs
4. Contact: ayishadayisha8@gmail.com

---

**Choose the method that works best for you and let me know if you need help!** 🚀
