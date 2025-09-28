import React from 'react'
import Navbar from './components/navbar/navbar'
import Home from './pages/home/home'
import Cart from './pages/cart/cart'
import Checkout from './pages/checkout/checkout'
import Login from './pages/auth/login/login'
import Signup from './pages/auth/signup/signup'
import { Route, Routes } from 'react-router-dom'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


const App = () => {
  return (
    <div>
      
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='*' element={
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            padding: 'var(--spacing-xl)',
            textAlign: 'center',
            background: 'var(--bg-dark)',
            color: 'var(--text-dark)'
          }}>
            <h1 style={{ 
              fontSize: '3rem', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--primary-color)'
            }}>
              404 Not Found
            </h1>
            <p style={{ 
              fontSize: '1.2rem',
              color: 'var(--text-light)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              The page you're looking for doesn't exist.
            </p>
            <a href="/" style={{
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              background: 'var(--primary-color)',
              color: 'var(--white)',
              textDecoration: 'none',
              borderRadius: 'var(--border-radius)',
              transition: 'var(--transition)'
            }}>
              Go Home
            </a>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
