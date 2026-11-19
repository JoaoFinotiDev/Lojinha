/**
 * BACK-END: Lojinha de Controles de Videogame (Didático)
 * 
 * Tecnologias:
 * - Node.js: Ambiente de execução JavaScript no servidor
 * - Express: Framework minimalista e rápido para criar APIs REST
 * - CORS: Middleware para permitir que o front-end (React) faça requisições
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARES ---
// Permite que navegadores em outras origens (como o React em localhost:5173) acessem esta API
app.use(cors());

// Permite que o Express entenda requisições com corpo (body) no formato JSON
app.use(express.json());

// Caminho do nosso arquivo de produtos (simulando um banco de dados simples)
const productsFilePath = path.join(__dirname, 'data', 'products.json');

// Função auxiliar para ler os produtos do arquivo JSON
function getProducts() {
  const data = fs.readFileSync(productsFilePath, 'utf-8');
  return JSON.parse(data);
}

// --- ROTAS (ENDPOINTS) ---

/**
 * 1. Rota de Saúde / Boas-vindas
 * Útil para checar se o servidor está no ar
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'API da Lojinha de Controles está funcionando perfeitamente!',
    timestamp: new Date().toISOString()
  });
});

/**
 * 2. Listar Produtos com Filtros Opcionais
 * GET /api/products?platform=PlayStation&search=dualsense
 */
app.get('/api/products', (req, res) => {
  try {
    let products = getProducts();
    const { platform, search } = req.query;

    // Filtro por plataforma se informado
    if (platform && platform !== 'Todos') {
      products = products.filter(p => 
        p.platform.toLowerCase().includes(platform.toLowerCase())
      );
    }

    // Filtro por busca de texto (nome, marca ou descrição)
    if (search) {
      const term = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno ao consultar catálogo de produtos' });
  }
});

/**
 * 3. Buscar Detalhes de um Produto por ID
 * GET /api/products/:id
 */
app.get('/api/products/:id', (req, res) => {
  try {
    const products = getProducts();
    const productId = parseInt(req.params.id, 10);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Controle não encontrado no catálogo' });
    }

    res.json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro ao carregar detalhes do controle' });
  }
});

/**
 * 4. Simulação de Criação de Pedido (Checkout)
 * POST /api/orders
 * Recebe: { items: [{ productId, quantity }], customer: { name, email, paymentMethod } }
 */
app.post('/api/orders', (req, res) => {
  try {
    const { items, customer } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'O pedido precisa conter ao menos um item no carrinho.' });
    }

    if (!customer || !customer.name || !customer.email) {
      return res.status(400).json({ error: 'Dados do cliente incompletos (nome e e-mail são obrigatórios).' });
    }

    const allProducts = getProducts();
    let totalAmount = 0;
    const orderItems = [];

    // Validar e calcular o total com os preços reais do backend (boa prática de segurança!)
    for (const item of items) {
      const product = allProducts.find(p => p.id === item.productId);
      if (!product) {
        return res.status(404).json({ error: `Produto com ID ${item.productId} não encontrado.` });
      }

      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const subtotal = product.price * quantity;
      totalAmount += subtotal;

      orderItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        subtotal: subtotal
      });
    }

    // Gerar um número de pedido didático
    const order = {
      orderId: `PED-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      customer: {
        name: customer.name,
        email: customer.email,
        paymentMethod: customer.paymentMethod || 'Pix'
      },
      items: orderItems,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: 'Aprovado (Simulação Didática)'
    };

    console.log(`[PEDIDO CRIADO] ${order.orderId} - Total: R$ ${order.totalAmount} por ${customer.name}`);

    res.status(201).json({
      success: true,
      message: 'Pedido realizado com sucesso!',
      order: order
    });
  } catch (error) {
    console.error('Erro ao processar pedido:', error);
    res.status(500).json({ error: 'Falha ao processar checkout' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🎮 Servidor da Lojinha rodando na porta ${PORT}`);
  console.log(`➡️  API de Produtos: http://localhost:${PORT}/api/products`);
  console.log(`➡️  Status: http://localhost:${PORT}/api/health`);
});
