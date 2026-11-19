import React from 'react';
import { Plus, Star } from 'lucide-react';

/**
 * Card Individual de Produto
 * Renderiza foto, especificações, preço e botão de adicionar ao carrinho
 */
export default function ProductCard({ product, onAddToCart }) {
  // Formata o preço para o padrão brasileiro (R$ 0,00)
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <article className="product-card">
      <div className="product-image-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <span className="badge-platform">{product.platform}</span>
      </div>

      <div className="product-info">
        <div className="product-rating">
          <Star size={15} fill="#fbbf24" stroke="#fbbf24" />
          <span>{product.rating}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ 5.0</span>
        </div>

        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-specs">
          <div><strong>Marca:</strong> {product.brand}</div>
          <div><strong>Conexão:</strong> {product.connection}</div>
          <div><strong>Cor:</strong> {product.color}</div>
        </div>

        <div className="product-footer">
          <div className="product-price-box">
            <span className="price-label">Preço à vista</span>
            <span className="product-price">{formattedPrice}</span>
          </div>

          <button
            className="btn-add-cart"
            onClick={() => onAddToCart(product)}
            title="Adicionar controle ao carrinho"
          >
            <Plus size={16} />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </article>
  );
}
