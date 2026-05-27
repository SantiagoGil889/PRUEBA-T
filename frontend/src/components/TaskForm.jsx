import { useState, useEffect } from 'react';

export default function TaskForm({ task, onSubmit, onClose }) {
  const [form, setForm] = useState({
    title:       '',
    description: '',
    priority:    'media',
    status:      'pendiente',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title       || '',
        description: task.description || '',
        priority:    task.priority    || 'media',
        status:      task.status      || 'pendiente',
      });
    }
  }, [task]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim())        errs.title = 'El título es requerido';
    else if (form.title.length > 200) errs.title = 'Máximo 200 caracteres';
    if (form.description.length > 1000) errs.description = 'Máximo 1000 caracteres';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await onSubmit(form);
    } catch {
      // error shown via Dashboard notify
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value:    form[key],
    onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
    className: `w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A3151A] transition ${
      errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-[#A3151A]">
            {task ? 'Editar tarea' : 'Nueva tarea'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none px-1"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input type="text" placeholder="Nombre de la tarea" {...field('title')} />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción{' '}
              <span className="text-gray-400 font-normal text-xs">(opcional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe la tarea..."
              {...field('description')}
              className={field('description').className + ' resize-none'}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Priority + Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select {...field('priority')}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            {task && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select {...field('status')}>
                  <option value="pendiente">Pendiente</option>
                  <option value="completada">Completada</option>
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#A3151A] hover:bg-[#700A0E] disabled:bg-[#ccc] text-white px-4 py-2.5 rounded-xl transition-colors font-medium"
            >
              {loading ? 'Guardando...' : task ? 'Guardar cambios' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
