// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCard from './TaskCard';

function AdminDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', status: 'pending', id: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', { role: user.role, username: user.username });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      const staffUsers = res.data.filter(u => u.role === 'staff');
      setUsers(staffUsers);
      if (staffUsers.length > 0) setNewTask(prev => ({ ...prev, assignedTo: staffUsers[0].username }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.assignedTo) {
      setError('Please enter title and assign to a staff.');
      return;
    }
    setError('');
    try {
      const task = {
        ...newTask,
        id: Date.now().toString(),
      };
      await axios.post('http://localhost:5000/api/add-task', task);
      setNewTask({ title: '', description: '', assignedTo: users[0]?.username || '', status: 'pending', id: '' });
      fetchTasks();
    } catch (err) {
      setError('Failed to add task');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h2>Welcome, Admin {user.username}</h2>
      <button onClick={onLogout}>Logout</button>

      <h3 style={{ marginTop: 20 }}>Assign New Task</h3>
      <div>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <textarea
          placeholder="Description"
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <select name="assignedTo" value={newTask.assignedTo} onChange={handleInputChange} style={{ padding: 8, marginBottom: 10 }}>
          {users.map(u => (
            <option key={u.username} value={u.username}>{u.username}</option>
          ))}
        </select>
        <button onClick={addTask}>Add Task</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <h3 style={{ marginTop: 40 }}>All Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        tasks.map(task => <TaskCard key={task.id} task={task} isAdmin={true} refreshTasks={fetchTasks} />)
      )}
    </div>
  );
}

export default AdminDashboard;
