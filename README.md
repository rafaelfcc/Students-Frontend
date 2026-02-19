# Students Frontend

Frontend da aplicação **Students**, desenvolvido em React, responsável pela autenticação e gerenciamento de alunos através do consumo da API backend.

A interface utiliza **Bootstrap** para estilização e componentes visuais, garantindo layout responsivo e experiência consistente.

---

##Tecnologias Utilizadas

- React
- React Router
- Bootstrap
- Fetch / Axios (consumo da API)
- JWT (armazenamento e envio do token para autenticação)

---

##Autenticação

A aplicação inicia com uma **tela de login**.

Após informar as credenciais válidas:

- O usuário é autenticado via JWT.
- O token é armazenado na aplicação.
- O usuário é redirecionado para a tela principal de gerenciamento de alunos.
- Rotas protegidas impedem acesso direto sem autenticação.

---

##Gerenciamento de Alunos

Após o login, o usuário tem acesso à tela principal da aplicação.

Nesta tela existem as seguintes funcionalidades:

###Inserir Novo Aluno

Botão responsável por abrir um **modal** contendo formulário para cadastro de um novo aluno.

O envio do formulário realiza requisição para a API backend e, em caso de sucesso, a lista é atualizada dinamicamente.

---

###Importar Alunos via CSV

Botão que permite realizar a importação de alunos por meio de um arquivo CSV, conforme especificação descrita na atividade técnica.

O arquivo é enviado para o backend, onde é processado e persistido.

---

##Listagem de Alunos

Após existir um ou mais alunos cadastrados, os registros são exibidos em formato de lista.

Cada item da lista apresenta os seguintes botões de ação:

- **Visualizar**
- **Editar**
- **Excluir**

Todas as ações são realizadas por meio de **modals (Bootstrap)**, mantendo o usuário na mesma tela e proporcionando uma experiência fluida.

---

##Comportamento da Interface

- Interface responsiva com Bootstrap
- Atualização dinâmica da lista após operações
- Tratamento de erros exibido conforme retorno da API
- Proteção de rotas via controle de autenticação
- Uso de modals para operações CRUD

---

##Configuração do Ambiente

### Instalar dependências

```bash
npm install
