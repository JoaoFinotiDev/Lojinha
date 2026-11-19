# 🎮 Lojinha de Controles de Videogame

Um projeto didático de e-commerce completo e descomplicado, construído para demonstrar na prática os conceitos fundamentais do desenvolvimento web Full-Stack com **Node.js** no Back-end e **React** no Front-end.

---

## 🚀 Tecnologias Utilizadas

### 🖥️ Front-end (React)
- **React 18** com componentes funcionais e Hooks (`useState`, `useEffect`)
- **Vite** para inicialização rápida e Hot Module Replacement (HMR)
- **Lucide React** para ícones modernos e leves
- **CSS Modular e Moderno** (design responsivo, tema escuro, variáveis CSS e animações fluidas)

### ⚙️ Back-end (Node.js)
- **Node.js** com JavaScript moderno
- **Express** para criação da API RESTful
- **CORS** para comunicação segura com o front-end
- **Armazenamento em JSON** (`products.json`), simulando um banco de dados de maneira didática

---

## 📂 Estrutura do Projeto

```text
Lojinha/
├── backend/
│   ├── data/
│   │   └── products.json      # Base de dados em formato JSON (controles)
│   ├── server.js              # Servidor Express e definição das rotas REST
│   └── package.json           # Dependências do backend (express, cors)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Barra superior com logo, status e botão do carrinho
│   │   │   ├── ProductCard.jsx   # Card de exibição do controle e botão de compra
│   │   │   ├── CartDrawer.jsx    # Gaveta lateral do carrinho de compras
│   │   │   └── CheckoutModal.jsx # Modal para simulação de pagamento/pedido
│   │   ├── App.jsx               # Componente principal e controle de estado
│   │   ├── index.css             # Estilização completa da aplicação
│   │   └── main.jsx              # Ponto de entrada do React
│   ├── index.html                # HTML base da aplicação
│   ├── vite.config.js            # Configurações do Vite (inclui proxy para /api)
│   └── package.json              # Dependências do frontend (react, lucide-react, vite)
│
├── .gitignore
├── package.json                  # Scripts auxiliares para execução
└── README.md
```

---

## 🎯 Como Executar o Projeto

Abra dois terminais (um para o servidor back-end e outro para a interface front-end):

### 1. Iniciar o Back-end (API Node.js)
```bash
cd backend
npm install
npm start
```
> O servidor iniciará em **http://localhost:3001**

### 2. Iniciar o Front-end (React)
```bash
cd frontend
npm install
npm run dev
```
> A aplicação abrirá em **http://localhost:5173**

---

## 📡 Rotas da API (Endpoints)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/health` | Verifica se o servidor Node.js está online |
| `GET` | `/api/products` | Lista os controles (suporta filtros `?platform=Xbox` e `?search=termo`) |
| `GET` | `/api/products/:id` | Retorna os detalhes de um controle específico |
| `POST` | `/api/orders` | Simula a finalização de uma compra e gera recibo do pedido |

---

## 💡 Conceitos Didáticos Abordados

1. **Ciclo de Vida e Hooks no React:**
   - `useState` para gerenciar itens no carrinho, filtros de busca e modais.
   - `useEffect` para carregar produtos da API quando a página é aberta ou o filtro muda.
   - `localStorage` para persistência do carrinho no navegador do cliente.

2. **Arquitetura Cliente-Servidor (Client-Server):**
   - Comunicação assíncrona com `fetch` e Promises (`async/await`).
   - Uso de Proxy reverso no Vite (`vite.config.js`) para evitar problemas de CORS no ambiente de desenvolvimento.

3. **Criação de APIs REST com Express:**
   - Criação de rotas `GET` e `POST`.
   - Leitura de Parâmetros de Consulta (`req.query`), Parâmetros de Rota (`req.params`) e Corpo da Requisição (`req.body`).
   - Códigos de status HTTP apropriados (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Server Error`).
