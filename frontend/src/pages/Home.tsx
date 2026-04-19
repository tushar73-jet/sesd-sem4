import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { productService } from '../services/product.service';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Furniture', 'Clothing', 'Other'];

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Refined Pagination and Filter State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [error, setError] = useState('');

  // Trigger search on form submit instead of every keystroke for better performance
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchProducts();
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await productService.getProducts({
        page,
        limit: 12,
        search: searchQuery,
        category: activeCategory === 'All' ? undefined : activeCategory,
        status: 'AVAILABLE' // Only show available products in the marketplace!
      });
      setProducts(res.data.products);
      setTotalPages(res.data.meta.totalPages || 1);
    } catch (err: any) {
      console.error('Failed to fetch products', err);
      setError(err.response?.data?.message || 'The server is currently unreachable. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when category or page changes
  useEffect(() => {
    fetchProducts();
  }, [activeCategory, page]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Top Banner / Header */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Student Marketplace</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Find what you need, sell what you don't. Safely within your campus.</p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', maxWidth: '600px', margin: '2rem auto 0' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search color="var(--text-muted)" size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search textbooks, laptops, dorm gear..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--glass)', color: 'white', outline: 'none', fontSize: '1rem' }}
            />
          </div>
          <button type="submit" style={{ padding: '0 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '12px', fontWeight: 600, transition: 'background 0.2s' }}>
            Find
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 250px) 1fr', gap: '2rem' }}>
        
        {/* Sidebar Filters */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.125rem' }}>
              <Filter size={18} /> Categories
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => { setActiveCategory(cat); setPage(1); }}
                    style={{ 
                      width: '100%', 
                      textAlign: 'left', 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '8px',
                      background: activeCategory === cat ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                      color: activeCategory === cat ? 'var(--accent)' : 'var(--text-muted)',
                      fontWeight: activeCategory === cat ? 600 : 400,
                      transition: 'all 0.2s'
                    }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Grid */}
        <main>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: 'var(--text-muted)' }}>
              <RefreshCw className="animate-spin" size={32} style={{ animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : products.length === 0 ? (
            <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '16px', padding: '4rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {error ? 'Failed to connect to marketplace' : 'No products found'}
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {error ? `Reason: ${error}` : 'Try adjusting your search or filters.'}
              </p>
              {error && (
                <button 
                  onClick={() => fetchProducts()}
                  style={{ marginTop: '1.5rem', background: 'var(--primary)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}
                >
                  Try Again
                </button>
              )}
            </div>
          ) : (
            <>
              {/* The Grid Component */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', position: 'relative' }}>
                {products.map((p, idx) => (
                  <ProductCard key={p.id} product={p} index={idx} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    style={{ padding: '0.5rem 1rem', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '8px', color: page === 1 ? 'var(--text-muted)' : 'white' }}
                  >
                    Previous
                  </button>
                  <span style={{ color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
                  <button 
                    disabled={page >= totalPages} 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    style={{ padding: '0.5rem 1rem', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '8px', color: page >= totalPages ? 'var(--text-muted)' : 'white' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
