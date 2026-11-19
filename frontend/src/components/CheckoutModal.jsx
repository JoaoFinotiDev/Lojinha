import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

/**
 * Modal de Finalização de Compra (Checkout Didático)
 * Envia os dados do pedido via POST para o backend em Node.js
 */
export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderCompleted,
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalAmount);

  // Submissão do pedido para a API Express
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          name: customerName,
          email: customerEmail,
          paymentMethod: paymentMethod,
        },
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      // Chamada HTTP POST para a rota /api/orders do backend Node.js
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pedido');
      }

      setCompletedOrder(data.order);
      onOrderCompleted(); // Limpa o carrinho no estado principal
    } catch (err) {
      console.error('Falha no checkout:', err);
      setErrorMsg(
        err.message || 'Não foi possível conectar ao servidor Node.js. Verifique se o backend está rodando.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndClose = () => {
    setCompletedOrder(null);
    setCustomerName('');
    setCustomerEmail('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleFinishAndClose}>
      <div className="checkout-card" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className="checkout-header">
          <h3 className="checkout-title">
            {completedOrder ? '🎉 Pedido Confirmado!' : 'Finalizar Pedido Didático'}
          </h3>
          <button className="btn-close" onClick={handleFinishAndClose}>
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo: Sucesso ou Formulário */}
        {completedOrder ? (
          <div className="order-success-box">
            <div className="success-icon-wrapper">
              <CheckCircle size={40} />
            </div>
            <h2>Obrigado pela sua compra!</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
              Este pedido foi gravado e processado com sucesso pelo nosso back-end em Node.js.
            </p>

            <div className="receipt-details">
              <div className="receipt-row">
                <span style={{ color: 'var(--text-muted)' }}>Código do Pedido:</span>
                <strong>{completedOrder.orderId}</strong>
              </div>
              <div className="receipt-row">
                <span style={{ color: 'var(--text-muted)' }}>Cliente:</span>
                <span>{completedOrder.customer.name}</span>
              </div>
              <div className="receipt-row">
                <span style={{ color: 'var(--text-muted)' }}>Forma de Pagamento:</span>
                <span>{completedOrder.customer.paymentMethod}</span>
              </div>
              <div className="receipt-row">
                <span style={{ color: 'var(--text-muted)' }}>Total Pago:</span>
                <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(completedOrder.totalAmount)}
                </strong>
              </div>
              <div className="receipt-row">
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                  {completedOrder.status}
                </span>
              </div>
            </div>

            <button className="btn-checkout" onClick={handleFinishAndClose}>
              Continuar Comprando
            </button>
          </div>
        ) : (
          <form className="checkout-form" onSubmit={handleSubmit}>
            {errorMsg && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                }}
              >
                {errorMsg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Seu Nome Completo *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: João Finoti"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Seu E-mail *</label>
              <input
                type="email"
                className="form-input"
                placeholder="Ex: joao@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Forma de Pagamento</label>
              <div className="payment-options">
                {['Pix', 'Cartão de Crédito', 'Boleto'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`payment-pill ${
                      paymentMethod === method ? 'selected' : ''
                    }`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="checkout-summary-box">
              <div className="checkout-summary-row">
                <span>Total de itens:</span>
                <span>{cartItems.reduce((acc, i) => acc + i.quantity, 0)} unidades</span>
              </div>
              <div className="checkout-summary-row total">
                <span>Total a pagar:</span>
                <span>{formattedTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-checkout"
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processando Pedido no Node.js...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Confirmar e Finalizar Compra</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
