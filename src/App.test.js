import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { boardReducer, moveTask, store } from './store';

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

test('renders agile sprint board with backlog and report metrics', () => {
  renderApp();

  expect(screen.getByRole('heading', { name: /quadro kanban ágil/i })).toBeInTheDocument();
  expect(screen.getAllByText(/sprint 12/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/autenticação social/i)).toBeInTheDocument();
  expect(screen.getByText(/backlog/i)).toBeInTheDocument();
});

test('adds and opens task actions and details modal', () => {
  renderApp();

  fireEvent.change(screen.getByLabelText(/título da tarefa/i), {
    target: { value: 'Relatório de sprint' },
  });
  fireEvent.change(screen.getByLabelText(/responsável/i), {
    target: { value: 'Marina' },
  });
  fireEvent.click(screen.getByRole('button', { name: /adicionar tarefa/i }));

  expect(screen.getByText(/relatório de sprint/i)).toBeInTheDocument();

  fireEvent.click(screen.getAllByRole('button', { name: /detalhes/i })[0]);

  expect(screen.getByText(/detalhes da tarefa/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /editar tarefa/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /marcar como concluída/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /excluir tarefa/i })).toBeInTheDocument();
});

test('reorders tasks within the same column', () => {
  const state = boardReducer(
    {
      activeSprintId: 'Sprint 12',
      sprints: {
        'Sprint 12': {
          backlog: [
            { id: 'a', title: 'Primeira', estimate: 2, priority: 'Baixa', assignee: 'Ana', labels: [], column: 'backlog' },
            { id: 'b', title: 'Segunda', estimate: 3, priority: 'Média', assignee: 'Bia', labels: [], column: 'backlog' },
          ],
          todo: [],
          doing: [],
          done: [],
        },
      },
    },
    moveTask({
      sprintId: 'Sprint 12',
      sourceColumn: 'backlog',
      sourceIndex: 0,
      destinationColumn: 'backlog',
      destinationIndex: 1,
      taskId: 'a',
    })
  );

  expect(state.sprints['Sprint 12'].backlog.map((task) => task.id)).toEqual(['b', 'a']);
});
