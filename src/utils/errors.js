const mensagens = {
  'auth/email-already-in-use': 'Esse e-mail já está cadastrado. Entre com sua conta.',
  'auth/invalid-email': 'O e-mail informado não é válido.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/weak-password': 'Escolha uma senha com pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco antes de tentar novamente.',
  'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
  'auth/operation-not-allowed': 'Ative o método E-mail/Senha no Firebase Authentication.',
  'permission-denied': 'Sem permissão no Firestore. Confira as regras de segurança.',
  'firestore/permission-denied': 'Sem permissão no Firestore. Confira as regras de segurança.',
  unavailable: 'O serviço está indisponível. Verifique a conexão e tente de novo.',
  'firestore/unavailable': 'O serviço está indisponível. Verifique a conexão e tente de novo.',
};

export function mensagemDeErro(error) {
  const code = String(error?.code ?? '');

  console.error('Erro Firebase:', code, error?.message);

  return mensagens[code] ??
    `Erro na operação. Código: ${code || 'desconhecido'}`;
}
