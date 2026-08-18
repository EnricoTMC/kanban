import { Button } from './Button';
import { Input, Select } from './Input';

export function TaskForm({ formData, onChange, onSubmit, submitLabel = 'Adicionar tarefa' }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form className="formulario-tarefa" onSubmit={handleSubmit}>
      <h3>{submitLabel === 'Adicionar tarefa' ? 'Adicionar tarefa' : 'Editar tarefa'}</h3>

      <Input
        label="Título da tarefa"
        name="title"
        value={formData.title}
        onChange={onChange}
        placeholder="Ex.: Revisão da API"
        required
      />

      <Input
        label="Responsável"
        name="assignee"
        value={formData.assignee}
        onChange={onChange}
        placeholder="Ex.: Rafael"
        required
      />

      <Input
        label="Estimativa"
        type="number"
        name="estimate"
        value={formData.estimate}
        onChange={onChange}
        min="1"
        max="40"
      />

      <Select
        label="Prioridade"
        name="priority"
        value={formData.priority}
        onChange={onChange}
        options={[
          { value: 'Baixa', label: 'Baixa' },
          { value: 'Média', label: 'Média' },
          { value: 'Alta', label: 'Alta' },
          { value: 'Crítica', label: 'Crítica' },
        ]}
      />

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
