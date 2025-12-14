# Task Manager - Django Web Application

A responsive Task Management Web Application built with Django, Python, and MySQL. This Trello-style application allows users to manage tasks across different boards (To-Do, In-Progress, Completed) with drag-and-drop functionality.

## 🚀 Features

- **3-Column Board Layout**: To-Do, In-Progress, and Completed columns
- **Drag & Drop**: Move tasks between columns with instant status updates
- **Task Management**: Create, edit, and delete tasks with confirmation
- **Task Properties**:
  - Title and Description
  - Priority levels (Low, Medium, High)
  - Due dates with datetime picker
  - Creation and update timestamps
- **Filtering & Sorting**:
  - Filter by priority and status
  - Sort by newest, oldest, or due date
- **Duplicate Detection**: Identifies tasks with same title in same status
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Clean UI**: Modern interface with Tailwind CSS

## 🛠️ Technology Stack

- **Backend**: Django 4.2.7
- **Database**: MySQL
- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Drag & Drop**: SortableJS
- **Icons**: Font Awesome
- **Python**: 3.8+

## 📋 Prerequisites

Before running this application, make sure you have:

- Python 3.8 or higher
- MySQL Server
- pip (Python package manager)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd task-manager
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Database Setup

1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE task_manager_db;
   ```

2. **Update Database Configuration** (if needed):
   Edit `task_manager/settings.py`:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'task_manager_db',
           'USER': 'your_mysql_username',
           'PASSWORD': 'your_mysql_password',
           'HOST': 'localhost',
           'PORT': '3306',
       }
   }
   ```

### 5. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 7. Load Sample Data (Optional)

Visit `/load-sample-data/` after starting the server to load sample tasks.

## 🚀 Running the Application

### Development Server

```bash
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000/`

### Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use environment variables for sensitive settings
2. **Static Files**: Configure static file serving
3. **Database**: Use production-grade database settings
4. **Security**: Update `ALLOWED_HOSTS`, `SECRET_KEY`, and set `DEBUG = False`

## 📁 Project Structure

```
task-manager/
├── task_manager/           # Django project settings
│   ├── __init__.py
│   ├── settings.py        # Main settings file
│   ├── urls.py           # Main URL configuration
│   └── wsgi.py           # WSGI configuration
├── tasks/                 # Main application
│   ├── migrations/       # Database migrations
│   ├── templates/tasks/  # HTML templates
│   │   ├── base.html     # Base template
│   │   ├── board.html    # Main task board
│   │   ├── create_task.html
│   │   ├── edit_task.html
│   │   ├── delete_task.html
│   │   └── task_card.html
│   ├── __init__.py
│   ├── admin.py          # Admin configuration
│   ├── apps.py           # App configuration
│   ├── forms.py          # Django forms
│   ├── models.py         # Database models
│   ├── urls.py           # App URL patterns
│   └── views.py          # View functions
├── static/               # Static files
│   └── css/
│       └── custom.css    # Custom styles
├── tasks.json            # Sample data file
├── requirements.txt      # Python dependencies
├── manage.py            # Django management script
└── README.md            # This file
```

## 🎯 Usage Guide

### Creating Tasks

1. Click "Add Task" button in the navigation
2. Fill in task details:
   - Title (required)
   - Description (optional)
   - Priority (Low/Medium/High)
   - Status (To-Do/In-Progress/Completed)
   - Due Date (optional)
3. Click "Create Task"

### Managing Tasks

- **Edit**: Click "Edit" on any task card
- **Delete**: Click "Delete" with confirmation dialog
- **Move**: Drag and drop tasks between columns
- **Filter**: Use filter controls above the board
- **Sort**: Choose sorting option (newest, oldest, due date)

### Drag & Drop

- Tasks can be dragged between any columns
- Status updates automatically when dropped
- Visual feedback during drag operation
- Instant database updates via AJAX

## 🔍 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Main task board |
| GET | `/create/` | Create task form |
| POST | `/create/` | Submit new task |
| GET | `/edit/<id>/` | Edit task form |
| POST | `/edit/<id>/` | Update task |
| GET | `/delete/<id>/` | Delete confirmation |
| POST | `/delete/<id>/` | Delete task |
| POST | `/update-status/` | AJAX status update |
| GET | `/load-sample-data/` | Load sample tasks |

## 🎨 Customization

### Styling

- Modify `static/css/custom.css` for custom styles
- Tailwind CSS classes can be updated in templates
- Color schemes defined in template files

### Adding Features

1. **New Task Fields**: Update `models.py` and `forms.py`
2. **Additional Filters**: Modify `views.py` and templates
3. **New Status Columns**: Update model choices and templates

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check MySQL server is running
   - Verify database credentials in settings.py
   - Ensure database exists

2. **Migration Issues**:
   ```bash
   python manage.py makemigrations tasks
   python manage.py migrate
   ```

3. **Static Files Not Loading**:
   ```bash
   python manage.py collectstatic
   ```

4. **Drag & Drop Not Working**:
   - Check browser console for JavaScript errors
   - Ensure SortableJS is loaded
   - Verify CSRF token configuration

## 🚀 Deployment

This project is ready for deployment on multiple platforms. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Deploy (Recommended):
1. **Railway** - Easiest, 5 minutes setup
2. **Render** - Simple, reliable
3. **Heroku** - Popular, well-documented

The project includes all necessary configuration files for seamless deployment.

## 📝 Sample Data

The application includes sample tasks that can be loaded via the "Load Sample Data" button or by visiting `/load-sample-data/`. Sample data includes:

- Design Homepage UI (High Priority, To-Do)
- Setup Database Schema (High Priority, In-Progress)
- Implement User Authentication (Medium Priority, To-Do)
- Write API Documentation (Low Priority, To-Do)
- Initial Project Setup (High Priority, Completed)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For support or questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review Django documentation for framework-specific issues

---

**Built with ❤️ using Django and Python**