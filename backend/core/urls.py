"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from accounts.views import UserList, CurrentUserView

from projects.views import ProjectList, ProjectCreate, ProjectRetriveUpdateDestroy, ProjectStatusChoicesView, TaskList, TaskCreate, TaskRetriveUpdateDestroy, TaskChoicesView, ProjectWithTaskList, AddProjectMemberRetriveUpdateDestroy, TaskBulkDelete


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/current-user/', CurrentUserView.as_view()),

    path('api/user-list/', UserList.as_view(), name='user-list'),

    path('api/project-list/', ProjectList.as_view(), name='project-list'),
    path('api/project-create/', ProjectCreate.as_view(), name='project-create'),
    path('api/project-edit/<int:pk>/', ProjectRetriveUpdateDestroy.as_view(), name='project-update'),
    path('api/add-project-member/<int:pk>/', AddProjectMemberRetriveUpdateDestroy.as_view(), name='project-update'),
    path('api/project-status/', ProjectStatusChoicesView.as_view(), name='project-status'),

    path("api/project-detail/<int:pk>/", ProjectWithTaskList.as_view()),

    path('api/task-list/', TaskList.as_view(), name='task-list'),
    path('api/task-create/', TaskCreate.as_view(), name='task-create'),
    path('api/task-edit/<int:pk>/', TaskRetriveUpdateDestroy.as_view(), name='task-update'),
    path('api/task-status-priority/', TaskChoicesView.as_view(), name='task-status-priority'),

    path('api/task-bulk-delete/', TaskBulkDelete.as_view(), name='task-bulk-delete'),

]
