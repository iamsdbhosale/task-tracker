// src/components/StaffDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCard from './TaskCard';

function StaffDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', { role: user.role, username: user.username });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markCompleted = async (taskId) => {
    try {
      await axios.post('http://localhost:5000/api/update-task', { id: taskId, status: 'completed' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h2>Welcome, {user.username}</h2>
      <button onClick={onLogout}>Logout</button>

      <h3 style={{ marginTop: 20 }}>Your Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks assigned to you yet.</p>
      ) : (
        tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            isAdmin={false} 
            markCompleted={markCompleted} 
          />
        ))
      )}
    </div>
  );
}

export default StaffDashboard;
