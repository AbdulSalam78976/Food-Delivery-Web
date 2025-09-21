import React from 'react'
import Navbar from './components/navbar/navbar'
import Home from './pages/home/home'
import Cart from './pages/cart/cart'
import PlaceOrder from './pages/placeorder/placeorder'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
      
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<PlaceOrder />} />
        <Route path='*' element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  )
}

export default App
