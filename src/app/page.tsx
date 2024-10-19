// app/page.tsx
"use client"; // Mark this component as a Client Component

import { useState, useEffect } from 'react';
import tasksData from './data/tasks'; // Adjust import for app directory

export default function Home() {
  const [tasks, setTasks] = useState(tasksData);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    setNewTask({ title: '', description: '', priority: 'medium' });
  };

  const editTask = (id, updatedTask) => {
    setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const sortedTasks = tasks.sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const filteredTasks = sortedTasks.filter(task =>
    (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  return (
    <div>
      <h1>Task Management</h1>
      <div>
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Title"
        />
        <input
          type="text"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Description"
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tasks"
      />

      <ul>
        {filteredTasks.map(task => (
          <li key={task.id} style={{ color: task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green' }}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <span>Priority: {task.priority}</span>
            <button onClick={() => toggleCompletion(task.id)}>
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => editTask(task.id, { ...task, title: prompt("New title:", task.title), description: prompt("New description:", task.description), priority: prompt("New priority (high, medium, low):", task.priority)})}>
              Edit
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
