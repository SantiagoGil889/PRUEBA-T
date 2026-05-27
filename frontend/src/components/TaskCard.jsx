import { CheckIcon, Pencil, Trash, Undo2 } from 'lucide-react';

const PRIORITY_BADGE = {
  alta:  'bg-red-100 text-red-700 border border-red-200',
  media: 'bg-amber-100 text-amber-700 border border-amber-200',
  baja:  'bg-emerald-100 text-emerald-700 border border-emerald-200',
};
const PRIORITY_LABEL = { alta: 'Alta', media: 'Media', baja: 'Baja' };

export default function TaskCard({ task, onEdit, onToggle, onDelete }) {
  const done = task.status === 'completada';
  const date = new Date(task.fecha_creacion).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article
      className={`bg-white rounded-xl border shadow-sm flex flex-col gap-3 p-5 transition-all hover:shadow-md ${
        done ? 'opacity-60' : ''
      }`}
    >

      <div className="flex items-start justify-between gap-3">
        <h3
          className={`font-semibold text-gray-800 leading-snug ${
            done ? 'line-through text-gray-400' : ''
          }`}
        >
          {task.title}
        </h3>
        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_BADGE[task.priority]}`}>
          {PRIORITY_LABEL[task.priority]}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              done
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {done ? 'Completada' : 'Pendiente'}
          </span>
          <span className="text-xs text-gray-400">{date}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            title={done ? 'Marcar como pendiente' : 'Marcar como completada'}
            className={`p-1.5 rounded-lg transition-colors text-base ${
              done
                ? 'text-gray-400 hover:bg-gray-100'
                : 'text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            {done ? <Undo2 size={16} /> : <CheckIcon size={16} />}
          </button>
          <button
            onClick={onEdit}
            title="Editar tarea"
            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors text-base"
          >
            <Pencil size={16} color="orange" />
          </button>
          <button
            onClick={onDelete}
            title="Eliminar tarea"
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors text-base"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
