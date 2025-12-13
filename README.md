# Employee Dashboard & Management System

This is a full-stack GraphQL application built for managing employee records, featuring dynamic querying, strong data filtering, and a modern, theme-aware user interface.

The assignment was completed successfully, delivering all required features and significant technical enhancements **within the extremely tight 24-hour deadline**, demonstrating a strong commitment to rapid and quality development.

---

## 🚀 Deployment & Access

| Resource                            | Link                                                                    | Notes                                          |
| :---------------------------------- | :---------------------------------------------------------------------- | :--------------------------------------------- |
| **Deployed Application (Frontend)** | https://employee-dashboard-assignment-vert.vercel.app/                  | Use this link to test the live application.    |
| **Backend API Endpoint**            | `http://localhost:5000/graphql`                                         | The GraphQL playground endpoint (Run locally). |
| **GitHub Repository**               | https://github.com/Priyanshushrivastava15/employee-dashboard-assignment | Source code for both frontend and backend.     |

### **Login Credentials (Admin Role)**

| Field        | Value   |
| :----------- | :------ |
| **Username** | `admin` |
| **Password** | `123`   |

---

## ✨ Core Features & Technical Achievements

This project utilized modern technologies to deliver a robust and scalable solution:

### **Backend (Node.js, Express, Apollo, MongoDB)**

- **GraphQL API:** Implemented a single API endpoint with efficient querying and data manipulation.
- **Dynamic Querying:** The `getEmployees` query handles all pagination, sorting (`name`, `age`, `attendance`), and complex filtering.
- **Intelligent Search:** Search bar logic simultaneously queries the `name`, `class`, and `subjects` fields.
- **Auto-Increment IDs:** New employees are automatically assigned a persistent, sequential `employeeId` starting at #1001 (e.g., #1001, #1002, etc.).
- **CORS & Security:** Properly configured CORS and JWT authentication middleware.

### **Frontend (React, Redux Toolkit Query - RTK Query)**

- **RTK Query:** Used to efficiently manage data fetching, caching, and state synchronization with the GraphQL backend.
- **Themed UI:** Full support for Light, Dark, and "Holo" themes using CSS variables, including color fixes for the Login form inputs.
- **Dynamic Filters:** The **Class** filter dropdown dynamically fetches the list of unique classes present in the database to prevent stale options.
- **Role Standardization:** The UI correctly displays the role as "Employee" instead of "Student".

---

## 🛠️ Local Setup Instructions

### **1. Clone the Repository**

```bash
git clone [https://github.com/Priyanshushrivastava15/employee-dashboard-assignment.git](https://github.com/Priyanshushrivastava15/employee-dashboard-assignment.git)
cd employee-dashboard-assignment

### **2. Setup Backend**
Navigate to the backend directory: cd backend

Install dependencies: npm install

Create a .env file and paste your MongoDB URI and JWT Secret (as per the provided email).

Start the server: npm start (Runs on http://localhost:5000)

### **3. Setup Frontend**
Open a new terminal and navigate to the frontend directory: cd ../frontend

Install dependencies: npm install

Start the application: npm run dev (Runs on http://localhost:5173)
```
