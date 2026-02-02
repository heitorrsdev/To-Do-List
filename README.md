# To-Do List Application

<!-- BADGES SECTION -->
[![Project Status](https://img.shields.io/badge/Status-Finished-brightgreen)](https://github.com/heitorrsdev/To-Do-List)
[![License](https://img.shields.io/github/license/heitorrsdev/To-Do-List)](LICENSE)
[![Frontend Deploy](https://img.shields.io/badge/Access%20App-Vercel-blue)](https://to-do-list-heitorrsdev.vercel.app/)
[![Backend API](https://img.shields.io/badge/API-Express.js-red)](https://to-do-list-express-api.onrender.com/api)

This is a complete to-do list application developed to help users organize their daily activities efficiently. The project consists of an **Angular Frontend** and an **Express.js Backend**, offering a robust and scalable solution for task management.

## 🚀 Key Features

*   **User Authentication:** Secure registration and login with **JWT** to manage personal tasks.
*   **Task Management (CRUD):** Add, edit, mark as completed, and delete tasks.
*   **Intuitive Interface:** Clean and responsive design, developed with **Angular**.
*   **Data Persistence:** Your tasks are saved and accessible at any time in **MongoDB**.

## 💻 Technologies Used

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Angular | Framework for building the user interface. |
| | TypeScript | Primary programming language. |
| **Backend** | Express.js | Web framework for Node.js, used to build the RESTful API. |
| | Node.js | JavaScript runtime environment for the backend. |
| **Database** | MongoDB | NoSQL database for data storage. |
| | Mongoose | ODM (Object Data Modeling) for interacting with MongoDB. |
| **Security** | JWT (JSON Web Tokens) | For secure authentication and authorization. |
| | Bcrypt | For password hashing. |

## 🌐 Project Access

The project is in production and can be accessed directly:

*   **Web Application (Frontend):** [https://to-do-list-heitorrsdev.vercel.app/](https://to-do-list-heitorrsdev.vercel.app/)
*   **API (Backend):** [https://to-do-list-express-api.onrender.com/api](https://to-do-list-express-api.onrender.com/api) (The API is functional but does not have a direct user interface, only endpoints).

## 🛠️ Local Installation and Configuration

To configure the project locally, follow the steps below:

### Prerequisites

*   [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
*   [pnpm](https://pnpm.io/) (recommended package manager)
*   MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas/database))

### 1. Environment Configuration

Before starting the services, ensure you are using the correct Node.js version defined in the `.nvmrc` file:

```shell
nvm install && nvm use
```

### 2. Backend (API)

1.  Navigate to the backend directory:
    ```shell
    cd backend
    ```
2.  Install dependencies:
    ```shell
    pnpm install
    ```
3.  Create a `.env` file in the root of the `backend` directory with the following environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_strong_jwt_secret_key
    ```
4.  Start the server:
    ```shell
    pnpm start
    ```
    The server will be running at `http://localhost:3000`.

### 3. Frontend (Angular Application)

1.  Navigate to the frontend directory:
    ```shell
    cd ../frontend
    ```
2.  Install dependencies:
    ```shell
    pnpm install
    ```
3.  Start the Angular application:
    ```shell
    pnpm start
    ```
    The application will be available at `http://localhost:4200`.

## 📸 Screenshots

![Login Page](/images/login_page.png)
![Registration Page](/images/register_page.png)
![Task List Page](/images/task_list_page.png)
![Task Dialog](/images/task_dialog.png)

## 🤝 How to Contribute

Contributions are welcome! If you wish to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes and commit them (`git commit -m 'feat: add your feature'`).
4.  Push to the original branch (`git push origin feature/your-feature`).
5.  Open a Pull Request.

## ✉️ Contact

If you have any questions or suggestions, feel free to contact the developer via email:

*   **heitorrs.dev@gmail.com**

## 📄 License

This project is licensed under the [MIT License](LICENSE). See the `LICENSE` file for more details.
