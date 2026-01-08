# 🚀 Deployment Guide - Railway

This guide will help you deploy the Cattle Disease Detection System to Railway.

## 📋 Prerequisites

1. **Railway Account** - Sign up at [railway.app](https://railway.app)
2. **GitHub Account** - Connected to Railway
3. **MongoDB Atlas** - Free tier at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
4. **Google OAuth Credentials** - From [console.cloud.google.com](https://console.cloud.google.com)
5. **Twilio Account** (Optional) - For OTP at [twilio.com](https://www.twilio.com)

---

## 🗄️ Step 1: Setup MongoDB Atlas

1. Create a free cluster at MongoDB Atlas
2. Create a database user with password
3. Whitelist all IPs (0.0.0.0/0) for Railway access
4. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/cattle-disease
   ```

---

## 🔐 Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://your-backend-url.railway.app/api/auth/google/callback` (production)
7. Save **Client ID** and **Client Secret**

---

## 📱 Step 3: Setup Twilio (Optional for OTP)

1. Sign up at [Twilio](https://www.twilio.com)
2. Get a phone number
3. Note down:
   - Account SID
   - Auth Token
   - Phone Number

---

## 🚂 Step 4: Deploy to Railway

### A. Deploy Backend

1. **Create New Project** in Railway
2. **New Service** → **GitHub Repo** → Select `cattle-disease-detection-pro`
3. **Root Directory**: `/backend`
4. **Add Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cattle-disease
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   TWILIO_ACCOUNT_SID=your-twilio-sid
   TWILIO_AUTH_TOKEN=your-twilio-token
   TWILIO_PHONE_NUMBER=+1234567890
   ML_API_URL=https://your-ml-server-url.railway.app
   PORT=3000
   NODE_ENV=production
   ```
5. **Deploy** - Railway will auto-deploy
6. **Note the URL**: `https://your-backend.railway.app`

### B. Deploy ML Server

1. **New Service** in same project
2. **GitHub Repo** → Select `cattle-disease-detection-pro`
3. **Root Directory**: `/ml-server`
4. **Add Environment Variables**:
   ```
   MODEL_PATH=./models/cattle_disease_vit_model.pth
   PORT=5000
   FLASK_ENV=production
   ```
5. **Deploy**
6. **Note the URL**: `https://your-ml-server.railway.app`
7. **Update Backend** `ML_API_URL` with this URL

### C. Deploy Frontend

1. **New Service** in same project
2. **GitHub Repo** → Select `cattle-disease-detection-pro`
3. **Root Directory**: `/frontend`
4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.railway.app
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```
5. **Deploy**
6. **Note the URL**: `https://your-frontend.railway.app`

---

## 📦 Step 5: Upload Model Files

Since your `.pth` model file is too large for GitHub, use **Railway Volumes**:

### Option 1: Railway Volume (Recommended)

1. Go to ML Server service in Railway
2. **Variables** → **Volumes** → **New Volume**
3. **Mount Path**: `/app/models`
4. Upload your model files via Railway CLI:
   ```bash
   railway login
   railway link
   railway volume add
   railway run bash
   # Inside container:
   cd /app/models
   # Upload your .pth file here
   ```

### Option 2: Git LFS (Alternative)

```bash
# In your local ml-server folder
git lfs install
git lfs track "*.pth"
git add .gitattributes
git add models/cattle_disease_vit_model.pth
git commit -m "Add model file with Git LFS"
git push
```

### Option 3: External Storage (Best for Production)

Upload model to:
- **AWS S3**
- **Google Cloud Storage**
- **Azure Blob Storage**

Then download in `app.py`:
```python
import requests

def download_model():
    url = "https://your-storage-url/model.pth"
    response = requests.get(url)
    with open(MODEL_PATH, 'wb') as f:
        f.write(response.content)
```

---

## ✅ Step 6: Verify Deployment

1. **Backend Health Check**:
   ```
   https://your-backend.railway.app/health
   ```
   Should return: `{"status": "OK"}`

2. **ML Server Health Check**:
   ```
   https://your-ml-server.railway.app/health
   ```
   Should return model status

3. **Frontend**:
   ```
   https://your-frontend.railway.app
   ```
   Should show login page

---

## 🔧 Step 7: Create Admin User

After deployment, create an admin user manually in MongoDB:

1. Go to MongoDB Atlas → **Collections**
2. Find `users` collection
3. **Insert Document**:
   ```json
   {
     "user_id": "ADMIN001",
     "name": "Admin User",
     "email": "admin@example.com",
     "role": "admin",
     "isVerified": true,
     "created_at": "2024-01-08T00:00:00.000Z"
   }
   ```
4. Login with this email via Google OAuth

---

## 🐛 Troubleshooting

### Backend Issues
- Check Railway logs: `railway logs`
- Verify MongoDB connection string
- Ensure all environment variables are set

### ML Server Issues
- Check if model file exists
- Verify Python dependencies installed
- Check memory limits (increase if needed)

### Frontend Issues
- Verify API URL is correct
- Check CORS settings in backend
- Clear browser cache

### CORS Errors
Add to backend `server.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend.railway.app'],
  credentials: true
}));
```

---

## 📊 Monitoring

Railway provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: History and rollback

---

## 💰 Cost Estimation

Railway Free Tier:
- $5 free credit/month
- Enough for development/testing

For production:
- Backend: ~$5-10/month
- ML Server: ~$10-20/month (depends on usage)
- Frontend: ~$5/month
- **Total**: ~$20-35/month

---

## 🔒 Security Checklist

- ✅ Use strong JWT_SECRET (min 32 characters)
- ✅ Enable MongoDB authentication
- ✅ Whitelist only necessary IPs
- ✅ Use HTTPS only (Railway provides free SSL)
- ✅ Rotate API keys regularly
- ✅ Enable rate limiting
- ✅ Validate all inputs

---

## 📞 Support

For issues:
1. Check Railway logs
2. Review MongoDB Atlas logs
3. Open GitHub issue
4. Contact: ayishadayisha8@gmail.com

---

**🎉 Congratulations! Your Cattle Disease Detection System is now live!**

Access your app at: `https://your-frontend.railway.app`
