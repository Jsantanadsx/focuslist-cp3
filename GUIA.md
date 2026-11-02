# Guia para iniciantes — Como compreender e apresentar o FocusList

Este guia foi criado para quem ainda não tem familiaridade com **Mobile Application Development**.

## 1. Entenda a ideia geral

Existem **três partes** nesse sistema:

1. **React Native:** desenha o aplicativo que aparece na tela do celular.
2. **Firebase Authentication:** verifica quem está entrando no aplicativo.
3. **Cloud Firestore:** salva as tarefas de cada pessoa em um banco de dados na nuvem.

**Exemplo simples:** João entra com seu e-mail e senha. O Firebase devolve um identificador exclusivo (`uid`). O aplicativo então busca as tarefas do caminho `users/UID_DO_JOAO/tasks`. Quando João adiciona uma tarefa, ela é salva nesse caminho. Outra pessoa terá um UID diferente, portanto suas tarefas ficarão em outro caminho.

## 2. O que cada arquivo principal faz?

**`App.js`:** é a porta de entrada. Confere se o usuário está autenticado. Se estiver, mostra `TasksScreen`; caso contrário, mostra `AuthScreen`.

**`src/screens/AuthScreen.js`:** é a tela de login/cadastro. Recebe os textos digitados e solicita ao Firebase para cadastrar, autenticar ou enviar recuperação de senha.

**`src/screens/TasksScreen.js`:** é a tela principal. Exibe as tarefas, organiza os filtros e recebe as ações dos botões.

**`src/services/tasks.js`:** centraliza as operações no banco de dados. A tela pede uma ação, e esse arquivo conversa com o Firestore.

**`src/config/firebase.js`:** faz a ligação entre o projeto React Native e o projeto Firebase criado no console.

**`firestore.rules`:** controla quais usuários podem ler e modificar quais documentos no Firestore.

## 3. Aprenda os comandos básicos

| Comando | Significado |
| --- | --- |
| `npm install` | Baixa as bibliotecas do aplicativo. |
| `npx expo start` | Inicia o servidor para abrir o aplicativo. |
| `npx expo start --clear` | Inicia limpando o cache. |
| `npm test` | Executa os testes de validação locais. |
| `git add .` | Prepara os arquivos para o commit. |
| `git commit -m "..."` | Cria um registro das alterações. |
| `git push` | Envia o projeto ao GitHub. |

## 4. O que significa cada função importante?

### `useState`

Permite guardar informações que mudam. Exemplo: o usuário digita o título da tarefa. A variável `titulo` recebe esse valor por meio de `setTitulo`.

### `useEffect`

Permite executar código quando um componente é exibido ou quando alguma dependência muda. No projeto, ele acompanha a autenticação e inicia/cancela a escuta do Firestore.

### `async` e `await`

O app não sabe imediatamente se o Firebase terminou de salvar uma tarefa. `await` faz a função aguardar a resposta daquela operação, sem bloquear toda a interface.

### `try` e `catch`

`try` contém a tentativa de salvar, excluir ou fazer login. `catch` é usado para exibir mensagens amigáveis quando o Firebase informa um erro.

### CRUD

- **C**reate: adicionar tarefa;
- **R**ead: listar tarefas;
- **U**pdate: marcar como concluída ou pendente;
- **D**elete: excluir tarefa.

## 5. Prepare seu teste demonstrativo

Use o seguinte roteiro em uma apresentação rápida:

1. Abra o aplicativo e mostre a tela de login.
2. Cadastre uma conta de teste.
3. Mostre a lista vazia.
4. Adicione duas tarefas: `Estudar React Native` e `Revisar Firebase`.
5. Marque uma das tarefas como concluída e abra o filtro `Concluídas`.
6. Mostre no painel do Firebase que o documento foi salvo.
7. Exclua uma tarefa.
8. Saia da conta, entre novamente e confira os dados persistidos.
9. Mostre o arquivo `firestore.rules` e explique a verificação por UID.

## 6. Explicação pronta para treinar

> O FocusList é um aplicativo de gerenciamento de tarefas desenvolvido em React Native com Expo. O cadastro, login e a recuperação de senha são gerenciados pelo Firebase Authentication. Depois de fazer login, cada usuário acessa seu conjunto de tarefas, armazenado no Cloud Firestore. Na interface, usei componentes do React Native, os hooks `useState` e `useEffect` e operações assíncronas para criar, consultar, atualizar e excluir tarefas. A segurança não depende apenas da interface: as regras do Firestore verificam o UID do usuário autenticado e impedem o acesso a tarefas de outras contas. Também implementei validações, mensagens de erro e sucesso, estados de carregamento e confirmação para exclusão.

## 7. Perguntas que o professor pode fazer

**Por que usar Firebase Authentication em vez de uma tabela com senhas?**  
Porque o Firebase Authentication fornece mecanismos prontos de autenticação e gerencia as credenciais, reduzindo a necessidade de implementar armazenamento de senhas por conta própria.

**Por que usar Firestore?**  
Porque ele é um banco NoSQL de documentos, com integração direta ao Firebase e suporte à atualização de dados em tempo real.

**O que é um UID?**  
É o identificador único atribuído a cada conta autenticada pelo Firebase.

**Como uma tarefa é salva?**  
O botão chama a função `adicionarTarefa`, que usa `addDoc` para criar um documento dentro de `users/{uid}/tasks`.

**Como a lista se atualiza automaticamente?**  
A função `onSnapshot` escuta alterações nos documentos do Firestore e entrega a lista atualizada ao componente.

**Como um usuário é impedido de ler tarefas de outro?**  
As regras de segurança comparam `request.auth.uid` com o `userId` no caminho dos documentos.

**Qual a função do useEffect ao ler tarefas?**  
Inscrever a tela nas atualizações do Firestore e cancelar a inscrição quando a tela deixa de ser utilizada, evitando observadores duplicados.

**Como o aplicativo trata falhas?**  
Usa validações locais e captura de erros com `try/catch`, apresentando avisos ao usuário e desabilitando ações enquanto aguardam processamento.

## 8. O que ainda precisa ser feito antes de entregar?

O projeto acompanha o código completo e testes locais de validação. Contudo, a **conexão real com o Firebase só pode ser executada depois de você configurar seu projeto Firebase**, instalar as dependências e rodar no Expo Go. Portanto, mostre o app ao professor apenas depois de conferir as operações no celular e no painel do Firestore.
