# To-Do List Application

Este é um aplicativo de lista de tarefas completo, desenvolvido para ajudar usuários a organizar suas atividades diárias de forma eficiente. O projeto é composto por um frontend em Angular e um backend em Express, oferecendo uma solução robusta e escalável para gerenciamento de tarefas.




## Funcionalidades

- **Autenticação de Usuário:** Registro e login seguros para gerenciar tarefas pessoais.
- **Gerenciamento de Tarefas:** Adicione, edite, marque como concluída e exclua tarefas.
- **Interface Intuitiva:** Design limpo e responsivo para uma experiência de usuário agradável.
- **Persistência de Dados:** Suas tarefas são salvas e acessíveis a qualquer momento.




## Tecnologias Utilizadas

### Frontend
- **Angular**: Framework para construção da interface do usuário.
- **TypeScript**: Linguagem de programação para o desenvolvimento do frontend.

### Backend
- **Express.js**: Framework web para Node.js, utilizado para construir a API RESTful.
- **Node.js**: Ambiente de execução JavaScript para o backend.
- **MongoDB (Mongoose)**: Banco de dados NoSQL para armazenamento de dados, com Mongoose como ODM.
- **JWT (JSON Web Tokens)**: Para autenticação e autorização seguras.
- **Bcrypt**: Para hash de senhas.




## Instalação

Para configurar o projeto localmente, siga os passos abaixo:

### Pré-requisitos
- Node.js (versão 20 ou superior)
- npm (gerenciador de pacotes do Node.js)
- MongoDB (local ou Atlas)

### Backend
1. Clone o repositório:
   ```bash
   git clone https://github.com/heitorrsdev/To-Do-List.git
   cd To-Do-List/backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do diretório `backend` com as seguintes variáveis de ambiente:
   ```
   MONGO_URI=sua_string_de_conexao_mongodb
   JWT_SECRET=sua_chave_secreta_jwt
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```
   O servidor estará rodando em `http://localhost:3000`.

### Frontend
1. Navegue até o diretório do frontend:
   ```bash
   cd ../frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação Angular:
   ```bash
   ng serve
   ```
   A aplicação estará disponível em `http://localhost:4200`.




## Deploy

O projeto está atualmente em produção e pode ser acessado através do seguinte link:

[https://heitorrsdev-to-do-list.vercel.app/](https://heitorrsdev-to-do-list.vercel.app/)




## Screenshots

![Página de Login](/images/login_page.png)
![Página de Registro](/images/register_page.png)
![Página da Lista de Tarefas](/images/task_list_page.png)




## Como Contribuir

Contribuições são bem-vindas! Se você deseja contribuir para este projeto, por favor, siga estas etapas:

1. Faça um fork do repositório.
2. Crie uma nova branch (`git checkout -b feature/sua-feature`).
3. Faça suas alterações e commit-as (`git commit -m 'feat: adicione sua feature'`).
4. Envie para a branch original (`git push origin feature/sua-feature`).
5. Abra um Pull Request.




## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.




## Contato

Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato com o desenvolvedor:

- **Heitor Rosa**
- GitHub: [heitorrsdev](https://github.com/heitorrsdev)
