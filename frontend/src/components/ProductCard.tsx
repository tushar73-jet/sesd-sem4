import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tag, Clock } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  status: string;
  createdAt: string;
}

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Placeholder Image container since we don't have S3 set up yet */}
      <div style={{ height: '180px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}>
        <Tag size={48} />
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', margin: 0, color: 'var(--text-main)', lineHeight: '1.3' }}>
            {product.title.length > 40 ? product.title.substring(0, 40) + '...' : product.title}
          </h3>
        </div>

        <p style={{ color: 'var(--accent)', fontSize: '1.25rem', fontWeight: 600, margin: '0.5rem 0' }}>
          ${product.price.toFixed(2)}
        </p>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', textTransform: 'capitalize' }}>
            {product.category}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} />
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {/* Invisible link overlay to make whole card clickable to details page */}
      <Link to={`/product/${product.id}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
    </motion.div>
  );
};

export default ProductCard;
