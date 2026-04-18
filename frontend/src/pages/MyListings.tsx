import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/product.service';
import { orderService } from '../services/order.service';
import { motion } from 'framer-motion';
import { Store, Plus, CheckCircle, XCircle, ShoppingBag, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  status: string;
  createdAt: string;
  sellerId: string;
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  product: Product;
  buyer: {
    id: string;
    name: string;
    email: string;
  };
}

const MyListings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'requests'>('listings');
  
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  
  const [requests, setRequests] = useState<Order[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', category: 'Electronics' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMyProducts = useCallback(async () => {
    if (!user?.id) return;
    setProductsLoading(true);
    try {
      const res = await productService.getProducts({ sellerId: user.id, limit: 100 });
      setMyProducts(res.data.products);
    } catch (err) {
      console.error('Failed to load listings', err);
    } finally {
      setProductsLoading(false);
    }
  }, [user]);

  const fetchMyRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const res = await orderService.getMySales();
      setRequests(res.data.orders);
    } catch (err) {
      console.error('Failed to load sales requests', err);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      if (activeTab === 'listings') fetchMyProducts();
      else fetchMyRequests();
    }
  }, [user, activeTab, fetchMyProducts, fetchMyRequests]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    try {
      await productService.createProduct({
        ...formData,
        price: parseFloat(formData.price)
      });
      setShowModal(false);
      setFormData({ title: '', description: '', price: '', category: 'Electronics' });
      fetchMyProducts();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
         const errorResp = err as { response?: { data?: { message?: string } } };
         setError(errorResp.response?.data?.message || 'Failed to create listing');
      } else {
         setError('Failed to create listing');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAction = async (orderId: string, action: 'APPROVED' | 'CANCELLED') => {
    try {
      await orderService.updateOrderStatus(orderId, action);
      fetchMyRequests();
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Action failed. The item may no longer be available.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem' }}>
          <Store color="var(--primary)" size={32} />
          My Storefront
        </h1>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
        >
          <Plus size={20} /> Add New Listing
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('listings')}
          style={{ padding: '1rem 0', color: activeTab === 'listings' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'listings' ? '2px solid var(--primary)' : '2px solid transparent', fontWeight: activeTab === 'listings' ? 600 : 400, background: 'none' }}
        >
          My Listings ({myProducts.length})
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          style={{ padding: '1rem 0', color: activeTab === 'requests' ? 'var(--accent)' : 'var(--text-muted)', borderBottom: activeTab === 'requests' ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: activeTab === 'requests' ? 600 : 400, background: 'none' }}
        >
          Incoming Purchase Requests ({activeTab === 'requests' ? requests.length : '?'})
        </button>
      </div>

      {/* Content Rendering */}
      {activeTab === 'listings' ? (
        productsLoading ? <p>Loading your products...</p> : myProducts.length === 0 ? (
          <div style={{ background: 'var(--glass)', padding: '4rem', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3>Your store is empty.</h3>
            <p style={{ color: 'var(--text-muted)' }}>Click Add New Listing above to post your first item!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {myProducts.map((p, idx) => <ProductCard key={p.id} product={p} index={idx} />)}
          </div>
        )
      ) : (
        requestsLoading ? <p>Loading requests...</p> : requests.length === 0 ? (
           <div style={{ background: 'var(--glass)', padding: '4rem', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--border)' }}>
             <p style={{ color: 'var(--text-muted)' }}>No incoming purchase requests found for your items.</p>
           </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map((req) => (
              <motion.div 
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{req.product.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', gap: '1rem' }}>
                    <span>Buyer: {req.buyer.name} (<a href={`mailto:${req.buyer.email}`} style={{ color: 'var(--accent)' }}>{req.buyer.email}</a>)</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> Requested: {new Date(req.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
                
                <div>
                  {req.status === 'REQUESTED' ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleAction(req.id, 'APPROVED')} style={{ background: '#22c55e', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                        <CheckCircle size={18} /> Approve Sale
                      </button>
                      <button onClick={() => handleAction(req.id, 'CANCELLED')} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}>
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: req.status === 'APPROVED' ? '#22c55e' : req.status === 'COMPLETED' ? 'var(--primary)' : '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {req.status === 'APPROVED' || req.status === 'COMPLETED' ? <CheckCircle size={20} /> : <XCircle size={20} />} 
                      Order {req.status}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* New Listing Modal overlay */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '500px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Post New Item</h2>
              <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><XCircle size={24} /></button>
            </div>
            
            {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleCreateListing} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Title</label>
                <input required minLength={3} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'rgba(15,23,42,0.5)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} placeholder="e.g., iPhone 13 Pro" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Price ($)</label>
                  <input required type="number" min="1" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'rgba(15,23,42,0.5)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'rgba(15,23,42,0.5)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}>
                     {['Electronics', 'Books', 'Furniture', 'Clothing', 'Other'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Description</label>
                <textarea required minLength={10} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'rgba(15,23,42,0.5)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', minHeight: '100px' }} placeholder="Describe the condition, specs, etc..." />
              </div>

              <button type="submit" disabled={submitLoading} style={{ background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '8px', fontWeight: 600, marginTop: '0.5rem', opacity: submitLoading ? 0.7 : 1 }}>
                {submitLoading ? 'Publishing...' : 'Publish Listing'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
