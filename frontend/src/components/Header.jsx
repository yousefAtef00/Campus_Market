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
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.8rem' }}></h1>
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
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
              top: '-8px',
              right: '-8px',
              background: '#e74c3c',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem'
            }}>
              {cartItems.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;