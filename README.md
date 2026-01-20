# To-Do List Application

<!-- BADGES SECTION -->
[![Status do Projeto](https://img.shields.io/badge/Status-Finalizado-brightgreen)](https://github.com/heitorrsdev/To-Do-List)
[![Licença](https://img.shields.io/github/license/heitorrsdev/To-Do-List)](LICENSE)
[![Frontend Deploy](https://img.shields.io/badge/Acessar%20App-Vercel-blue)](https://to-do-list-heitorrsdev.vercel.app/)
[![Backend API](https://img.shields.io/badge/API-Express.js-red)](https://to-do-list-api-heitorrsdev.vercel.app/)

Este é um aplicativo de lista de tarefas completo, desenvolvido para ajudar usuários a organizar suas atividades diárias de forma eficiente. O projeto é composto por um **Frontend em Angular** e um **Backend em Express.js**, oferecendo uma solução robusta e escalável para gerenciamento de tarefas.

## 🚀 Funcionalidades Principais

*   **Autenticação de Usuário:** Registro e login seguros com **JWT** para gerenciar tarefas pessoais.
*   **Gerenciamento de Tarefas (CRUD):** Adicione, edite, marque como concluída e exclua tarefas.
*   **Interface Intuitiva:** Design limpo e responsivo, desenvolvido com **Angular**.
*   **Persistência de Dados:** Suas tarefas são salvas e acessíveis a qualquer momento no **MongoDB**.

## 💻 Tecnologias Utilizadas

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | Angular | Framework para construção da interface do usuário. |
| | TypeScript | Linguagem de programação principal. |
| **Backend** | Express.js | Framework web para Node.js, utilizado para construir a API RESTful. |
| | Node.js | Ambiente de execução JavaScript para o backend. |
| **Banco de Dados** | MongoDB | Banco de dados NoSQL para armazenamento de dados. |
| | Mongoose | ODM (Object Data Modeling) para interação com o MongoDB. |
| **Segurança** | JWT (JSON Web Tokens) | Para autenticação e autorização seguras. |
| | Bcrypt | Para hash de senhas. |

## 🌐 Acesso ao Projeto

O projeto está em produção e pode ser acessado diretamente:

*   **Aplicação Web (Frontend):** [https://to-do-list-heitorrsdev.vercel.app/](https://to-do-list-heitorrsdev.vercel.app/)
*   **API (Backend):** [https://to-do-list-api-heitorrsdev.vercel.app/](https://to-do-list-api-heitorrsdev.vercel.app/) (A API está funcional, mas não possui uma interface de usuário direta, apenas endpoints).

## 🛠️ Instalação e Configuração Local

Para configurar o projeto localmente, siga os passos abaixo:

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 20 ou superior)
*   [pnpm](https://pnpm.io/) (gerenciador de pacotes recomendado)
*   MongoDB (local ou [MongoDB Atlas](https://www.mongodb.com/atlas/database))

### 1. Backend (API)

1.  Clone o repositório:
    ```shell
    git clone https://github.com/heitorrsdev/To-Do-List.git
    cd To-Do-List/backend
    ```
2.  Instale as dependências:
    ```shell
    pnpm install
    ```
3.  Crie um arquivo `.env` na raiz do diretório `backend` com as seguintes variáveis de ambiente:
    ```env
    MONGO_URI=sua_string_de_conexao_mongodb
    JWT_SECRET=sua_chave_secreta_jwt_forte
    ```
4.  Inicie o servidor:
    ```shell
    pnpm start
    ```
    O servidor estará rodando em `http://localhost:3000`.

### 2. Frontend (Aplicação Angular)

1.  Navegue até o diretório do frontend:
    ```shell
    cd ../frontend
    ```
2.  Instale as dependências:
    ```shell
    pnpm install
    ```
3.  Inicie a aplicação Angular:
    ```shell
    pnpm start
    ```
    A aplicação estará disponível em `http://localhost:4200`.

## 📸 Screenshots

![Página de Login](/images/login_page.png)
![Página de Registro](/images/register_page.png)
![Página da Lista de Tarefas](/images/task_list_page.png)
![Dialog de Tarefas](/images/task_dialog.png)

## 🤝 Como Contribuir

Contribuições são bem-vindas! Se você deseja contribuir para este projeto, por favor, siga estas etapas:

1.  Faça um fork do repositório.
2.  Crie uma nova branch (`git checkout -b feature/sua-feature`).
3.  Faça suas alterações e commit-as (`git commit -m 'feat: adicione sua feature'`).
4.  Envie para a branch original (`git push origin feature/sua-feature`).
5.  Abra um Pull Request.

## ✉️ Contato

Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato com o desenvolvedor via e-mail:

*   **heitorrs.dev@gmail.com**

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE). Veja o arquivo `LICENSE` para mais detalhes.
