import React, { useEffect } from 'react'
import Navbar from './components/navbar/navbar'
import Home from './pages/home/home'
import Cart from './pages/cart/cart'
import Checkout from './pages/checkout/checkout'
import Login from './pages/auth/login/login'
import Signup from './pages/auth/signup/signup'
import Loader from './components/loader/loader'
import ScrollToTop from './components/scrolltotop/ScrollToTop'
import { Route, Routes } from 'react-router-dom'
import { useAppLoader } from './contexts/AppLoaderContext'
import { performanceMonitor } from './utils/performance'
import './App.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


const App = () => {
  console.log('📱 App component is rendering...')
  const { isAppLoading, loadingMessage, updateLoadingStep } = useAppLoader()
  
  // Mark app as ready when component mounts
  useEffect(() => {
    const startTime = performance.now();
    updateLoadingStep('app', true);
    
    // Track app initialization performance
    if (process.env.NODE_ENV === 'development') {
      performanceMonitor.trackComponentRender('App', startTime);
    }
  }, [updateLoadingStep])
  
  // Show loader while app is initializing
  if (isAppLoading) {
    return <Loader message={loadingMessage} />
  }
  
  return (
    <div className="app">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      
      <Navbar />
      
      <main id="main-content">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='*' element={
            <div className="not-found-page">
              <div className="not-found-content">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      
      <ScrollToTop />
    </div>
  )
}

export default App
