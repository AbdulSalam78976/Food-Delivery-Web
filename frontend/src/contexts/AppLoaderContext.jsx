import { createContext, useContext, useState, useEffect } from 'react'

const AppLoaderContext = createContext({})

export const AppLoaderProvider = ({ children }) => {
  const [isAppLoading, setIsAppLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Initializing app...')
  const [loadingSteps, setLoadingSteps] = useState({
    auth: false,
    data: false,
    app: false
  })

  // Track loading steps
  const updateLoadingStep = (step, isComplete) => {
    setLoadingSteps(prev => ({
      ...prev,
      [step]: isComplete
    }))
  }

  // Check if all loading steps are complete
  useEffect(() => {
    const allStepsComplete = Object.values(loadingSteps).every(step => step === true)

    if (allStepsComplete) {
      // Add a small delay for better UX
      setTimeout(() => {
        setIsAppLoading(false)
      }, 500)
    }
  }, [loadingSteps])

  // Update loading message based on current step
  useEffect(() => {
    if (!loadingSteps.auth) {
      setLoadingMessage('🔐 Checking your credentials...')
    } else if (!loadingSteps.data) {
      setLoadingMessage('🍕 Loading delicious menu...')
    } else if (!loadingSteps.app) {
      setLoadingMessage('🚚 Preparing your delivery...')
    } else {
      setLoadingMessage('✨ Almost ready to serve!')
    }
  }, [loadingSteps])

  const value = {
    isAppLoading,
    loadingMessage,
    updateLoadingStep,
    loadingSteps
  }

  return (
    <AppLoaderContext.Provider value={value}>
      {children}
    </AppLoaderContext.Provider>
  )
}

export const useAppLoader = () => {
  const context = useContext(AppLoaderContext)
  if (!context) {
    throw new Error('useAppLoader must be used within an AppLoaderProvider')
  }
  return context
}
