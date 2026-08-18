import { configureStore, createSlice } from '@reduxjs/toolkit';

const COLUNAS = ['backlog', 'aFazer', 'emAndamento', 'concluido'];

const construirSprintVazia = () => ({
  backlog: [],
  aFazer: [],
  emAndamento: [],
  concluido: [],
});

const sprintsIniciais = {
  'Sprint 12': {
    backlog: [
      {
        id: 's12-1',
        titulo: 'Autenticação social',
        responsavel: 'Ana',
        estimativa: 5,
        prioridade: 'Alta',
        coluna: 'backlog',
        etiquetas: ['UX', 'Segurança'],
      },
    ],
    aFazer: [
      {
        id: 's12-2',
        titulo: 'Painel de métricas',
        responsavel: 'Bruno',
        estimativa: 3,
        prioridade: 'Média',
        coluna: 'aFazer',
        etiquetas: ['Dashboard'],
      },
    ],
    emAndamento: [
      {
        id: 's12-3',
        titulo: 'Refatoração do checkout',
        responsavel: 'Carla',
        estimativa: 8,
        prioridade: 'Crítica',
        coluna: 'emAndamento',
        etiquetas: ['Pagamento'],
      },
    ],
    concluido: [
      {
        id: 's12-4',
        titulo: 'Testes de regressão',
        responsavel: 'Diego',
        estimativa: 2,
        prioridade: 'Baixa',
        coluna: 'concluido',
        etiquetas: ['QA'],
      },
    ],
  },
};

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    sprintAtivaId: 'Sprint 12',
    sprints: sprintsIniciais,
  },
  reducers: {
    adicionarSprint: (estado, acao) => {
      const nomeSprint = acao.payload.trim();
      if (!nomeSprint || estado.sprints[nomeSprint]) return;

      estado.sprints[nomeSprint] = construirSprintVazia();
      estado.sprintAtivaId = nomeSprint;
    },
    setSprintAtiva: (estado, acao) => {
      if (estado.sprints[acao.payload]) {
        estado.sprintAtivaId = acao.payload;
      }
    },
    adicionarTarefa: (estado, acao) => {
      const { sprintId, tarefa } = acao.payload;
      const sprint = estado.sprints[sprintId];
      if (!sprint) return;

      sprint.backlog.push({
        ...tarefa,
        id: tarefa.id || `${sprintId}-${Date.now()}`,
        coluna: 'backlog',
        etiquetas: tarefa.etiquetas || ['Nova'],
      });
    },
    editarTarefa: (estado, acao) => {
      const { sprintId, tarefaId, dados } = acao.payload;
      const sprint = estado.sprints[sprintId];
      if (!sprint) return;

      Object.values(sprint).forEach((lista) => {
        const tarefaEncontrada = lista.find((item) => String(item.id) === String(tarefaId));
        if (!tarefaEncontrada) return;

        Object.assign(tarefaEncontrada, dados);
      });
    },
    excluirTarefa: (estado, acao) => {
      const { sprintId, tarefaId } = acao.payload;
      const sprint = estado.sprints[sprintId];
      if (!sprint) return;

      Object.keys(sprint).forEach((colunaId) => {
        sprint[colunaId] = sprint[colunaId].filter((item) => String(item.id) !== String(tarefaId));
      });
    },
    moverTarefa: (estado, acao) => {
      const {
        sprintId,
        colunaOrigem,
        colunaDestino,
        indiceOrigem,
        indiceDestino,
        tarefaId,
      } = acao.payload;

      const sprint = estado.sprints[sprintId];
      if (!sprint) return;

      const listaOrigem = [...sprint[colunaOrigem]];
      const indiceTarefa = listaOrigem.findIndex((item) => String(item.id) === String(tarefaId));

      if (indiceTarefa === -1) return;

      const [tarefaMovida] = listaOrigem.splice(indiceTarefa, 1);
      const tarefaAtualizada = { ...tarefaMovida, coluna: colunaDestino };

      if (colunaOrigem === colunaDestino) {
        const listaDestino = [...listaOrigem];
        listaDestino.splice(indiceDestino, 0, tarefaAtualizada);
        sprint[colunaOrigem] = listaDestino;
        return;
      }

      const listaDestino = [...sprint[colunaDestino]];
      listaDestino.splice(indiceDestino, 0, tarefaAtualizada);
      sprint[colunaOrigem] = listaOrigem;
      sprint[colunaDestino] = listaDestino;
    },
  },
});

export const {
  adicionarSprint,
  setSprintAtiva,
  adicionarTarefa,
  editarTarefa,
  excluirTarefa,
  moverTarefa,
} = boardSlice.actions;

export const boardReducer = boardSlice.reducer;

export const store = configureStore({
  reducer: {
    board: boardReducer,
  },
});

export { COLUNAS };
