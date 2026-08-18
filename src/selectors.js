export const obterColunasSprint = (sprint) => ({
  backlog: sprint.backlog || [],
  aFazer: sprint.aFazer || [],
  emAndamento: sprint.emAndamento || [],
  concluido: sprint.concluido || [],
});

export const obterMetricasSprint = (sprint) => {
  const tarefas = Object.values(obterColunasSprint(sprint)).flat();
  const totalPontos = tarefas.reduce((soma, tarefa) => soma + Number(tarefa.estimativa || 0), 0);
  const concluidas = sprint.concluido.length;
  const emAndamento = sprint.emAndamento.length;
  const urgentes = tarefas.filter((tarefa) => tarefa.prioridade === 'Crítica').length;

  return { totalPontos, concluidas, emAndamento, urgentes };
};
