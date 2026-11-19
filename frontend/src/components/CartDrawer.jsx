import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

/**
 * Gaveta lateral (Drawer) do Carrinho de Compras
 */
export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) {
  if (!isOpen) return null;

  // Calcula o valor total do carrinho
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalAmount);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={20} color="var(--accent-primary)" />
            <span>Meu Carrinho ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Fechar carrinho">
            <X size={20} />
          </button>
        </div>

        {/* Lista de Itens */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={56} className="cart-empty-icon" />
              <h3>Seu carrinho está vazio</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                Explore nossos controles e adicione seus favoritos para simular a compra!
              </p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.imageUrl} alt={item.name} className="cart-item-img" />

                  <div className="cart-item-info">
                    <span className="cart-item-title">{item.name}</span>
                    <span className="cart-item-price">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(item.price)}
                    </span>

                    <div className="cart-item-actions">
                      <div className="cart-item-qty">
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          title="Diminuir"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          title="Aumentar"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        className="btn-remove-item"
                        onClick={() => onRemoveItem(item.id)}
                        title="Remover produto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé com Total e Botão de Finalização */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-summary">
              <span className="summary-label">Total do Pedido:</span>
              <span className="summary-value">{formattedTotal}</span>
            </div>

            <button className="btn-checkout" onClick={onProceedToCheckout}>
              <span>Avançar para Pagamento</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
