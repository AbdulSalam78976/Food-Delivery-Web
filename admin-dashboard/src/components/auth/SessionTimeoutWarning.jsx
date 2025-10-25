import { useState } from 'react';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useAuth } from '@/contexts/AuthContext';
import { getRememberMePreference, formatTimeRemaining } from '@/services/sessionManager';

const SessionTimeoutWarning = () => {
  const { 
    showTimeoutWarning, 
    timeUntilExpiry, 
    extendSession 
  } = useSessionManager();
  
  const { signOut } = useAuth();
  
  const [isExtending, setIsExtending] = useState(false);

  const handleExtendSession = async () => {
    setIsExtending(true);
    
    try {
      const { success, error } = await extendSession();
      
      if (!success) {
        console.error('Failed to extend session:', error);
      }
    } catch (error) {
      console.error('Error extending session:', error);
    } finally {
      setIsExtending(false);
    }
  };

  if (!showTimeoutWarning) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
            Session Expiring Soon
          </h3>
          
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Your session will expire in{' '}
              <span className="font-semibold text-red-600">
                {formatTimeRemaining(timeUntilExpiry)}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {getRememberMePreference().isRemembered 
                ? 'Your extended session is about to expire. Would you like to continue?' 
                : 'Would you like to extend your session?'
              }
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={handleExtendSession}
              disabled={isExtending}
              className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExtending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Extending...
                </>
              ) : (
                'Extend Session'
              )}
            </button>
            
            <button
              onClick={async () => {
                await signOut();
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;