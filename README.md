# 📌 Project Management

A full-stack web-based Project Management System built with Django, Django REST Framework, Django Channels, React, and PostgreSQL.

This application allows teams to manage projects, assign tasks, monitor progress, invite members, and receive real-time notifications.

---

## 🚀 Overview

Project Management is designed to help teams collaborate efficiently by providing:

* Role-based project access
* Task assignment and tracking
* Email-based user invitation system
* Profile and password management
* Dashboard insights (completion & overdue tasks)
* Real-time notifications using WebSockets
* Fully responsive interface for better usability across devices

The system is built with a production-ready architecture using ASGI and PostgreSQL.

---

## 🎯 Core Features

### 🔐 Authentication & Security
* JWT Authentication (Login & Registration)
* Protected API Endpoints (Django REST Framework)
* WebSocket Authentication
* Secure Password Update Functionality

### 👥 User & Role Management
* Role-Based Permissions (Admin / Leader / Member)
* Email-Based User Invitation System (Admin invites users via email)
* Invitation Acceptance / Account credentials sent via email
* Update Personal Profile Details
* Change Password Feature

### 📁 Project & Task Management
* Project Creation & Team Management
* Task Assignment & Status Updates
* Task Tracking & Progress Monitoring

### 📊 Dashboard & Insights
* Task Completion Rate
* Overdue Tasks
* Assigned Task List Overview

### 🔔 Real-Time Features
* Real-Time Notifications (WebSocket via Django Channels)

### 📱 UI/UX Improvements
* Improved Responsive Layout
* Better screen adaptability across devices

---

## 🛠️ Tech Stack

### Backend
* Python
* Django
* Django REST Framework
* Django Channels (WebSocket)
* Daphne (ASGI Server)
* PostgreSQL

### Frontend
* React
* TanStack Query (React Query)
* Tailwind CSS

---

## ⚙️ Database Configuration

The project uses environment-based database configuration.

```python
DEV_MODE = False

if DEV_MODE:
    # Development
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    # Production
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv("DB_NAME"),
            'USER': os.getenv("DB_USER"),
            'PASSWORD': os.getenv("DB_PASSWORD"),
            'HOST': os.getenv("DB_HOST"),
            'PORT': os.getenv("DB_PORT"),
        }
    }
```

* SQLite for development
* PostgreSQL for production

---

## 📧 Email Invitation Configuration

The email invitation feature requires proper backend URL configuration.

The invitation links (Accept / Decline) are generated inside:

```
accounts/serializers.py
```

The system uses an environment variable for the backend base URL:

```python
base_url = os.getenv("BACKEND_BASE_URL")
```

---

### 🔧 Required Environment Variable

Add the following variable to your `.env` file:

```
BACKEND_BASE_URL=http://127.0.0.1:8000
```

### ✅ Example (Local Development)

```
BACKEND_BASE_URL=http://127.0.0.1:8000
```

### ✅ Example (Production)

```
BACKEND_BASE_URL=https://yourdomain.com
```

---

### ⚠️ Important

If `BACKEND_BASE_URL` is not configured correctly:

* The Accept and Decline buttons in the invitation email will not work.
* The generated invitation links will point to the wrong server.

---

## 🔄 Real-Time Architecture

The application uses Django Channels with ASGI.

Server is run using:

```bash
daphne core.asgi:application
```

or

```bash
daphne -b 0.0.0.0 -p 8000 core.asgi:application
```

WebSocket is used for:

* Real-time notifications

Architecture Flow:

React (Frontend)  
↓  
Django REST API + WebSocket (ASGI)  
↓  
PostgreSQL Database  

---

## ✉️ User Invitation Flow

1. Admin enters user email.
2. System sends invitation.
3. Invited user accepts invitation.
4. User account credentials sent via email.
5. Account is activated and ready for login.

This ensures controlled and secure onboarding of team members.

---

## 📊 Dashboard Metrics

The dashboard displays:

* Task completion rate
* Overdue tasks
* Assigned task list

(Future improvement: integrate chart visualization using Recharts)

---

## 📦 Installation Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/NielGenil/project-management.git
cd project-management
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
daphne -b 0.0.0.0 -p 8000 core.asgi:application
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Authentication Flow

* User logs in
* JWT token is issued
* Token is stored on frontend (cookies)
* Protected endpoints require Authorization header
* WebSocket connections are authenticated

---

## 🧠 What I Learned

* Implementing WebSocket communication using Django Channels
* Running Django in ASGI mode using Daphne
* Managing real-time notifications
* Structuring role-based permission systems
* Implementing secure email-based invitation systems
* Building profile & password management functionality
* Optimizing API calls using TanStack Query
* Configuring PostgreSQL for production
* Improving responsive UI using Tailwind CSS

---

## 📈 Future Improvements

* Add chart visualizations using Recharts
* Implement an activity log system
* Add file attachments to tasks
* Add Docker support
* Customize email notification templates
* Add a calendar feature
* Implement project and task comment sections


---

## 👨‍💻 Author

John Nathaniel Genil  
GitHub: https://github.com/NielGenil
