// src/components/AssignTask.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AssignTask({ onAssign }) {
  const [staffList, setStaffList] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  useEffect(() => {
    // Fetch users and filter staff only
    axios.get('http://localhost:5000/api/users')
      .then(res => {
        const staff = res.data.filter(user => user.role === 'staff');
        setStaffList(staff);
      })
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  useEffect(() => {
    if (departmentFilter === 'All') {
      setFilteredStaff(staffList);
    } else {
      setFilteredStaff(staffList.filter(s => s.department === departmentFilter));
    }
  }, [departmentFilter, staffList]);

  const handleAssign = () => {
    if (!taskTitle.trim() || !selectedStaff) {
      alert('Please enter task title and select staff');
      return;
    }
    const assignedStaff = filteredStaff.find(s => s.username === selectedStaff);
    if (!assignedStaff) {
      alert('Selected staff not found');
      return;
    }
    onAssign({
      title: taskTitle,
      description: taskDesc,
      assignedTo: assignedStaff.username,
      assignedDept: assignedStaff.department,
      status: 'pending',
    });
    setTaskTitle('');
    setTaskDesc('');
    setSelectedStaff('');
  };

  // Unique departments for filter dropdown
  const departments = ['All', ...new Set(staffList.map(s => s.department).filter(Boolean))];

  return (
    <div style={{ border: '1px solid #ddd', padding: 15, borderRadius: 5, marginBottom: 20 }}>
      <h3>Assign Task</h3>

      <label>Filter by Department: </label>
      <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
        {departments.map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>

      <br /><br />

      <input
        type="text"
        placeholder="Task Title"
        value={taskTitle}
        onChange={e => setTaskTitle(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 5 }}
      />

      <textarea
        placeholder="Task Description"
        value={taskDesc}
        onChange={e => setTaskDesc(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 5 }}
      />

      <label>Assign to Staff: </label>
      <select
        value={selectedStaff}
        onChange={e => setSelectedStaff(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 5 }}
      >
        <option value="">Select Staff</option>
        {filteredStaff.map(staff => (
          <option key={staff.username} value={staff.username}>
            {staff.username} ({staff.department})
          </option>
        ))}
      </select>

      <button onClick={handleAssign} style={{ padding: '8px 16px' }}>
        Assign Task
      </button>
    </div>
  );
}

export default AssignTask;
