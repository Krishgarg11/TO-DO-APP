import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- STATE MANAGEMENT ---
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('humanized-todos-final');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('all'); // 'all' or 'important'
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('Low');
  const [dueDate, setDueDate] = useState(''); 
  const [greeting, setGreeting] = useState('');

  // Save tasks to local storage
  useEffect(() => {
    localStorage.setItem('humanized-todos-final', JSON.stringify(todos));
  }, [todos]);

  // Dynamic greeting text based on time
  //this is the main apperance of the app, it will change based on the time of the day.
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Let's make today count");
    else if (hour >= 12 && hour < 17) setGreeting("Keep up the great momentum");
    else if (hour >= 17 && hour < 22) setGreeting("Time to wrap up your day's wins");
    else setGreeting("Burning the midnight oil");
  }, []);

  // --- ACTIONS ---
  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setTodos([{ 
      id: Date.now(), 
      text: inputValue, 
      completed: false, 
      priority: priority,
      dueDate: dueDate,
      important: currentView === 'important' 
    }, ...todos]);
    
    setInputValue('');
    setDueDate('');
    setPriority('Low');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const toggleImportant = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, important: !todo.important } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // --- FILTERING & CALCULATIONS ---
  const displayedTodos = currentView === 'important' 
    ? todos.filter(t => t.important) 
    : todos;

  const completedCount = displayedTodos.filter(t => t.completed).length;
  const totalCount = displayedTodos.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const pendingCount = totalCount - completedCount;

  return (
    <div className="app-wrapper">
      
      {}
      {isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {}
      {isSidebarOpen && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Menu</h2>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${currentView === 'all' ? 'active' : ''}`}
              onClick={() => { setCurrentView('all'); setIsSidebarOpen(false); }}
            >
              📝 My Tasks
            </button>
            <button 
              className={`nav-item ${currentView === 'important' ? 'active' : ''}`}
              onClick={() => { setCurrentView('important'); setIsSidebarOpen(false); }}
            >
              ⭐ Important
            </button>
          </nav>
        </aside>
      )}

      <div className="todo-container">
        
        {/* Header Section */}
        <header className="header">
          <div className="header-top">
            
            <button 
              className="hamburger" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <h1>{greeting}! 🚀</h1>
            <div style={{width: '24px'}}></div> 
          </div>
          
          <p className="subtitle">
            {currentView === 'important' ? (
              totalCount === 0 
                ? "No crucial targets marked yet." 
                : `You have ${pendingCount} critical task${pendingCount === 1 ? '' : 's'} on focus.`
            ) : (
              totalCount === 0 
                ? "Your canvas is blank. What's the first step?" 
                : `You have ${pendingCount} task${pendingCount === 1 ? '' : 's'} waiting for you.`
            )}
          </p>
          
          {totalCount > 0 && (
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          )}
        </header>

        {/* Form Controls */}
        <form onSubmit={addTodo} className="input-form">
          <input
            type="text"
            placeholder={currentView === 'important' ? "Add a high-priority task..." : "What needs to be done?"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="task-input main-input"
          />
          
          <div className="form-controls">
            <div className="control-field">
              <label>Due Date (Optional)</label>
              <input 
                type="date" 
                className="task-input date-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            
            <div className="control-field">
              <label>Priority</label>
              <select 
                className="task-input priority-select" 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Med</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <button type="submit" className="add-btn">Add</button>
          </div>
        </form>

        {/* Tasks View*/}
        <div className="task-list">
          {totalCount === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">{currentView === 'important' ? '⭐' : '🎯'}</span>
              <p>
                {currentView === 'important' 
                  ? "Star important items to keep track of them here." 
                  : "Nothing on the agenda yet. Take a breather or plan ahead!"}
              </p>
            </div>
          ) : (
            displayedTodos.map(todo => (
              <div key={todo.id} className={`task-item ${todo.completed ? 'completed' : ''}`}>
                <label className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                
                <div className="task-content">
                  <span className="task-text">{todo.text}</span>
                  <div className="task-meta">
                    <span className={`priority-badge priority-${todo.priority.toLowerCase()}`}>
                      {todo.priority}
                    </span>
                    {todo.dueDate && (
                      <span className="task-date">
                        📅 {new Date(todo.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="action-buttons">
                  <button 
                    onClick={() => toggleImportant(todo.id)}
                    className={`star-btn ${todo.important ? 'active' : ''}`}
                    title="Mark as Important"
                  >
                    {todo.important ? '★' : '☆'}
                  </button>
                  <button 
                    onClick={() => deleteTodo(todo.id)} 
                    className="delete-btn"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear Actions */}
        {completedCount > 0 && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear {completedCount} completed item{completedCount > 1 ? 's' : ''} from this view
          </button>
        )}

      </div>
    </div>
  );
}

export default App;