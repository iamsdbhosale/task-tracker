// backend/server.js

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = './users.json';
const TASKS_FILE = './tasks.json';

// Get all users (for admin/debug)
app.get('/api/users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read users file' });
  }
});

// Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read users file' });
  }
});

// Get tasks (Admin gets all, Staff gets only their tasks)
app.post('/api/tasks', (req, res) => {
  const { role, username } = req.body;
  try {
    const tasks = JSON.parse(fs.readFileSync(TASKS_FILE));
    const filteredTasks = role === 'admin' ? tasks : tasks.filter(task => task.assignedTo === username);
    res.json(filteredTasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read tasks file' });
  }
});

// Add a new task
app.post('/api/add-task', (req, res) => {
  const task = req.body;
  try {
    let tasks = JSON.parse(fs.readFileSync(TASKS_FILE));
    tasks.push(task);
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save task' });
  }
});

// Update task status (e.g., mark as completed)
app.post('/api/update-task', (req, res) => {
  const { id, status } = req.body;
  try {
    let tasks = JSON.parse(fs.readFileSync(TASKS_FILE));
    tasks = tasks.map(task => task.id === id ? { ...task, status } : task);
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
