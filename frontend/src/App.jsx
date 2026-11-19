import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import { Search, Loader2, AlertCircle } from 'lucide-react';

const PLATFORMS = ['Todos', 'PlayStation 5', 'Xbox', 'Nintendo Switch', 'PC / Retrô'];

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Filtros
  const [selectedPlatform, setSelectedPlatform] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Carrinho de compras: array de { ...produto, quantity }
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('lojinha_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modais
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Salva o carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('lojinha_cart', JSON.stringify(cart));
  }, [cart]);

  // Função para buscar produtos na API Express (Node.js)
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedPlatform !== 'Todos') {
        // Envia termo simplificado para o backend
        const cleanPlatform = selectedPlatform.split(' ')[0];
        params.append('platform', cleanPlatform);
      }
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`/api/products${queryString}`);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data);
      setIsBackendOnline(true);
    } catch (err) {
      console.error('Erro ao conectar ao backend:', err);
      setError('Não foi possível carregar os produtos do servidor Node.js.');
      setIsBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  // Dispara a busca sempre que o filtro ou termo de busca mudar
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250); // Debounce suave para digitação rápida

    return () => clearTimeout(timer);
  }, [selectedPlatform, searchTerm]);

  // Ações do Carrinho
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Barra de Navegação */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isBackendOnline={isBackendOnline}
      />

      <main className="main-content">
        {/* Banner Hero */}
        <section className="hero">
          <div className="hero-tag">Projeto Didático Full-Stack</div>
          <h1 className="hero-title">
            Encontre o controle <span>perfeito</span> para o seu jogo
          </h1>
          <p className="hero-subtitle">
            Uma loja modelo desenvolvida com <strong>Node.js + Express</strong> na API e <strong>React</strong> no Front-end.
          </p>
        </section>

        {/* Barra de Busca e Filtros de Plataforma */}
        <section className="controls-bar">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome, marca ou recurso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="platform-filters">
            {PLATFORMS.map((platform) => (
              <button
                key={platform}
                className={`filter-btn ${
                  selectedPlatform === platform ? 'active' : ''
                }`}
                onClick={() => setSelectedPlatform(platform)}
              >
                {platform}
              </button>
            ))}
          </div>
        </section>

        {/* Exibição dos Produtos */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--accent-primary)' }} />
            <p>Carregando catálogo de controles da API Node.js...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#f87171' }}>
            <AlertCircle size={40} style={{ margin: '0 auto 1rem' }} />
            <h3>Falha de Comunicação com o Back-end</h3>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Certifique-se de que o servidor Node.js está rodando na porta 3001 (<code>npm start</code> dentro da pasta <code>backend</code>).
            </p>
            <button
              onClick={fetchProducts}
              className="filter-btn active"
              style={{ marginTop: '1.5rem', display: 'inline-block' }}
            >
              Tentar novamente
            </button>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
            <p>Nenhum controle encontrado para os critérios pesquisados.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Gaveta do Carrinho */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderCompleted={() => setCart([])}
      />

      {/* Rodapé Didático */}
      <footer className="footer">
        <p className="footer-text">
          🎮 <strong>Lojinha de Controles</strong> &bull; Criada para fins didáticos com Node.js (Express) &amp; React (Vite).
        </p>
      </footer>
    </div>
  );
}
