// Performance monitoring utilities
export const performanceMonitor = {
  // Track page load time
  trackPageLoad: () => {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`🚀 Page loaded in ${loadTime}ms`);
        
        // Track basic performance metrics
        if (window.performance && window.performance.getEntriesByType) {
          const navigation = window.performance.getEntriesByType('navigation')[0];
          if (navigation) {
            console.log(`🚀 DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
            console.log(`🚀 Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
          }
        }
      });
    }
  },

  // Track component render time
  trackComponentRender: (componentName, startTime) => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    if (renderTime > 16) { // Only log if render takes more than 16ms (60fps threshold)
      console.log(`⚡ ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }
  },

  // Track API call performance
  trackApiCall: async (apiName, apiCall) => {
    const startTime = performance.now();
    try {
      const result = await apiCall();
      const endTime = performance.now();
      console.log(`🌐 ${apiName} completed in ${(endTime - startTime).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const endTime = performance.now();
      console.error(`❌ ${apiName} failed after ${(endTime - startTime).toFixed(2)}ms:`, error);
      throw error;
    }
  },

  // Memory usage tracking
  trackMemoryUsage: () => {
    if (performance.memory) {
      const memory = performance.memory;
      console.log(`💾 Memory usage: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB / ${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`);
    }
  },

  // Image loading performance
  trackImageLoad: (imageSrc) => {
    const startTime = performance.now();
    const img = new Image();
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      console.log(`🖼️ Image loaded in ${loadTime.toFixed(2)}ms: ${imageSrc}`);
    };
    
    img.onerror = () => {
      const loadTime = performance.now() - startTime;
      console.error(`❌ Image failed to load after ${loadTime.toFixed(2)}ms: ${imageSrc}`);
    };
    
    img.src = imageSrc;
  }
};

// Initialize performance monitoring
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.trackPageLoad();
  
  // Track memory usage every 30 seconds in development
  setInterval(() => {
    performanceMonitor.trackMemoryUsage();
  }, 30000);
}

export default performanceMonitor;