import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const { user } = useAuth();

  const fetchAll = useCallback(async () => {
    if (!user) return;
    try {
      const [projRes, taskRes, userRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks'),
        api.get('/users')
      ]);
      setProjects(projRes.data);
      setTasks(taskRes.data);
      setTeam(userRes.data);
    } catch (e) {
      console.error('Error fetching data', e);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Projects CRUD — use functional setState to avoid stale closures
  const createProject = async (data) => {
    const res = await api.post('/projects', data);
    setProjects(prev => [...prev, res.data]);
    return res.data;
  };
  const updateProject = async (id, data) => {
    const res = await api.put(`/projects/${id}`, data);
    setProjects(prev => prev.map(p => p._id === id ? res.data : p));
    return res.data;
  };
  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects(prev => prev.filter(p => p._id !== id));
  };

  // Tasks CRUD
  const createTask = async (data) => {
    const res = await api.post('/tasks', data);
    setTasks(prev => [...prev, res.data]);
    return res.data;
  };
  const updateTask = async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    setTasks(prev => prev.map(t => t._id === id ? res.data : t));
    return res.data;
  };
  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  // Team CRUD
  const updateUserRole = async (id, role) => {
    const res = await api.put(`/users/${id}`, { role });
    setTeam(prev => prev.map(t => t._id === id ? res.data : t));
  };
  const removeUser = async (id) => {
    await api.delete(`/users/${id}`);
    setTeam(prev => prev.filter(t => t._id !== id));
  };

  return (
    <DataContext.Provider value={{
      projects, tasks, team, fetchAll,
      createProject, updateProject, deleteProject,
      createTask, updateTask, deleteTask,
      updateUserRole, removeUser
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
