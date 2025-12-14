from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'priority', 'status', 'due_date', 'created_at']
    list_filter = ['priority', 'status', 'created_at']
    search_fields = ['title', 'description']
    list_editable = ['priority', 'status']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Task Information', {
            'fields': ('title', 'description')
        }),
        ('Task Settings', {
            'fields': ('priority', 'status', 'due_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')