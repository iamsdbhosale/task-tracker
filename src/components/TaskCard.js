// src/components/TaskCard.js
import React from 'react';

function TaskCard({ task, isAdmin, markCompleted }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 5,
      padding: 15,
      marginBottom: 10,
      backgroundColor: task.status === 'completed' ? '#d4edda' : '#fff'
    }}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p><b>Assigned To:</b> {task.assignedTo}</p>
      <p><b>Status:</b> {task.status}</p>

      {!isAdmin && task.status !== 'completed' && (
        <button onClick={() => markCompleted(task.id)}>Mark Completed</button>
      )}
    </div>
  );
}

export default TaskCard;
