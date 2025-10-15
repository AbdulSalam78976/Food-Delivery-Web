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
  console.log('📱 App component is rendering...')
  
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
          <div>
            <h1>404 Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">Go Home</a>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
