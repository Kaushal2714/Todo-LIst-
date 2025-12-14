// TaskFlow - LocalStorage Task Manager

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.nextId = this.getNextId();
    }

    loadTasks() {
        const stored = localStorage.getItem('taskflow_tasks');
        return stored ? JSON.parse(stored) : [];
    }

    saveTasks() {
        localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
    }

    getNextId() {
        const maxId = this.tasks.reduce((max, task) => Math.max(max, task.id || 0), 0);
        return maxId + 1;
    }

    addTask(taskData) {
        const task = {
            id: this.nextId++,
            title: taskData.title,
            description: taskData.description || '',
            priority: taskData.priority || 'Medium',
            status: taskData.status || 'To-Do',
            due_date: taskData.due_date || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    updateTask(id, updates) {
        const taskIndex = this.tasks.findIndex(task => task.id === parseInt(id));
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                ...updates,
                updated_at: new Date().toISOString()
            };
            this.saveTasks();
            return this.tasks[taskIndex];
        }
        return null;
    }

    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(task => task.id === parseInt(id));
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            return true;
        }
        return false;
    }

    getTask(id) {
        return this.tasks.find(task => task.id === parseInt(id));
    }

    getTasks(filters = {}) {
        let filtered = [...this.tasks];
        
        if (filters.priority) {
            filtered = filtered.filter(task => task.priority === filters.priority);
        }
        if (filters.status) {
            filtered = filtered.filter(task => task.status === filters.status);
        }
        
        // Sort tasks
        if (filters.sort === 'oldest') {
            filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else if (filters.sort === 'due_date') {
            filtered.sort((a, b) => {
                if (!a.due_date) return 1;
                if (!b.due_date) return -1;
                return new Date(a.due_date) - new Date(b.due_date);
            });
        } else {
            filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        
        return filtered;
    }

    isDuplicate(title, status, excludeId = null) {
        return this.tasks.some(task => 
            task.title === title && 
            task.status === status && 
            task.id !== excludeId
        );
    }

    loadSampleData() {
        if (this.tasks.length === 0) {
            const sampleTasks = [
                {
                    title: "Design Homepage UI",
                    description: "Create wireframes and layout structure for the main page",
                    priority: "High",
                    status: "To-Do",
                    due_date: "2025-02-12T09:00:00"
                },
                {
                    title: "Setup Project Structure",
                    description: "Configure project files, folders, and development environment",
                    priority: "High",
                    status: "In-Progress",
                    due_date: "2025-01-30T15:00:00"
                },
                {
                    title: "Write Documentation",
                    description: "Create comprehensive user manual and setup guide",
                    priority: "Medium",
                    status: "To-Do",
                    due_date: "2025-02-15T12:00:00"
                },
                {
                    title: "Initial Planning",
                    description: "Complete project planning and requirements gathering phase",
                    priority: "High",
                    status: "Completed",
                    due_date: "2025-01-25T10:00:00"
                }
            ];
            
            sampleTasks.forEach(taskData => this.addTask(taskData));
        }
    }
}

// Initialize task manager
const taskManager = new TaskManager();

// Utility functions
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showMessage(message, type = 'success') {
    const container = document.getElementById('messages-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `glass-effect text-${type === 'success' ? 'green' : 'red'}-800 px-6 py-4 rounded-2xl mb-4 border border-${type === 'success' ? 'green' : 'red'}-200`;
    messageDiv.innerHTML = `
        <div class="flex items-center">
            <span class="text-2xl mr-3">${type === 'success' ? '✅' : '❌'}</span>
            <span class="font-medium">${message}</span>
        </div>
    `;
    container.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Board functionality
function renderTasks() {
    const filters = {
        priority: document.getElementById('priority-filter').value,
        status: document.getElementById('status-filter').value,
        sort: document.getElementById('sort-filter').value
    };
    
    const tasks = taskManager.getTasks(filters);
    
    // Clear all columns
    ['todo', 'inprogress', 'completed'].forEach(status => {
        const column = document.getElementById(`${status}-column`);
        const emptyState = document.getElementById(`${status}-empty`);
        
        // Remove all task cards
        const taskCards = column.querySelectorAll('.task-card');
        taskCards.forEach(card => card.remove());
        
        // Show/hide empty state
        const statusTasks = tasks.filter(task => {
            if (status === 'todo') return task.status === 'To-Do';
            if (status === 'inprogress') return task.status === 'In-Progress';
            if (status === 'completed') return task.status === 'Completed';
        });
        
        if (statusTasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            statusTasks.forEach(task => {
                const taskCard = createTaskCard(task);
                column.insertBefore(taskCard, emptyState);
            });
        }
    });
    
    updateTaskCounts();
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card bg-white rounded-2xl p-5 cursor-move card-hover shadow-lg border-l-4 ${getPriorityBorderClass(task.priority)}`;
    card.dataset.taskId = task.id;
    
    const isDuplicate = taskManager.isDuplicate(task.title, task.status, task.id);
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <div class="flex items-center space-x-2">
                ${getPriorityIcon(task.priority)}
                <span class="${getPriorityClass(task.priority)} px-3 py-1 rounded-full text-xs font-semibold">
                    ${task.priority.toUpperCase()}
                </span>
            </div>
            ${isDuplicate ? '<span class="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg text-xs font-medium">🔄 Duplicate</span>' : ''}
        </div>
        
        <h4 class="font-bold text-gray-800 mb-3 text-lg leading-tight">
            ${task.title}
        </h4>
        
        ${task.description ? `<p class="text-gray-600 text-sm mb-4 leading-relaxed">${task.description.substring(0, 80)}${task.description.length > 80 ? '...' : ''}</p>` : ''}
        
        <div class="space-y-2 mb-4">
            ${task.due_date ? `
                <div class="flex items-center text-sm text-gray-500">
                    <span class="mr-2">⏰</span>
                    <span class="font-medium">${formatDate(task.due_date)}</span>
                </div>
            ` : ''}
            
            <div class="flex items-center text-xs text-gray-400">
                <span class="mr-2">📅</span>
                <span>Created ${formatDate(task.created_at)}</span>
            </div>
        </div>
        
        <div class="flex justify-between items-center pt-3 border-t border-gray-100">
            <div class="flex space-x-3">
                <button onclick="editTask(${task.id})" class="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    <span class="mr-1">✏️</span>Edit
                </button>
                <button onclick="deleteTask(${task.id})" class="flex items-center text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
                    <span class="mr-1">🗑️</span>Delete
                </button>
            </div>
            <div class="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                #${task.id}
            </div>
        </div>
    `;
    
    return card;
}

function getPriorityIcon(priority) {
    switch(priority) {
        case 'High': return '<span class="text-lg">🔥</span>';
        case 'Medium': return '<span class="text-lg">⚡</span>';
        case 'Low': return '<span class="text-lg">🌱</span>';
        default: return '<span class="text-lg">⚡</span>';
    }
}

function getPriorityClass(priority) {
    switch(priority) {
        case 'High': return 'bg-red-100 text-red-700';
        case 'Medium': return 'bg-yellow-100 text-yellow-700';
        case 'Low': return 'bg-green-100 text-green-700';
        default: return 'bg-yellow-100 text-yellow-700';
    }
}

function getPriorityBorderClass(priority) {
    switch(priority) {
        case 'High': return 'border-red-400';
        case 'Medium': return 'border-yellow-400';
        case 'Low': return 'border-green-400';
        default: return 'border-yellow-400';
    }
}

function updateTaskCounts() {
    const tasks = taskManager.getTasks();
    const todoCount = tasks.filter(t => t.status === 'To-Do').length;
    const inProgressCount = tasks.filter(t => t.status === 'In-Progress').length;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    
    document.getElementById('todo-count').textContent = todoCount;
    document.getElementById('inprogress-count').textContent = inProgressCount;
    document.getElementById('completed-count').textContent = completedCount;
}

function applyFilters() {
    renderTasks();
}

function loadSampleData() {
    taskManager.loadSampleData();
    renderTasks();
    showMessage('Sample data loaded successfully!');
}

function clearAllData() {
    if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
        localStorage.removeItem('taskflow_tasks');
        taskManager.tasks = [];
        renderTasks();
        showMessage('All data cleared successfully!');
    }
}

function showCreateModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-8 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <div class="text-center mb-8">
                <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 floating">
                    <span class="text-3xl">✨</span>
                </div>
                <h2 class="text-3xl font-bold text-gray-800 mb-2">Create New Mission</h2>
                <p class="text-gray-600">Transform your ideas into actionable tasks</p>
            </div>
            
            <form id="create-task-form" class="space-y-8">
                <div class="space-y-3">
                    <label class="flex items-center text-lg font-semibold text-gray-700">
                        <span class="mr-2">🎯</span> Mission Title
                    </label>
                    <input type="text" name="title" required
                           class="w-full px-6 py-4 bg-white bg-opacity-70 border-0 rounded-2xl focus:ring-4 focus:ring-purple-200 transition-all text-lg"
                           placeholder="What needs to be accomplished?">
                </div>
                
                <div class="space-y-3">
                    <label class="flex items-center text-lg font-semibold text-gray-700">
                        <span class="mr-2">📝</span> Mission Brief
                    </label>
                    <textarea name="description" rows="4" 
                              class="w-full px-6 py-4 bg-white bg-opacity-70 border-0 rounded-2xl focus:ring-4 focus:ring-purple-200 transition-all resize-none"
                              placeholder="Describe the mission details and objectives..."></textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        <label class="flex items-center text-lg font-semibold text-gray-700">
                            <span class="mr-2">🚨</span> Priority Level
                        </label>
                        <select name="priority" class="w-full px-6 py-4 bg-white bg-opacity-70 border-0 rounded-2xl focus:ring-4 focus:ring-purple-200 transition-all">
                            <option value="Low">🌱 Low Priority</option>
                            <option value="Medium" selected>⚡ Medium Priority</option>
                            <option value="High">🔥 High Priority</option>
                        </select>
                    </div>
                    
                    <div class="space-y-3">
                        <label class="flex items-center text-lg font-semibold text-gray-700">
                            <span class="mr-2">📊</span> Current Stage
                        </label>
                        <select name="status" class="w-full px-6 py-4 bg-white bg-opacity-70 border-0 rounded-2xl focus:ring-4 focus:ring-purple-200 transition-all">
                            <option value="To-Do" selected>📝 Backlog</option>
                            <option value="In-Progress">⚡ In Motion</option>
                            <option value="Completed">🏆 Victory</option>
                        </select>
                    </div>
                </div>
                
                <div class="space-y-3">
                    <label class="flex items-center text-lg font-semibold text-gray-700">
                        <span class="mr-2">⏰</span> Mission Deadline
                    </label>
                    <input type="datetime-local" name="due_date"
                           class="w-full px-6 py-4 bg-white bg-opacity-70 border-0 rounded-2xl focus:ring-4 focus:ring-purple-200 transition-all">
                </div>
                
                <div class="flex justify-between items-center pt-8">
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex items-center bg-gray-400 hover:bg-gray-500 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold">
                        <span class="mr-2">↩️</span>Cancel Mission
                    </button>
                    <button type="submit" class="flex items-center gradient-bg text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold neon-glow">
                        <span class="mr-2">🚀</span>Launch Mission
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('create-task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            status: formData.get('status'),
            due_date: formData.get('due_date') || null
        };
        
        if (!taskData.title.trim()) {
            showMessage('Please enter a task title', 'error');
            return;
        }
        
        taskManager.addTask(taskData);
        renderTasks();
        modal.remove();
        showMessage('Task created successfully!');
    });
}

function editTask(id) {
    const task = taskManager.getTask(id);
    if (!task) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 class="text-2xl font-bold mb-6">Edit Task</h3>
            <form id="edit-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Title</label>
                        <input type="text" id="edit-title" value="${task.title}" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Description</label>
                        <textarea id="edit-description" rows="3" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400">${task.description}</textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Priority</label>
                            <select id="edit-priority" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400">
                                <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
                                <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                                <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Status</label>
                            <select id="edit-status" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400">
                                <option value="To-Do" ${task.status === 'To-Do' ? 'selected' : ''}>To-Do</option>
                                <option value="In-Progress" ${task.status === 'In-Progress' ? 'selected' : ''}>In-Progress</option>
                                <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Due Date</label>
                        <input type="datetime-local" id="edit-due-date" value="${task.due_date ? task.due_date.substring(0, 16) : ''}" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400">
                    </div>
                </div>
                <div class="flex justify-between mt-6">
                    <button type="button" onclick="this.closest('.fixed').remove()" class="bg-gray-500 text-white px-6 py-3 rounded-xl">Cancel</button>
                    <button type="submit" class="bg-blue-500 text-white px-6 py-3 rounded-xl">Update Task</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('edit-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updates = {
            title: document.getElementById('edit-title').value,
            description: document.getElementById('edit-description').value,
            priority: document.getElementById('edit-priority').value,
            status: document.getElementById('edit-status').value,
            due_date: document.getElementById('edit-due-date').value || null
        };
        
        taskManager.updateTask(id, updates);
        renderTasks();
        modal.remove();
        showMessage('Task updated successfully!');
    });
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        taskManager.deleteTask(id);
        renderTasks();
        showMessage('Task deleted successfully!');
    }
}

// Initialize drag and drop and render tasks
document.addEventListener('DOMContentLoaded', function() {
    const columns = ['todo-column', 'inprogress-column', 'completed-column'];
    
    columns.forEach(columnId => {
        const column = document.getElementById(columnId);
        if (column) {
            new Sortable(column, {
                group: 'tasks',
                animation: 150,
                ghostClass: 'opacity-50',
                filter: '.text-center',
                onEnd: function(evt) {
                    const taskId = parseInt(evt.item.dataset.taskId);
                    const newStatus = evt.to.dataset.status;
                    
                    taskManager.updateTask(taskId, { status: newStatus });
                    renderTasks();
                    showMessage(`Task moved to ${newStatus}!`);
                }
            });
        }
    });
    
    // Initial render
    renderTasks();
    
    // Add event listeners for filters
    ['priority-filter', 'status-filter', 'sort-filter'].forEach(id => {
        document.getElementById(id).addEventListener('change', renderTasks);
    });
});