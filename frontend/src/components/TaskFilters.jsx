const STATUS_OPTIONS   = [
  { value: '',           label: 'Todos' },
  { value: 'pendiente',  label: 'Pendientes' },
  { value: 'completada', label: 'Completadas' },
];
const PRIORITY_OPTIONS = [
  { value: '',      label: 'Todas' },
  { value: 'alta',  label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja',  label: 'Baja' },
];

function FilterGroup({ label, options, current, onSelect }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}:</span>
      {options.map(({ value, label: optLabel }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            current === value
              ? 'bg-[#A3151A] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-[#A3151A] hover:text-white'
          }`}
        >
          {optLabel}
        </button>
      ))}
    </div>
  );
}

export default function TaskFilters({ filters, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white border rounded-xl px-5 py-4 mb-6 shadow-sm flex-wrap">
      <FilterGroup
        label="Estado"
        options={STATUS_OPTIONS}
        current={filters.status}
        onSelect={(v) => onChange(f => ({ ...f, status: v }))}
      />
      <div className="hidden sm:block w-px bg-gray-200 self-stretch" />
      <FilterGroup
        label="Prioridad"
        options={PRIORITY_OPTIONS}
        current={filters.priority}
        onSelect={(v) => onChange(f => ({ ...f, priority: v }))}
      />
      {(filters.status || filters.priority) && (
        <button
          onClick={() => onChange({ status: '', priority: '' })}
          className="ml-auto text-xs text-gray-400 hover:text-gray-600 underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
