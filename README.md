# 📌 Project Management

A full-stack web-based Project Management System built with Django, Django REST Framework, Django Channels, React, and PostgreSQL.

This application allows teams to manage projects, assign tasks, monitor progress, and receive real-time notifications.

---

## 🚀 Overview

Project Management is designed to help teams collaborate efficiently by providing:

* Role-based project access
* Task assignment and tracking
* Dashboard insights (completion & overdue tasks)
* Real-time notifications using WebSockets

The system is built with a production-ready architecture using ASGI and PostgreSQL.

---

## 🎯 Core Features

* 🔐 JWT Authentication (Login & Registration)
* 👥 Role-Based Permissions (Admin / Leader / Member)
* 📁 Project Creation & Team Management
* ✅ Task Assignment & Status Updates
* 📊 Dashboard (Completion Rate, Overdue Tasks, Task List)
* 🔔 Real-Time Notifications (WebSocket via Django Channels)
* 🔄 Protected API Endpoints (Django REST Framework)

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
    # Dev (if no other database)
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

## 🔄 Real-Time Architecture

The application uses Django Channels with ASGI.

Server is run using:

```bash
daphne core.asgi:application
```

WebSocket is used for:

* Real-time notifications
* Instant task updates

Architecture:

React (Frontend)
→
Django REST API + WebSocket (ASGI)
→
PostgreSQL Database

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
daphne core.asgi:application
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
* Token is stored on frontend
* Protected endpoints require Authorization header
* WebSocket connections are authenticated

---

## 🧠 What I Learned

* Implementing WebSocket communication using Django Channels
* Running Django in ASGI mode using Daphne
* Managing real-time notifications
* Structuring role-based permission systems
* Optimizing API calls using TanStack Query
* Configuring PostgreSQL for production

---

## 📈 Future Improvements

* Add chart visualization (Recharts)
* Add activity log system
* Add file attachments to tasks
* Add Docker support

---

## 👨‍💻 Author

John Nathaniel Genil
GitHub: [https://github.com/NielGenil](https://github.com/NielGenil)

