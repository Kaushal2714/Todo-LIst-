# 🚀 Quick Deploy Reference

## Render Configuration Summary

### Database Settings:
- **Service**: PostgreSQL
- **Name**: taskflow-database
- **Plan**: Free

### Web Service Settings:
- **Runtime**: Python 3
- **Build Command**: `./build.sh`
- **Start Command**: `gunicorn task_manager.wsgi:application`

### Required Environment Variables:
```
DEBUG=False
SECRET_KEY=[generate-random-key]
ALLOWED_HOSTS=[your-render-url]
DATABASE_URL=[from-database-service]
```

### Repository:
`https://github.com/Kaushal2714/Todo-LIst-.git`

### Files Ready for Deployment:
- ✅ `build.sh` - Build script
- ✅ `requirements.txt` - Dependencies
- ✅ `Procfile` - Process configuration
- ✅ Production settings configured
- ✅ Static files handling
- ✅ Database configuration

**Estimated Deploy Time**: 5-10 minutes

**Your app will be live at**: `https://[your-app-name].onrender.com`