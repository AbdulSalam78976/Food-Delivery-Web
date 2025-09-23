import React from 'react'
import './cart.css'

function Cart() {
  return (
    <div style={{
      minHeight: '80vh',
      padding: 'var(--spacing-xl) var(--container-padding)',
      background: 'var(--bg-dark)',
      color: 'var(--text-dark)'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: 'var(--spacing-lg)',
        textAlign: 'center',
        color: 'var(--primary-color)'
      }}>
        Your Cart
      </h1>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-xl)',
        border: '1px solid var(--bg-tertiary)'
      }}>
        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-light)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          No items in your cart yet.
        </p>
        <a href="/" style={{
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          background: 'var(--primary-color)',
          color: 'var(--white)',
          textDecoration: 'none',
          borderRadius: 'var(--border-radius)',
          transition: 'var(--transition)'
        }}>
          Start Shopping
        </a>
      </div>
    </div>
  )
}

export default Cart