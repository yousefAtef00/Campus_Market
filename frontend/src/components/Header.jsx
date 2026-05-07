import React from 'react';

function Header({ user, cartItems, openCart, setPage }) {
  return (
    <header style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      flexWrap: 'wrap'
    }}>
      
      {/* FIX: title مش فاضي */}
      <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
        SWAPSTER
      </h1>

      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        alignItems: 'center' 
      }}>
        
        <button 
          onClick={openCart} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1.5rem',
            position: 'relative'
          }}
        >
          🛒
          {cartItems.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: '#e74c3c',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem'
            }}>
              {cartItems.length}
            </span>
          )}
        </button>
      </div>

      {/* ===== MOBILE FIX ===== */}
      <style>{`
        @media (max-width: 768px) {
          header {
            padding: 10px 15px !important;
          }

          header h1 {
            font-size: 1.2rem !important;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;