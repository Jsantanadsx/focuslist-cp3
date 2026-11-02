import test from 'node:test';
import assert from 'node:assert/strict';
import {
  emailValido, filtrarTarefas, normalizarEmail, validarCadastro, validarLogin, validarTarefa,
} from '../src/utils/validation.js';
import { mensagemDeErro } from '../src/utils/errors.js';

test('normaliza e-mail (espaços e letras maiúsculas)', () => {
  assert.equal(normalizarEmail('  ALUNO@EXEMPLO.COM  '), 'aluno@exemplo.com');
});

test('rejeita e-mail inválido', () => {
  assert.equal(emailValido('email-incorreto'), false);
  assert.equal(emailValido('aluno@exemplo.com'), true);
});

test('valida login incompleto', () => {
  assert.equal(validarLogin('aluno@exemplo.com', ''), 'Digite sua senha.');
  assert.equal(validarLogin('aluno@exemplo.com', 'abc123'), null);
});

test('valida cadastro com senhas inconsistentes', () => {
  assert.equal(validarCadastro('aluno@exemplo.com', 'abc123', 'abc456'), 'As senhas não coincidem.');
  assert.equal(validarCadastro('aluno@exemplo.com', 'abc123', 'abc123'), null);
});

test('rejeita título vazio ou grande demais', () => {
  assert.equal(validarTarefa('   '), 'Descreva a tarefa antes de adicionar.');
  assert.equal(validarTarefa('a'.repeat(101)), 'A tarefa deve ter no máximo 100 caracteres.');
  assert.equal(validarTarefa('Estudar'), null);
});

test('filtra tarefas pendentes, concluídas e todas', () => {
  const itens = [{ completed: false }, { completed: true }, { completed: false }];
  assert.equal(filtrarTarefas(itens, 'pendentes').length, 2);
  assert.equal(filtrarTarefas(itens, 'concluidas').length, 1);
  assert.equal(filtrarTarefas(itens, 'todas').length, 3);
});

test('converte erro do Firebase em mensagem compreensível', () => {
  assert.match(mensagemDeErro({ code: 'auth/email-already-in-use' }), /já está cadastrado/);
  assert.match(mensagemDeErro({ code: 'permission-denied' }), /regras de segurança/);
});
