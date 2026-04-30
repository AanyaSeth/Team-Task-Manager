import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function AdminPanel() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Project Form
  const [projectName, setProjectName] = useState('');
  
  // Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskProject, setTaskProject] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchProjects();
    fetchUsers(); // Note: we need a GET /api/users endpoint for this, but since we didn't build one, we'll implement a mock or add it to backend if needed. Wait, we can't assign without users. 
    // Let's assume we can add a simple user fetch or just type IDs for MVP, but a real app needs a user list.
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await client.get('/projects');
      setProjects(res.data);
      if (res.data.length > 0) setTaskProject(res.data[0]._id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    // We don't have a users endpoint in the MVP requirements, but we need it for the dropdown.
    // As a workaround, we can just use a generic fetch if we add the route, or type the ID.
    // Let's make an API call to a users endpoint that we will create right after this.
    try {
      const res = await client.get('/auth/users');
      setUsers(res.data);
      if (res.data.length > 0) setTaskAssignee(res.data[0]._id);
    } catch (err) {
      console.error('Failed to fetch users. Ensure /api/auth/users endpoint exists.', err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await client.post('/projects', { name: projectName });
      setProjects([...projects, res.data]);
      setProjectName('');
      setMessage({ text: 'Project created successfully!', type: 'success' });
      if (!taskProject) setTaskProject(res.data._id);
    } catch (error) {
      setMessage({ text: error.response?.data?.error || 'Error creating project', type: 'error' });
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await client.post('/tasks', {
        title: taskTitle,
        description: taskDesc,
        projectId: taskProject,
        assignedTo: taskAssignee,
        dueDate: taskDueDate || undefined,
      });
      setTaskTitle('');
      setTaskDesc('');
      setTaskDueDate('');
      setMessage({ text: 'Task assigned successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: error.response?.data?.error || 'Error assigning task', type: 'error' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Admin Panel</h1>
        <Link to="/" className="btn" style={{ textDecoration: 'none', width: 'auto' }}>Back to Dashboard</Link>
      </div>

      {message.text && (
        <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '4px', backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2', color: message.type === 'success' ? '#065f46' : '#991b1b' }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Create Project */}
        <div className="task-card">
          <h2 style={{ marginBottom: '1.5rem' }}>Create Project</h2>
          <form onSubmit={handleCreateProject}>
            <div className="form-group">
              <label>Project Name</label>
              <input 
                type="text" 
                value={projectName} 
                onChange={e => setProjectName(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn">Create Project</button>
          </form>
        </div>

        {/* Create Task */}
        <div className="task-card">
          <h2 style={{ marginBottom: '1.5rem' }}>Assign Task</h2>
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <label>Task Title</label>
              <input type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <input type="text" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Project</label>
              <select value={taskProject} onChange={e => setTaskProject(e.target.value)} required>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Assign To</label>
              <select value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)} required>
                <option value="">Select User</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />
            </div>

            <button type="submit" className="btn">Assign Task</button>
          </form>
        </div>
      </div>
    </div>
  );
}
