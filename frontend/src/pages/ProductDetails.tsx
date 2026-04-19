import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/product.service';
import { orderService } from '../services/order.service';
import { Tag, ArrowLeft, ShoppingCart, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const res = await productService.getProductById(id);
        setProduct(res.data.product);
      } catch (err: any) {
        setError('Failed to load product details. It may have been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleRequestToBuy = async () => {
    if (!product) return;
    
    setOrderLoading(true);
    setError('');
    try {
      await orderService.createOrder(product.id);
      setOrderSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order request');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  if (error || !product) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', margin: '2rem auto', maxWidth: '800px' }}>
        <h2>{error || 'Product not found'}</h2>
        <Link to="/" style={{ color: 'var(--text-main)', marginTop: '1rem', display: 'inline-block', textDecoration: 'underline' }}>Return to Marketplace</Link>
      </div>
    );
  }

  const isSeller = user?.id === product.sellerId;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await productService.deleteProduct(product.id);
      navigate('/my-listings');
    } catch (err: any) {
      setError('Failed to delete listing.');
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = product.status === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE';
    try {
      const res = await productService.updateProduct(product.id, { status: newStatus });
      setProduct(res.data.product);
    } catch (err: any) {
      setError('Failed to update product status.');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <button 
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', transition: 'color 0.2s', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--text-main)'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={20} /> Back to Marketplace
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fade-in"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem', 
          background: 'var(--glass)', 
          border: '1px solid var(--border)', 
          borderRadius: '16px', 
          padding: '2rem' 
        }}
      >
        {/* Image Gallery */}
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <Tag size={120} opacity={0.5} />
          )}
        </div>

        {/* Product Details Flow */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--primary)', background: 'rgba(37, 99, 235, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 600, textTransform: 'uppercase' }}>
              {product.category}
            </span>
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>{product.title}</h1>
          <p style={{ color: 'var(--accent)', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>${product.price.toFixed(2)}</p>

          <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{product.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginBottom: 'auto', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} /> Listed {new Date(product.createdAt).toLocaleDateString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={16} /> Status: <span style={{ color: product.status === 'AVAILABLE' ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>{product.status}</span>
            </div>
          </div>

          {/* Buying Action Station */}
          <div style={{ marginTop: '2rem' }}>
            {orderSuccess ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '1.5rem', borderRadius: '12px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <CheckCircle size={32} />
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Request Sent Successfully!</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>The seller will review your request. Track it in your Orders tab.</p>
                </div>
              </motion.div>
            ) : isSeller ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>This is your listing.</p>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={handleToggleStatus}
                      style={{ flex: 1, background: product.status === 'AVAILABLE' ? '#f59e0b' : '#22c55e', color: 'white', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                    >
                      {product.status === 'AVAILABLE' ? 'Mark as Sold' : 'Mark as Available'}
                    </button>
                    <button 
                      onClick={handleDelete}
                      style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Delete Listing
                    </button>
                 </div>
               </div>
            ) : product.status !== 'AVAILABLE' ? (
                <button disabled style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 600, cursor: 'not-allowed' }}>
                  Item Not Available
                </button>
            ) : (
                <button 
                  onClick={handleRequestToBuy}
                  disabled={orderLoading}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    transition: 'background 0.2s',
                    opacity: orderLoading ? 0.7 : 1
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                  onMouseOut={e => e.currentTarget.style.background = 'var(--primary)'}
                >
                  <ShoppingCart size={20} />
                  {orderLoading ? 'Processing Request...' : 'Request to Buy'}
                </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetails;
