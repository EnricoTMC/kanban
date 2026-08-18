import { Draggable } from '@hello-pangea/dnd';

export function TaskCard({ task, index, onOpenDetails, onDelete }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenDetails(task);
    }
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(dragProvided) => (
        <article
          className="cartao"
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => onOpenDetails(task)}
          aria-label={`Tarefa: ${task.title}, responsável: ${task.assignee}`}
          title="Clique para abrir detalhes ou pressione Enter"
        >
          <div className="drag-handle" {...dragProvided.dragHandleProps} aria-label="Arraste para reordenar">
            <div className="linha-superior-cartao">
              <span className={`prioridade ${task.priority.toLowerCase()}`}>{task.priority}</span>
              <span className="pontos-historia">{task.estimate}</span>
            </div>
          </div>

          <h4>{task.title}</h4>

          <div className="linha-detalhes">
            <span>👤 {task.assignee}</span>
          </div>

          {task.labels && task.labels.length > 0 && (
            <div className="etiquetas">
              {task.labels.map((etiqueta) => (
                <span key={`${task.id}-${etiqueta}`}>{etiqueta}</span>
              ))}
            </div>
          )}
        </article>
      )}
    </Draggable>
  );
}
