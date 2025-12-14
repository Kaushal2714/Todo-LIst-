from django.urls import path
from . import views

urlpatterns = [
    path('', views.task_board, name='task_board'),
    path('create/', views.create_task, name='create_task'),
    path('edit/<int:task_id>/', views.edit_task, name='edit_task'),
    path('delete/<int:task_id>/', views.delete_task, name='delete_task'),
    path('update-status/', views.update_task_status, name='update_task_status'),

]