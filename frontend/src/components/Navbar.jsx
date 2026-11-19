import React from 'react';
import { Gamepad2, ShoppingCart } from 'lucide-react';

/**
 * Componente de Navegação Superior
 * Mostra o logotipo, indicador de status do backend e botão do carrinho
 */
export default function Navbar({ cartCount, onOpenCart, isBackendOnline }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#" className="brand">
          <Gamepad2 size={32} />
          <span>Lojinha do Finoti</span>
        </a>

        <div className="nav-actions">
          {isBackendOnline ? (
            <span className="badge-connected" title="Conectado ao Node.js (porta 3001)">
              <span className="badge-dot"></span>
              API Node.js Online
            </span>
          ) : (
            <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
              API Conectando...
            </span>
          )}

          <button className="cart-button" onClick={onOpenCart} aria-label="Abrir carrinho">
            <ShoppingCart size={18} />
            <span>Carrinho</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
