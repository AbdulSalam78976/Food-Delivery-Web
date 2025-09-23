import React from 'react'
import './placeorder.css'

function PlaceOrder() {
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
        Place Your Order
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
          marginBottom: 'var(--spacing-lg)',
          textAlign: 'center'
        }}>
          Order placement functionality coming soon!
        </p>
        <a href="/cart" style={{
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          background: 'var(--primary-color)',
          color: 'var(--white)',
          textDecoration: 'none',
          borderRadius: 'var(--border-radius)',
          transition: 'var(--transition)',
          marginRight: 'var(--spacing-sm)'
        }}>
          View Cart
        </a>
        <a href="/" style={{
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          background: 'var(--bg-tertiary)',
          color: 'var(--text-dark)',
          textDecoration: 'none',
          borderRadius: 'var(--border-radius)',
          transition: 'var(--transition)',
          border: '1px solid var(--primary-color)'
        }}>
          Continue Shopping
        </a>
      </div>
    </div>
  )
}

export default PlaceOrder