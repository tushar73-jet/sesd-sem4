import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { orderService } from '../services/order.service';

const StatusTimeline = ({ status }: { status: string }) => {
  const steps = [
    { id: 'REQUESTED', label: 'Requested', icon: Clock },
    { id: 'APPROVED', label: 'Approved', icon: CheckCircle },
    { id: 'COMPLETED', label: 'Completed', icon: Package }
  ];

  if (status === 'CANCELLED') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', color: '#ef4444', gap: '0.5rem', fontWeight: 500 }}>
        <XCircle size={20} />
        Order Cancelled
      </div>
    );
  }

  const currentIdx = steps.findIndex(s => s.id === status) >= 0 ? steps.findIndex(s => s.id === status) : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '300px' }}>
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx <= currentIdx;
        return (
          <React.Fragment key={step.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
              <Icon size={24} />
              <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 600 : 400 }}>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: isActive && idx < currentIdx ? 'var(--primary)' : 'var(--border)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        setOrders(res.data.orders);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Package color="var(--primary)" size={32} />
        My Purchase Orders
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading orders...</div>
      ) : error ? (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px' }}>{error}</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>You haven't requested to buy any products yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order, idx) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '2rem'
              }}
            >
              <div style={{ flex: '1 1 300px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{order.product.title}</h3>
                <p style={{ color: 'accent', fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  ${order.product.price.toFixed(2)}
                </p>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Ordered on {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
                <StatusTimeline status={order.status} />
              </div>
              
              <div>
                <button
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--primary)',
                    color: 'var(--primary)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff' }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)' }}
                >
                  View Detail <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
