import { Check, Filter, Plus, SortAsc, Trash2, Edit3, Save, X, Calendar, Target, Zap, Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [showStats, setShowStats] = useState(true);

  // Load from memory state instead of localStorage
  useEffect(() => {
    // Initialize with some sample data for demonstration
    const sampleTasks = [
      {
        id: 1,
        text: 'Welcome to your enhanced Todo app!',
        completed: false,
        createdAt: new Date(),
        priority: 'high',
        category: 'Personal'
      }
    ];
    setTasks(sampleTasks);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Input validation
  const validateInput = (value) => {
    const newErrors = {};
    
    if (!value.trim()) {
      newErrors.text = 'Task cannot be empty';
    } else if (value.trim().length < 3) {
      newErrors.text = 'Task must be at least 3 characters long';
    } else if (value.trim().length > 100) {
      newErrors.text = 'Task cannot exceed 100 characters';
    } else if (tasks.some(task => task.text.toLowerCase() === value.trim().toLowerCase())) {
      newErrors.text = 'This task already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new task
  const addTask = () => {
    if (!validateInput(inputValue)) return;

    const newTask = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date(),
      priority: selectedPriority,
      category: 'Personal'
    };

    setTasks(prev => [newTask, ...prev]);
    setInputValue('');
    setErrors({});
  };

  // Remove task with animation
  const removeTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Edit task functionality
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = () => {
    if (!editValue.trim()) return;
    
    setTasks(prev => 
      prev.map(task => 
        task.id === editingId ? { ...task, text: editValue.trim() } : task
      )
    );
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // Filter tasks
  const getFilteredTasks = () => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'high':
        return tasks.filter(task => task.priority === 'high');
      case 'medium':
        return tasks.filter(task => task.priority === 'medium');
      case 'low':
        return tasks.filter(task => task.priority === 'low');
      default:
        return tasks;
    }
  };

  // Sort tasks
  const getSortedTasks = (filteredTasks) => {
    const sorted = [...filteredTasks];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.text.localeCompare(b.text));
      case 'status':
        return sorted.sort((a, b) => a.completed - b.completed);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case 'date':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Handle edit key press
  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const filteredTasks = getFilteredTasks();
  const sortedTasks = getSortedTasks(filteredTasks);
  const completedCount = tasks.filter(task => task.completed).length;
  const highPriorityCount = tasks.filter(task => task.priority === 'high' && !task.completed).length;

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      <div className="max-w-4xl mx-auto p-6">
        <div className={`rounded-2xl shadow-2xl transition-all duration-300 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white/80 backdrop-blur-sm'
        }`}>
          
          {/* Header */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  ✨ Smart Todo
                </h1>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Organize your life with style and efficiency
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                >
                  <Target size={20} />
                </button>
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            {showStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
                  <div className="text-2xl font-bold">{tasks.length}</div>
                  <div className="text-blue-100">Total Tasks</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
                  <div className="text-2xl font-bold">{completedCount}</div>
                  <div className="text-green-100">Completed</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-xl text-white">
                  <div className="text-2xl font-bold">{tasks.length - completedCount}</div>
                  <div className="text-orange-100">Pending</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-xl text-white">
                  <div className="text-2xl font-bold">{highPriorityCount}</div>
                  <div className="text-purple-100">High Priority</div>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {tasks.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-bold">
                    {Math.round((completedCount / tasks.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Add Task Section */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (errors.text) {
                      validateInput(e.target.value);
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="What needs to be done today?"
                  className={`w-full px-6 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    errors.text 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                  } ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                />
                {errors.text && (
                  <p className="text-red-500 text-sm mt-2 ml-2">{errors.text}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className={`px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
                  }`}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
                
                <button
                  onClick={addTask}
                  disabled={!!errors.text || !inputValue.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Plus size={20} />
                  Add Task
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <span className="text-sm font-medium">Filter:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
                  }`}
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <SortAsc size={16} className="text-gray-500" />
                <span className="text-sm font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
                  }`}
                >
                  <option value="date">Date Created</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                  <option value="priority">Priority</option>
                </select>
              </div>

              {completedCount > 0 && (
                <button
                  onClick={() => setTasks(prev => prev.filter(task => !task.completed))}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all transform hover:scale-105"
                >
                  Clear Completed ({completedCount})
                </button>
              )}
            </div>
          </div>

          {/* Task List */}
          <div className="p-6">
            {sortedTasks.length === 0 ? (
              <div className="text-center py-12 ">
                <div className="text-6xl mb-4">📝</div>
                <p className={`text-xl mb-2 ${darkMode ? 'text-gray-300 bg' : 'text-gray-600'}`}>
                  {filter === 'all' 
                    ? "Ready to be productive?" 
                    : `No ${filter} tasks found`
                  }
                </p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {filter === 'all' 
                    ? "Add your first task above to get started!" 
                    : "Try adjusting your filters"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`group  flex items-center gap-4 p-4 border-l-4 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 ${
                      task.completed 
                        ? 'bg-green-50 text-lime-600 border-l-green-500 opacity-75' 
                        : getPriorityColor(task.priority)
                    } ${darkMode && !task.completed ? 'bg-gray-700 border-l-blue-500' : ''}`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.5s ease-out'
                    }}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center justify-center w-8 h-8 border-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                        task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                      }`}
                    >
                      {task.completed && <Check size={18} />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      {editingId === task.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyPress={handleEditKeyPress}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${
                                task.completed 
                                  ? 'line-through text-gray-500' 
                                  : darkMode ? 'text-black' : 'text-gray-800'
                              }`}
                            >
                              {task.text}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className={`text-xs mt-1 flex items-center gap-2 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <Calendar size={12} />
                            {new Date(task.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId !== task.id && (
                        <button
                          onClick={() => startEditing(task.id, task.text)}
                          className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit task"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => removeTask(task.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {tasks.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Zap size={16} />
                <span>
                  {completedCount === tasks.length 
                    ? "🎉 All tasks completed! You're amazing!" 
                    : `Keep going! ${Math.round((completedCount / tasks.length) * 100)}% complete`
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TodoApp;