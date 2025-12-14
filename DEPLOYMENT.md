# 🚀 TaskFlow Deployment Guide

## Quick Deploy on Railway (Recommended - 5 minutes)

### Step 1: Prepare Your Code
```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
```bash
git remote add origin https://github.com/yourusername/taskflow.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your TaskFlow repository
5. Railway will automatically:
   - Detect it's a Django app
   - Install dependencies
   - Set up PostgreSQL database
   - Deploy your app

### Step 4: Configure Environment Variables
In Railway dashboard, go to Variables tab and add:
```
DEBUG=False
SECRET_KEY=your-super-secret-key-here
ALLOWED_HOSTS=*.railway.app
```

### Step 5: Access Your App
- Railway will provide a URL like: `https://taskflow-production-xxxx.up.railway.app`
- Your app is now live! 🎉

---

## Alternative: Deploy on Render

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command**: `python manage.py migrate && gunicorn task_manager.wsgi`

### Step 3: Add Database
1. Create a new PostgreSQL database on Render
2. Copy the database URL
3. Add environment variables:
```
DATABASE_URL=your-postgres-url
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=*.onrender.com
```

---

## Alternative: Deploy on Heroku

### Step 1: Install Heroku CLI
Download from [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)

### Step 2: Deploy
```bash
heroku login
heroku create your-taskflow-app
heroku addons:create heroku-postgresql:mini
git push heroku main
heroku run python manage.py migrate
heroku open
```

### Step 3: Configure
```bash
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key
```

---

## 🔧 Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `DEBUG` | Enable/disable debug mode | `False` |
| `SECRET_KEY` | Django secret key | `your-super-secret-key` |
| `ALLOWED_HOSTS` | Allowed hostnames | `*.railway.app,yourdomain.com` |
| `DATABASE_URL` | Database connection string | Auto-set by platforms |

---

## 🎯 Platform Comparison

| Platform | Ease | Cost | Database | Custom Domain |
|----------|------|------|----------|---------------|
| **Railway** | ⭐⭐⭐⭐⭐ | Free tier | ✅ PostgreSQL | ✅ |
| **Render** | ⭐⭐⭐⭐ | Free tier | ✅ PostgreSQL | ✅ |
| **Heroku** | ⭐⭐⭐ | $5/month | ✅ PostgreSQL | ✅ |

---

## 🐛 Troubleshooting

### Common Issues:

1. **Static files not loading**:
   - Ensure `STATIC_ROOT` is set correctly
   - Run `python manage.py collectstatic`

2. **Database connection error**:
   - Check `DATABASE_URL` environment variable
   - Ensure migrations are run: `python manage.py migrate`

3. **Secret key error**:
   - Set `SECRET_KEY` environment variable
   - Generate new key: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`

### Getting Help:
- Check platform documentation
- Review deployment logs
- Ensure all environment variables are set

---

## 🎉 Success!

Your TaskFlow app should now be live and accessible worldwide! 

**Next Steps:**
- Share your live URL
- Add custom domain (optional)
- Set up monitoring
- Configure backups

**Live URL Format:**
- Railway: `https://taskflow-production-xxxx.up.railway.app`
- Render: `https://taskflow-xxxx.onrender.com`
- Heroku: `https://your-app-name.herokuapp.com`