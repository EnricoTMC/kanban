import { useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import {
  adicionarSprint,
  adicionarTarefa,
  editarTarefa,
  excluirTarefa,
  moverTarefa,
  setSprintAtiva,
} from './store';
import { obterMetricasSprint } from './selectors';
import './App.css';

const colunasIniciais = [
  { id: 'backlog', titulo: 'Backlog', destaque: 'azul' },
  { id: 'aFazer', titulo: 'A fazer', destaque: 'amarelo' },
  { id: 'emAndamento', titulo: 'Em andamento', destaque: 'roxo' },
  { id: 'concluido', titulo: 'Concluído', destaque: 'verde' },
];

function App() {
  const dispatch = useDispatch();
  const { sprintAtivaId, sprints } = useSelector((estado) => estado.board);
  const sprint = sprints[sprintAtivaId] || { backlog: [], aFazer: [], emAndamento: [], concluido: [] };
  const nomesSprint = Object.keys(sprints);

  const [formulario, setFormulario] = useState({
    titulo: '',
    responsavel: '',
    estimativa: 3,
    prioridade: 'Média',
  });
  const [novoNomeSprint, setNovoNomeSprint] = useState('');
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  const metricas = useMemo(() => obterMetricasSprint(sprint), [sprint]);

  const handleInputChange = (evento) => {
    const { name, value } = evento.target;
    setFormulario((atual) => ({
      ...atual,
      [name]: name === 'estimativa' ? (value === '' ? 0 : parseInt(value, 10)) : value,
    }));
  };

  const handleAdicionarTarefa = (evento) => {
    evento.preventDefault();

    if (!formulario.titulo.trim() || !formulario.responsavel.trim()) {
      return;
    }

    dispatch(
      adicionarTarefa({
        sprintId: sprintAtivaId,
        tarefa: {
          id: `${sprintAtivaId}-${Date.now()}`,
          titulo: formulario.titulo.trim(),
          responsavel: formulario.responsavel.trim(),
          estimativa: Number(formulario.estimativa) || 1,
          prioridade: formulario.prioridade,
          etiquetas: ['Nova'],
        },
      })
    );

    setFormulario({ titulo: '', responsavel: '', estimativa: 3, prioridade: 'Média' });
  };

  const handleCriarSprint = (evento) => {
    evento.preventDefault();
    if (!novoNomeSprint.trim()) return;
    dispatch(adicionarSprint(novoNomeSprint.trim()));
    setNovoNomeSprint('');
  };

  const handleDragFinal = (resultado) => {
    const { destination, source, draggableId } = resultado;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    dispatch(
      moverTarefa({
        sprintId: sprintAtivaId,
        colunaOrigem: source.droppableId,
        indiceOrigem: source.index,
        colunaDestino: destination.droppableId,
        indiceDestino: destination.index,
        tarefaId: draggableId,
      })
    );
  };

  const abrirDetalhes = (tarefa) => {
    setTarefaSelecionada({ ...tarefa });
    setModoEdicao(false);
  };

  const salvarEdicao = () => {
    if (!tarefaSelecionada) return;

    dispatch(
      editarTarefa({
        sprintId: sprintAtivaId,
        tarefaId: tarefaSelecionada.id,
        dados: {
          titulo: tarefaSelecionada.titulo,
          responsavel: tarefaSelecionada.responsavel,
          estimativa: Number(tarefaSelecionada.estimativa) || 1,
          prioridade: tarefaSelecionada.prioridade,
        },
      })
    );

    setModoEdicao(false);
  };

  const excluirTarefaAtual = () => {
    if (!tarefaSelecionada) return;

    dispatch(excluirTarefa({ sprintId: sprintAtivaId, tarefaId: tarefaSelecionada.id }));
    setTarefaSelecionada(null);
  };

  const marcarComoConcluida = () => {
    if (!tarefaSelecionada) return;

    const colunaOrigem = Object.keys(sprint).find((coluna) =>
      (sprint[coluna] || []).some((tarefa) => String(tarefa.id) === String(tarefaSelecionada.id))
    );

    if (!colunaOrigem) return;

    dispatch(
      moverTarefa({
        sprintId: sprintAtivaId,
        colunaOrigem: colunaOrigem,
        indiceOrigem: 0,
        colunaDestino: 'concluido',
        indiceDestino: sprint.concluido.length,
        tarefaId: tarefaSelecionada.id,
      })
    );

    setTarefaSelecionada(null);
  };

  return (
    <div className="estrutura-principal">
      <aside className="barra-lateral">
        <div className="cabecalho-marca">
          <span className="selo-marca">AgileOps</span>
          <h1>Painel de sprint</h1>
        </div>

        <div className="cartao-resumo">
          <p className="rotulo">Sprint atual</p>
          <select
            aria-label="Sprint atual"
            className="seletor-sprint"
            value={sprintAtivaId}
            onChange={(evento) => dispatch(setSprintAtiva(evento.target.value))}
          >
            {nomesSprint.map((nomeSprint) => (
              <option key={nomeSprint} value={nomeSprint}>
                {nomeSprint}
              </option>
            ))}
          </select>
          <h2>{sprintAtivaId}</h2>
          <span className="intervalo-data">18 ago – 31 ago</span>
        </div>

        <div className="grid-metricas">
          <div className="cartao-metrica">
            <span>Total de pontos</span>
            <strong>{metricas.totalPontos}</strong>
          </div>
          <div className="cartao-metrica">
            <span>Concluídas</span>
            <strong>{metricas.concluidas}</strong>
          </div>
          <div className="cartao-metrica">
            <span>Em andamento</span>
            <strong>{metricas.emAndamento}</strong>
          </div>
          <div className="cartao-metrica destaque">
            <span>Urgentes</span>
            <strong>{metricas.urgentes}</strong>
          </div>
        </div>

        <form className="formulario-tarefa" onSubmit={handleAdicionarTarefa}>
          <h3>Adicionar tarefa</h3>

          <label>
            Título da tarefa
            <input
              type="text"
              name="titulo"
              value={formulario.titulo}
              onChange={handleInputChange}
              placeholder="Ex.: Revisão da API"
            />
          </label>

          <label>
            Responsável
            <input
              type="text"
              name="responsavel"
              value={formulario.responsavel}
              onChange={handleInputChange}
              placeholder="Ex.: Rafael"
            />
          </label>

          <label>
            Estimativa
            <input
              type="number"
              min="1"
              max="40"
              name="estimativa"
              value={formulario.estimativa}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Prioridade
            <select name="prioridade" value={formulario.prioridade} onChange={handleInputChange}>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>
          </label>

          <button type="submit">Adicionar tarefa</button>
        </form>

        <form className="formulario-sprint" onSubmit={handleCriarSprint}>
          <h3>Nova sprint</h3>
          <label>
            Nome da sprint
            <input
              type="text"
              value={novoNomeSprint}
              onChange={(evento) => setNovoNomeSprint(evento.target.value)}
              placeholder="Ex.: Sprint 13"
            />
          </label>
          <button type="submit">Criar sprint</button>
        </form>
      </aside>

      <main className="painel-quadro">
        <header className="cabecalho-quadro">
          <div>
            <p className="rotulo">Gerenciamento de projetos</p>
            <h2>Quadro Kanban Ágil</h2>
          </div>
        </header>

        <DragDropContext onDragEnd={handleDragFinal}>
          <section className="colunas-quadro">
            {colunasIniciais.map((coluna) => (
              <Droppable key={coluna.id} droppableId={coluna.id}>
                {(fornecido) => (
                  <div className="coluna" ref={fornecido.innerRef} {...fornecido.droppableProps}>
                    <div className={`cabecalho-coluna ${coluna.destaque}`}>
                      <h3>{coluna.titulo}</h3>
                      <span>{sprint[coluna.id]?.length || 0}</span>
                    </div>

                    <div className="lista-cartoes">
                      {(sprint[coluna.id] || []).length === 0 ? (
                        <div className="estado-vazio">Sem itens nesta etapa.</div>
                      ) : (
                        (sprint[coluna.id] || []).map((tarefa, indice) => (
                          <Draggable key={tarefa.id} draggableId={String(tarefa.id)} index={indice}>
                            {(dragProvided) => (
                              <article
                                className="cartao"
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                              >
                                <div className="drag-handle" {...dragProvided.dragHandleProps}>
                                  <div className="linha-superior-cartao">
                                    <span className={`prioridade ${tarefa.prioridade.toLowerCase()}`}>{tarefa.prioridade}</span>
                                    <span className="pontos-historia">{tarefa.estimativa}</span>
                                  </div>
                                </div>

                                <h4>{tarefa.titulo}</h4>

                                <div className="linha-detalhes">
                                  <span>👤 {tarefa.responsavel}</span>
                                </div>

                                <div className="etiquetas">
                                  {tarefa.etiquetas.map((etiqueta) => (
                                    <span key={`${tarefa.id}-${etiqueta}`}>{etiqueta}</span>
                                  ))}
                                </div>

                                <div className="acoes-cartao">
                                  <button
                                    type="button"
                                    onMouseDown={(evento) => evento.stopPropagation()}
                                    onClick={(evento) => {
                                      evento.stopPropagation();
                                      abrirDetalhes(tarefa);
                                    }}
                                  >
                                    Detalhes
                                  </button>
                                  <button
                                    type="button"
                                    onMouseDown={(evento) => evento.stopPropagation()}
                                    onClick={(evento) => {
                                      evento.stopPropagation();
                                      dispatch(excluirTarefa({ sprintId: sprintAtivaId, tarefaId: tarefa.id }));
                                    }}
                                  >
                                    Excluir
                                  </button>
                                </div>
                              </article>
                            )}
                          </Draggable>
                        ))
                      )}
                      {fornecido.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </section>
        </DragDropContext>
      </main>

      {tarefaSelecionada && (
        <div className="overlay-modal" onClick={() => setTarefaSelecionada(null)}>
          <div className="modal-tarefa" onClick={(evento) => evento.stopPropagation()}>
            <div className="cabecalho-modal">
              <h3>Detalhes da tarefa</h3>
              <button type="button" className="botao-fechar" onClick={() => setTarefaSelecionada(null)}>
                X
              </button>
            </div>

            {modoEdicao ? (
              <div className="conteudo-modal">
                <label>
                  Título
                  <input
                    type="text"
                    value={tarefaSelecionada.titulo}
                    onChange={(evento) =>
                      setTarefaSelecionada((atual) => ({ ...atual, titulo: evento.target.value }))
                    }
                  />
                </label>
                <label>
                  Responsável
                  <input
                    type="text"
                    value={tarefaSelecionada.responsavel}
                    onChange={(evento) =>
                      setTarefaSelecionada((atual) => ({ ...atual, responsavel: evento.target.value }))
                    }
                  />
                </label>
                <label>
                  Estimativa
                  <input
                    type="number"
                    min="1"
                    value={tarefaSelecionada.estimativa}
                    onChange={(evento) =>
                      setTarefaSelecionada((atual) => ({ ...atual, estimativa: evento.target.value === '' ? 1 : parseInt(evento.target.value, 10) }))
                    }
                  />
                </label>
                <label>
                  Prioridade
                  <select
                    value={tarefaSelecionada.prioridade}
                    onChange={(evento) =>
                      setTarefaSelecionada((atual) => ({ ...atual, prioridade: evento.target.value }))
                    }
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </label>

                <div className="acoes-modal">
                  <button type="button" onClick={salvarEdicao}>Salvar tarefa</button>
                  <button type="button" className="botao-secundario" onClick={() => setModoEdicao(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="conteudo-modal">
                <div className="resumo-tarefa">
                  <span className={`prioridade ${tarefaSelecionada.prioridade.toLowerCase()}`}>
                    {tarefaSelecionada.prioridade}
                  </span>
                  <span className="pontos-historia">{tarefaSelecionada.estimativa}</span>
                </div>

                <h4>{tarefaSelecionada.titulo}</h4>
                <p>
                  <strong>Responsável:</strong> {tarefaSelecionada.responsavel}
                </p>
                <p>
                  <strong>Etiquetas:</strong> {tarefaSelecionada.etiquetas.join(', ')}
                </p>

                <div className="acoes-modal">
                  <button type="button" onClick={() => setModoEdicao(true)}>Editar tarefa</button>
                  <button type="button" onClick={marcarComoConcluida}>Marcar como concluída</button>
                  <button type="button" className="botao-perigo" onClick={excluirTarefaAtual}>
                    Excluir tarefa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
