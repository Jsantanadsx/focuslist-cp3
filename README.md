# FocusList — CheckPoint 3 | Mobile Application Development

**Disciplina:** Mobile Application Development  
**Instituição:** FIAP  
**Professor:** Pietro Rischi Nunes  
**Atividade:** CheckPoint 3

> Projeto acadêmico desenvolvido em **React Native (Expo)** com **Firebase Authentication** e **Cloud Firestore**. A configuração do Firebase deve ser realizada antes de executar o aplicativo com dados reais.

---

## 1. Proposta do aplicativo — o que é o FocusList?

O **FocusList** é um gerenciador pessoal de tarefas. Sua finalidade é auxiliar estudantes e profissionais a registrar atividades, identificar o que ainda está pendente e acompanhar as atividades concluídas.

O usuário cria uma conta com e-mail e senha, realiza o login e acessa uma lista de tarefas privada. É possível cadastrar uma tarefa, marcá-la como concluída ou pendente, filtrá-la pelo status e excluí-la. As tarefas são gravadas na nuvem, utilizando o Cloud Firestore, e recuperadas automaticamente quando o usuário volta a acessar a conta.

### Público-alvo

Estudantes, profissionais e qualquer pessoa que deseje organizar tarefas cotidianas.

### Funcionalidades previstas

1. **Criar conta:** cadastro usando e-mail e senha.
2. **Entrar:** autenticação com conta previamente cadastrada.
3. **Recuperar senha:** solicitação de e-mail para redefinir a senha.
4. **Manter sessão:** reconhecimento do usuário autenticado ao reabrir o aplicativo.
5. **Cadastrar tarefa:** incluir uma descrição de até 100 caracteres.
6. **Listar tarefas:** recuperar dados do Firestore e atualizá-los em tempo real.
7. **Concluir/reabrir tarefa:** alternar o status da atividade.
8. **Filtrar:** visualizar todas, pendentes ou concluídas.
9. **Excluir:** remover uma tarefa após confirmação.
10. **Sair:** encerrar a sessão de autenticação.
11. **Privacidade:** cada conta acessa somente as tarefas vinculadas ao seu UID.

### Fluxo principal

```text
Abrir aplicativo
       |
       v
Há sessão autenticada?
   |                  |
  NÃO                SIM
   |                  |
   v                  v
Tela de login      Minhas tarefas
   |                  |
   +-- Cadastrar      +-- Adicionar
   +-- Entrar         +-- Concluir/reabrir
   +-- Recuperar      +-- Filtrar
                       +-- Excluir
                       +-- Sair -> Login
```

---

## 2. Tecnologias utilizadas

| Tecnologia | Função |
| --- | --- |
| React Native | Criação da interface para dispositivos móveis. |
| Expo (SDK 58) | Inicialização e execução do aplicativo. |
| JavaScript | Linguagem usada nos componentes e regras da interface. |
| Firebase Authentication | Cadastro, login, recuperação de senha e sessão do usuário. |
| Cloud Firestore | Banco de dados NoSQL para salvar tarefas. |
| Firebase Security Rules | Restrição de acesso para que cada pessoa veja somente suas tarefas. |
| AsyncStorage | Persistência local da sessão gerenciada pelo Firebase Auth. |

**Observação:** o projeto utiliza o *Firebase JavaScript SDK*, compatível com a estratégia do Expo Go. Não é necessário configurar React Native Firebase nativo para este trabalho.

---

## 3. Como executar — passo a passo

### 3.1. Pré-requisitos

- Node.js **22.13 ou superior**;
- npm;
- Visual Studio Code (ou editor semelhante);
- celular iOS ou Android com **Expo Go** compatível com o SDK do projeto, ou simulador/emulador;
- conta Google para criar um projeto Firebase;
- conexão com a internet durante a primeira configuração.

**Importante:** use uma versão do Expo Go que suporte o **SDK 58**. Como o aplicativo Expo Go muda de versão com o tempo, consulte a documentação oficial caso apareça uma mensagem de incompatibilidade de SDK: https://docs.expo.dev/get-started/start-developing/

### 3.2. Abrir o projeto

Clone este repositório (ou extraia o projeto), abra a pasta `focuslist-cp3` no VS Code e execute no terminal:

```powershell
npm install
```

### 3.3. Criar o projeto no Firebase

1. Acesse https://console.firebase.google.com/.
2. Clique em **Adicionar projeto** e atribua o nome `focuslist-cp3` (ou outro nome disponível).
3. Conclua a criação do projeto.
4. Na página inicial, selecione **Adicionar aplicativo** e o ícone **Web (`</>`)**. Embora a interface seja mobile, o código usa o Firebase JavaScript SDK, por isso a configuração é a de um aplicativo Web.
5. Dê o nome `FocusList` ao aplicativo. Não é necessário habilitar Firebase Hosting.
6. Copie os valores da configuração `firebaseConfig` exibida na página. Você verá chaves como `apiKey`, `authDomain`, `projectId` e `appId`.

### 3.4. Habilitar login por e-mail e senha

No painel do Firebase:

1. Abra **Criação / Build > Authentication**.
2. Clique em **Começar / Get started**.
3. Em **Sign-in method / Método de login**, selecione **E-mail/senha**.
4. Ative o primeiro método **E-mail/senha** e salve.

Não é necessário ativar login anônimo nem login do Google.

### 3.5. Habilitar o Firestore

1. Abra **Criação / Build > Firestore Database**.
2. Clique em **Criar banco de dados**.
3. Selecione uma região disponível. A região não poderá ser alterada depois.
4. Caso seja solicitado um modo inicial, escolha **modo de produção**; configuraremos as permissões em seguida.
5. Vá até a guia **Regras / Rules**.
6. Abra o arquivo `firestore.rules` deste repositório, copie **todo o conteúdo** e cole no editor do Firebase.
7. Clique em **Publicar / Publish**.

**Nunca use** regras do tipo `allow read, write: if true;` para a entrega. Elas permitem acesso público a dados.

### 3.6. Configurar o arquivo .env

Na pasta raiz do projeto, crie uma cópia do arquivo `.env.example` com o nome **`.env`**.

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Edite `.env` com os valores exatos fornecidos pelo Firebase:

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=valor-apiKey
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=valor-authDomain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=valor-projectId
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=valor-storageBucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=valor-messagingSenderId
EXPO_PUBLIC_FIREBASE_APP_ID=valor-appId
```

- Não mantenha os valores de exemplo.
- Não inclua aspas ou vírgulas nos valores.
- O arquivo `.env` está no `.gitignore`, portanto não será enviado ao GitHub.
- Essas variáveis de configuração são **públicas no aplicativo mobile**; as **Security Rules** do Firestore são as responsáveis por controlar o acesso. Nunca coloque credenciais de administrador ou chaves privadas nesse arquivo.

### 3.7. Iniciar o aplicativo

```powershell
npx expo start --clear
```

Abra o Expo Go no celular e escaneie o QR Code, ou use o emulador. Se o celular não conseguir conectar ao computador pela rede Wi-Fi, experimente:

```powershell
npx expo start --tunnel
```

> A opção `--tunnel` pode exigir a instalação de um pacote adicional e internet. Prefira a mesma rede Wi-Fi sempre que possível. No iOS, dependendo da versão do Expo Go, pode ser necessário entrar na mesma conta Expo no aplicativo e no Expo CLI (`npx expo login`).

**Se aparecer "Configuração necessária":** o `.env` está ausente, incompleto ou ainda contém valores de exemplo. Reinicie o Expo após corrigi-lo.

---

## 4. Estrutura do código

```text
focuslist-cp3/
├── App.js                         # Entrada principal / monitora sessão
├── app.json                       # Configuração do Expo
├── .env.example                   # Modelo da configuração Firebase
├── firestore.rules                # Segurança do banco de dados
├── package.json                   # Dependências e comandos
├── README.md                      # Proposta e conceitos (itens 1 e 3)
├── GUIA.md        # Tutorial e explicações simples
├── CHECKLIST-ENTREGA.md           # Lista final para o Teams
├── tests/
│   └── validation.test.mjs        # Testes automáticos das validações
└── src/
    ├── components/
    │   ├── Notice.js              # Mensagens de erro/sucesso
    │   └── PrimaryButton.js       # Botão reutilizável
    ├── config/
    │   └── firebase.js            # Inicialização do Firebase
    ├── screens/
    │   ├── AuthScreen.js          # Login, cadastro e recuperação
    │   └── TasksScreen.js         # Cadastro, listagem, filtro e exclusão
    ├── services/
    │   └── tasks.js               # Operações de Firestore
    ├── styles/
    │   └── theme.js               # Cores da aplicação
    └── utils/
        ├── errors.js              # Tradução de erros
        └── validation.js          # Validações e filtros
```

---

## 5. Conceitos utilizados no projeto (item 3 do professor)

### 5.1. React Native e componentes

React Native permite construir interfaces com JavaScript e componentes próprios, como `View`, `Text`, `TextInput`, `Pressable` e `FlatList`.

- **`View`**: organiza blocos da interface.
- **`Text`**: exibe textos na tela.
- **`TextInput`**: recebe os dados digitados.
- **`Pressable`**: executa ações ao tocar nos elementos.
- **`FlatList`**: apresenta uma lista de tarefas com renderização eficiente.

O componente `PrimaryButton` é reutilizado em diferentes telas, evitando código repetido.

### 5.2. Estado com useState

O `useState` guarda dados que variam durante o uso da aplicação, por exemplo o título digitado e o estado de carregamento.

Exemplo real de `TasksScreen.js`:

```javascript
const [titulo, setTitulo] = useState('');
const [saving, setSaving] = useState(false);
```

Quando `setTitulo` altera o valor de `titulo`, o React atualiza a parte necessária da tela.

### 5.3. Efeitos com useEffect

O `useEffect` executa ações relacionadas ao ciclo de vida de um componente. Em `App.js`, ele registra o observador `onAuthStateChanged` do Firebase Authentication e atualiza a tela quando ocorre login ou logout.

Em `TasksScreen.js`, um `useEffect` inicia a observação em tempo real das tarefas e cancela a inscrição ao desmontar a tela, evitando assinaturas desnecessárias.

### 5.4. Firebase Authentication

O serviço de autenticação controla quem pode usar a lista de tarefas.

Principais funções:

- `createUserWithEmailAndPassword`: cria uma conta;
- `signInWithEmailAndPassword`: autentica e-mail e senha;
- `sendPasswordResetEmail`: envia uma solicitação para redefinir senha;
- `onAuthStateChanged`: observa o estado da sessão;
- `signOut`: encerra o login.

O aplicativo **não salva senhas no Firestore**. O Firebase Authentication realiza esse gerenciamento.

### 5.5. Cloud Firestore (banco de dados NoSQL)

O Firestore armazena informações em **coleções** e **documentos**, em vez de tabelas e linhas tradicionais.

Neste projeto, o caminho é:

```text
users/{uid}/tasks/{taskId}
```

Exemplo de documento de tarefa:

```javascript
{
  title: 'Estudar React Native',
  completed: false,
  createdAt: /* Timestamp gerado pelo Firestore */,
  updatedAt: /* Timestamp gerado pelo Firestore */
}
```

O `uid` corresponde ao identificador do usuário autenticado. Ele define qual conjunto de tarefas a aplicação deve carregar.

### 5.6. Operações CRUD

CRUD significa **Create, Read, Update e Delete** (criar, ler, atualizar e excluir):

| Operação | Função usada | Local |
| --- | --- | --- |
| Create | `addDoc` | `src/services/tasks.js` |
| Read | `onSnapshot` | `src/services/tasks.js` |
| Update | `updateDoc` | `src/services/tasks.js` |
| Delete | `deleteDoc` | `src/services/tasks.js` |

A função `onSnapshot` fornece atualizações em tempo real: quando um documento muda no Firestore, a lista é atualizada sem precisar apertar um botão de recarregar.

### 5.7. Programação assíncrona — async/await

O Firebase se comunica com serviços remotos. Por isso, operações de login, cadastro e gravação usam `async`/`await`.

Em cada ação, o aplicativo também usa `try/catch/finally`:

- `try`: tenta executar a operação;
- `catch`: captura erros e mostra uma mensagem compreensível;
- `finally`: encerra o estado de carregamento mesmo quando ocorre um erro.

### 5.8. Validação de entrada e experiência do usuário

O aplicativo verifica se:

- o e-mail tem um formato válido;
- a senha atende ao mínimo de seis caracteres;
- as senhas do cadastro coincidem;
- o título da tarefa não está vazio e tem até 100 caracteres.

Além disso, o sistema mostra mensagens de sucesso, estados de carregamento, lista vazia e confirmação antes de excluir tarefas.

### 5.9. Segurança das informações

A interface filtra tarefas conforme o usuário logado, porém isso, isoladamente, **não protege os dados**. A segurança efetiva é aplicada pelas regras do Firestore (`firestore.rules`).

As regras verificam `request.auth.uid` e comparam esse identificador com o `userId` presente no caminho do documento, permitindo que cada usuário tenha acesso apenas às próprias tarefas. Também limitam os campos que podem ser gravados.

### 5.10. Persistência da sessão

O Firebase Auth usa o AsyncStorage como mecanismo de persistência em React Native. Assim, depois de autenticar, a sessão pode ser restaurada ao abrir novamente o aplicativo, sem digitar a senha toda vez. O logout encerra essa sessão.

---

## 6. Cenários de sucesso e erro

| Cenário | Comportamento implementado/esperado |
| --- | --- |
| Cadastro com dados válidos | Conta criada e acesso à lista. |
| Cadastro com e-mail já existente | Informa que o e-mail já está cadastrado. |
| Senhas diferentes | Impede o cadastro e exibe erro. |
| Senha com menos de 6 caracteres | Impede o cadastro e exibe erro. |
| Login com dados válidos | Abre a lista do usuário. |
| Login com credenciais incorretas | Exibe mensagem de credenciais inválidas. |
| Recuperar senha com e-mail válido | Solicita envio de e-mail de recuperação. |
| Criar tarefa com texto válido | Grava no Firestore e exibe na lista. |
| Criar tarefa vazia | Não grava e exibe aviso. |
| Criar tarefa com mais de 100 caracteres | Não grava e exibe aviso. |
| Marcar como concluída | Atualiza o documento no Firestore. |
| Reabrir tarefa | Atualiza o documento no Firestore. |
| Filtrar tarefas | Apresenta somente as tarefas do filtro. |
| Excluir e cancelar | Mantém a tarefa. |
| Excluir e confirmar | Remove a tarefa do Firestore. |
| Lista vazia | Mostra orientação para cadastrar uma tarefa. |
| Falha de rede / indisponibilidade | Exibe erro quando a operação reporta falha. |
| Acesso sem autorização | Firestore nega pela regra de segurança. |
| Sair da conta | Retorna ao login. |

**Validação no dispositivo:** o aplicativo foi executado em um iPhone com Expo Go e Expo SDK 58. Após configurar o Firebase, foram testados o cadastro/autenticação e o fluxo de tarefas no Firestore (criar, consultar, concluir/reabrir, filtrar e excluir), conforme os testes manuais realizados no projeto. Os demais cenários da tabela documentam o tratamento implementado e devem ser retestados pelo avaliador, se necessário.

---

## 7. Como testar

### Testes automatizados (validação local)

```powershell
npm test
```

Os testes automatizados verificam validações de e-mail, cadastro, login, título de tarefa, filtros e tradução de erros. Esses testes são locais e não exigem conta Firebase. Eles não substituem os testes de integração com Firestore e Authentication.

### Testes manuais (exigem Firebase configurado)

1. Abra o aplicativo sem estar autenticado e confira a tela de login.
2. Tente cadastrar com e-mail inválido.
3. Tente cadastrar usando senhas diferentes.
4. Cadastre com e-mail válido e senha com seis caracteres ou mais.
5. Crie a tarefa `Estudar React Native` e confira sua criação no Firestore.
6. Marque a tarefa como concluída; selecione os filtros.
7. Reabra a tarefa para colocá-la como pendente.
8. Abra a exclusão, clique em **Cancelar** e confira que a tarefa continua lá.
9. Abra a exclusão novamente e confirme.
10. Saia do aplicativo, abra-o e observe a persistência de sessão.
11. Clique em **Sair**, depois tente entrar com senha incorreta.
12. Teste **Esqueci minha senha** com um e-mail cadastrado.
13. Crie uma segunda conta e confirme que ela não visualiza tarefas da primeira.
14. Se uma operação falhar, verifique a mensagem de erro.

O fluxo principal foi testado manualmente em dispositivo iOS com o Firebase real. Como evidências adicionais de entrega, podem ser incluídas capturas da tela de login, lista com tarefas, filtros, confirmação de exclusão e documentos no Firestore, evitando divulgar e-mails pessoais e outras informações sensíveis.

---

## 8. Como publicar no GitHub e entregar

Crie um **repositório novo e vazio** chamado, por exemplo, `focuslist-cp3`. Em seguida, na pasta do projeto:

```powershell
git init
git add .
git status
git commit -m "Entrega CP3 Mobile: FocusList React Native com Firebase"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/focuslist-cp3.git
git push -u origin main
```

Substitua `SEU-USUARIO` pelo seu usuário do GitHub. Em seguida, **envie no Teams o link do repositório**, de acordo com o enunciado.

Antes do commit, confirme em `git status` que `.env` e `node_modules/` **não** estão sendo enviados. O arquivo `.env` não deve ser publicado. Para executar o aplicativo, o avaliador deverá conectar um projeto Firebase próprio (ou receber acesso autorizado a um projeto de teste) e copiar `.env.example` para `.env`.

Também confirme que o `package.json` e o arquivo de lock (`package-lock.json`, caso exista) correspondem ao **Expo SDK 58**, atualizado e testado no iPhone. Remova qualquer `console.log` temporário de diagnóstico antes de entregar.

---

## 9. Fontes de referência

- Expo — Firebase com Expo: https://docs.expo.dev/guides/using-firebase/
- Expo — Referência SDK 58: https://docs.expo.dev/versions/v58.0.0/
- Firebase — Authentication: https://firebase.google.com/docs/auth
- Firebase — Cloud Firestore: https://firebase.google.com/docs/firestore
- Firebase — Regras de segurança: https://firebase.google.com/docs/firestore/security/get-started
- Expo — Inicialização de persistência do Firebase Auth: https://github.com/expo/fyi/blob/main/firebase-js-auth-setup.md

O projeto foi desenvolvido para fins didáticos e acadêmicos. O README documenta a proposta e os conceitos utilizados, conforme os itens 1 e 3 do enunciado. A aplicação prática está nos componentes e serviços do repositório (item 2).
