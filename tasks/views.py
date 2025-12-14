from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib import messages
from django.db.models import Q
from .models import Task
from .forms import TaskForm
import json


def task_board(request):
    """Main task board view"""
    # Get filter parameters
    priority_filter = request.GET.get('priority', '')
    status_filter = request.GET.get('status', '')
    sort_by = request.GET.get('sort', 'newest')
    
    # Base queryset
    tasks = Task.objects.all()
    
    # Apply filters
    if priority_filter:
        tasks = tasks.filter(priority=priority_filter)
    if status_filter:
        tasks = tasks.filter(status=status_filter)
    
    # Apply sorting
    if sort_by == 'oldest':
        tasks = tasks.order_by('created_at')
    elif sort_by == 'due_date':
        tasks = tasks.order_by('due_date')
    else:  # newest (default)
        tasks = tasks.order_by('-created_at')
    
    # Organize tasks by status
    todo_tasks = tasks.filter(status='To-Do')
    inprogress_tasks = tasks.filter(status='In-Progress')
    completed_tasks = tasks.filter(status='Completed')
    
    context = {
        'todo_tasks': todo_tasks,
        'inprogress_tasks': inprogress_tasks,
        'completed_tasks': completed_tasks,
        'priority_filter': priority_filter,
        'status_filter': status_filter,
        'sort_by': sort_by,
    }
    
    return render(request, 'tasks/board.html', context)

def create_task(request):
    """Create a new task"""
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save()
            messages.success(request, 'Task created successfully!')
            return redirect('task_board')
    else:
        form = TaskForm()
    
    return render(request, 'tasks/create_task.html', {'form': form})

def edit_task(request, task_id):
    """Edit an existing task"""
    task = get_object_or_404(Task, id=task_id)
    
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            messages.success(request, 'Task updated successfully!')
            return redirect('task_board')
    else:
        form = TaskForm(instance=task)
    
    return render(request, 'tasks/edit_task.html', {'form': form, 'task': task})

def delete_task(request, task_id):
    """Delete a task"""
    task = get_object_or_404(Task, id=task_id)
    
    if request.method == 'POST':
        task.delete()
        messages.success(request, 'Task deleted successfully!')
        return redirect('task_board')
    
    return render(request, 'tasks/delete_task.html', {'task': task})

@csrf_exempt
@require_http_methods(["POST"])
def update_task_status(request):
    """Update task status via AJAX for drag and drop"""
    try:
        data = json.loads(request.body)
        task_id = data.get('task_id')
        new_status = data.get('status')
        
        task = get_object_or_404(Task, id=task_id)
        task.status = new_status
        task.save()
        
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

