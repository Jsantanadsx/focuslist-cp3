export function normalizarEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizarEmail(email));
}

export function validarCadastro(email, senha, confirmacao) {
  if (!emailValido(email)) return 'Digite um e-mail válido.';
  if (!senha || senha.length < 6) return 'A senha deve conter pelo menos 6 caracteres.';
  if (senha !== confirmacao) return 'As senhas não coincidem.';
  return null;
}

export function validarLogin(email, senha) {
  if (!emailValido(email)) return 'Digite um e-mail válido.';
  if (!senha) return 'Digite sua senha.';
  return null;
}

export function validarTarefa(titulo) {
  const texto = String(titulo ?? '').trim();
  if (!texto) return 'Descreva a tarefa antes de adicionar.';
  if (texto.length > 100) return 'A tarefa deve ter no máximo 100 caracteres.';
  return null;
}

export function filtrarTarefas(tarefas, filtro) {
  if (filtro === 'pendentes') return tarefas.filter((t) => !t.completed);
  if (filtro === 'concluidas') return tarefas.filter((t) => t.completed);
  return tarefas;
}
