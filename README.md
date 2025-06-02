# My Gastronomy 🍽️

**My Gastronomy** é uma aplicação backend desenvolvida em Node.js que gerencia pratos, pedidos e usuários. A aplicação utiliza MongoDB como banco de dados principal.

## 📁 Estrutura do Projeto


## 🚀 Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB com Mongoose
- JWT (Autenticação)
- dotenv


📌 Endpoints
📦 Orders
GET /orders — Lista todos os pedidos

GET /orders/:id — Lista os pedidos de um usuário específico (por ID)

POST /orders — Cria um novo pedido

PUT /orders/:id — Atualiza um pedido

DELETE /orders/:id — Remove um pedido

🍽️ Plates
GET /plates — Lista todos os pratos

GET /plates/availables — Lista apenas os pratos disponíveis

POST /plates — Cria um novo prato

PUT /plates/:id — Atualiza um prato

DELETE /plates/:id — Remove um prato

👤 Users
GET /users — Lista todos os usuários

PUT /users/:id — Atualiza um usuário

DELETE /users/:id — Remove um usuário
