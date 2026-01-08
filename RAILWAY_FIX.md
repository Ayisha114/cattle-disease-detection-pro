# Railway Deployment - Quick Start

## ⚠️ IMPORTANT: Deploy 3 Separate Services

Railway tried to deploy everything as one service and failed. You need to create **3 separate services**.

---

## 🚀 Correct Deployment Steps:

### Step 1: Create Backend Service

1. In Railway Dashboard → **New Service**
2. **GitHub Repo** → Select `cattle-disease-detection-pro`
3. **Settings** → **Root Directory** → Set to: `backend`
4. **Settings** → **Start Command** → Set to: `node server.js`
5. **Variables** → Add:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   PORT=3000
   NODE_ENV=production
   ```
6. **Deploy**

---

### Step 2: Create Frontend Service

1. **New Service** (in same project)
2. **GitHub Repo** → Select `cattle-disease-detection-pro`
3. **Settings** → **Root Directory** → Set to: `frontend`
4. **Settings** → **Build Command** → Set to: `npm install && npm run build`
5. **Settings** → **Start Command** → Set to: `npm run preview`
6. **Variables** → Add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
7. **Deploy**

---

### Step 3: Create ML Server Service

1. **New Service** (in same project)
2. **GitHub Repo** → Select `cattle-disease-detection-pro`
3. **Settings** → **Root Directory** → Set to: `ml-server`
4. **Settings** → **Start Command** → Set to: `python app.py`
5. **Variables** → Add:
   ```
   PORT=5000
   MODEL_PATH=./models/cattle_disease_vit_model.pth
   ```
6. **Deploy**

---

## 🎯 What Went Wrong?

Railway tried to build the entire repo as one service. It found multiple `package.json` files and got confused.

**Solution**: Deploy each folder (backend, frontend, ml-server) as a separate service with its own root directory.

---

## 📹 Visual Guide:

1. Click **"+ New"** → **"Empty Service"**
2. Click **"GitHub Repo"**
3. Select your repo
4. **IMPORTANT**: Go to **Settings** → Set **Root Directory**
5. Add environment variables
6. Deploy

Repeat 3 times for backend, frontend, and ml-server.

---

## ✅ After Deployment:

You'll have 3 services running:
- `backend-service` → https://backend-xxx.railway.app
- `frontend-service` → https://frontend-xxx.railway.app  
- `ml-server-service` → https://ml-server-xxx.railway.app

Update the frontend's `VITE_API_URL` to point to your backend URL.

---

## 🆘 Still Having Issues?

Share the error logs from Railway and I'll help you fix it!
