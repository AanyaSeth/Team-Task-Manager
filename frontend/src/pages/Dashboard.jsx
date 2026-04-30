import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await client.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await client.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    // Extract YYYY-MM-DD to avoid timezone shift issues
    const dateStr = dueDate.split('T')[0];
    const [year, month, day] = dateStr.split('-').map(Number);
    const due = new Date(year, month - 1, day);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return due < today;
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user.role === 'ADMIN' && (
            <Link to="/admin" className="btn" style={{ textDecoration: 'none' }}>Admin Panel</Link>
          )}
          <button onClick={logout} className="btn" style={{ backgroundColor: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="task-grid">
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map(task => {
            const overdue = isOverdue(task.dueDate) && task.status !== 'DONE';
            
            return (
              <div key={task._id} className={`task-card ${overdue ? 'overdue' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="task-title">{task.title}</h3>
                  {overdue && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem', fontWeight: 'bold' }}>OVERDUE</span>}
                </div>
                
                <p className="task-desc">{task.description}</p>
                
                <div className="task-meta">
                  <div><strong>Project:</strong> {task.projectId?.name || 'Unknown'}</div>
                  {user.role === 'ADMIN' && <div><strong>Assignee:</strong> {task.assignedTo?.name}</div>}
                  <div><strong>Due:</strong> {task.dueDate ? new Date(task.dueDate.split('T')[0] + 'T00:00:00').toLocaleDateString() : 'No date'}</div>
                </div>

                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Status</label>
                  <select 
                    className="status-select" 
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
