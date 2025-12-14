# Deployment Guide for TaskFlow

## 🚀 Quick Deployment Options

### 1. Railway (Recommended)
Railway provides easy Django deployment with automatic database setup.

1. **Fork/Clone the repository**
2. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub account
   - Select this repository
3. **Deploy**:
   - Railway will automatically detect Django
   - Add environment variables if needed
   - Deploy with one click

### 2. Render
1. **Create account** at [render.com](https://render.com)
2. **Connect repository**
3. **Configure**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn task_manager.wsgi:application`
4. **Deploy**

### 3. Heroku
1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create app**: `heroku create your-app-name`
4. **Deploy**:
   ```bash
   git push heroku main
   heroku run python manage.py migrate
   ```

### 4. Vercel (with Database)
1. **Install Vercel CLI**: `npm i -g vercel`
2. **Deploy**: `vercel --prod`
3. **Add database** (PostgreSQL recommended)

## 🔧 Environment Variables

For production deployment, set these environment variables:

```
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=your-database-url (if using external DB)
```

## 📊 Database Options

### SQLite (Default - Good for testing)
- No additional setup required
- Included in the repository

### PostgreSQL (Recommended for production)
- Update `settings.py` database configuration
- Add `psycopg2-binary` to requirements.txt (already included)

### MySQL
- Update `settings.py` database configuration  
- Add `mysqlclient` to requirements.txt

## 🛠️ Local Development

1. **Clone repository**:
   ```bash
   git clone https://github.com/Kaushal2714/Todo-LIst-.git
   cd Todo-LIst-
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Start development server**:
   ```bash
   python manage.py runserver
   ```

## 🔒 Security Checklist

- [ ] Set `DEBUG = False` in production
- [ ] Use environment variables for sensitive data
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Use HTTPS in production
- [ ] Set up proper database backups
- [ ] Configure static file serving

## 📱 Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Drag & drop task management
- ✅ Priority levels and filtering
- ✅ Due date tracking
- ✅ Modern UI with animations
- ✅ Real-time status updates
- ✅ Task duplicate detection

## 🎯 Live Demo

Once deployed, your TaskFlow application will be available at your chosen domain with all features working seamlessly.

## 📞 Support

If you encounter any deployment issues:
1. Check the deployment platform's logs
2. Verify environment variables are set correctly
3. Ensure database migrations have run
4. Check static file configuration

---

**Happy Deploying! 🚀**