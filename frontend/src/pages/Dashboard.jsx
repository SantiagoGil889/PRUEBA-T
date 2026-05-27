import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import { ConfirmDialog } from '../components/ConfirmDialog';

function Toast({ notification }) {
  if (!notification) return null;
  return (
    <div
      className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 animate-fade-in ${notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
        }`}
    >
      <span>{notification.type === 'error' ? '✕' : '✓'}</span>
      {notification.message}
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const notify = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      const { data } = await api.get('/tasks', { params });
      setTasks(data);
    } catch {
      notify('Error al cargar tareas', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, notify]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const openCreate = () => { setEditingTask(null); setShowForm(true); };
  const openEdit = (task) => { setEditingTask(task); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingTask(null); };

  const handleCreate = async (formData) => {
    try {
      const { data } = await api.post('/tasks', formData);
      setTasks(prev => [data, ...prev]);
      closeForm();
      notify('Tarea creada exitosamente');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg
        || err.response?.data?.message
        || 'Error al crear tarea';
      notify(msg, 'error');
      throw err;
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, formData);
      setTasks(prev => prev.map(t => (t.id === id ? data : t)));
      closeForm();
      notify('Tarea actualizada exitosamente');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg
        || err.response?.data?.message
        || 'Error al actualizar tarea';
      notify(msg, 'error');
      throw err;
    }
  };

  const handleToggle = async (task) => {
    const newStatus = task.status === 'pendiente' ? 'completada' : 'pendiente';
    try {
      const { data } = await api.put(`/tasks/${task.id}`, { status: newStatus });
      setTasks(prev => prev.map(t => (t.id === task.id ? data : t)));
      notify(newStatus === 'completada' ? '¡Tarea completada!' : 'Tarea marcada como pendiente');
    } catch {
      notify('Error al actualizar estado', 'error');
    }
  };

  const handleDelete = async (id) => {
    setConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/tasks/${confirmId}`);
      setTasks(prev => prev.filter(t => t.id !== confirmId));
      notify('Tarea eliminada');
    } catch {
      notify('Error al eliminar tarea', 'error');
    } finally {
      setConfirmId(null);
    }
  };



  const stats = {
    total: tasks.length,
    pendientes: tasks.filter(t => t.status === 'pendiente').length,
    completadas: tasks.filter(t => t.status === 'completada').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toast notification={notification} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Mis Tareas</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {stats.total} total &middot;{' '}
              <span className="text-amber-600 font-medium">{stats.pendientes} pendientes</span>
              {' '}&middot;{' '}
              <span className="text-emerald-600 font-medium">{stats.completadas} completadas</span>
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#A3151A] hover:bg-[#700A0E] text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <span className="text-xl leading-none">+</span> Nueva tarea
          </button>
        </div>

        <ConfirmDialog
          open={confirmId !== null}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmId(null)}
        />

        {/* Filters */}
        <TaskFilters filters={filters} onChange={setFilters} />

        {/* Task grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-6xl mb-4">📋</p>
            <p className="text-lg font-medium">No hay tareas creadas</p>
            <p className="text-sm mt-1">
              {filters.status || filters.priority
                ? 'Prueba cambiando los filtros'
                : '¡Crea una tarea primero!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => openEdit(task)}
                onToggle={() => handleToggle(task)}
                onDelete={() => handleDelete(task.id)}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask
            ? (data) => handleUpdate(editingTask.id, data)
            : handleCreate}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
