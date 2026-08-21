# Equipment Inventory System 🖥️📊

A full-stack web application designed for tracking and managing organizational technological equipment, categories, and audit movements (check-outs/returns). Built with a modern architecture running on Docker.

## 🚀 Tech Stack

* **Frontend:** React, TypeScript, Tailwind CSS, Vite.
* **Backend:** NestJS, TypeScript, TypeORM, Class-Validator.
* **Database:** PostgreSQL.
* **DevOps:** Docker, Docker Compose.

---

## ⚙️ Prerequisites

Make sure you have the following installed on your machine:
* [Docker](https://www.docker.com/) & Docker Compose.
* Git.

---

## 📥 Installation & Running with Docker

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Leo2005/equipment-inventory.git](https://github.com/Leo2005/equipment-inventory.git)
   cd equipment-inventory

2. **Run the application using Docker Compose:**
   ```bash
   docker compose up --build
   ```

3. Access the application:

    * Frontend Client: http://localhost:5173
    * Backend API: http://localhost:3000
    * Swagger (Documentation): http://localhost:3000/api/docs#/
    * PostgreSQL Database: localhost:5433

4. **Project Structure**
```plaintext
equipment-inventory/
├── backend/            # NestJS API (Entities, Controllers, DTOs, Services)
├── frontend/           # React + Vite Client (Components, Services, Types)
└── docker-compose.yml  # Multi-container orchestration 
```