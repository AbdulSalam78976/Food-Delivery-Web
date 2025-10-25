import { useMemo } from 'react';
import { validatePasswordStrength, getPasswordStrengthColor } from '@/utils/passwordValidation';

const PasswordStrengthIndicator = ({ password, showDetails = true, className = '' }) => {
  const validation = useMemo(() => {
    return validatePasswordStrength(password);
  }, [password]);

  if (!password) {
    return null;
  }

  const strengthColor = getPasswordStrengthColor(validation.strength);
  const progressWidth = `${validation.score}%`;

  return (
    <div className={`mt-2 ${className}`}>
      {/* Strength Bar */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              validation.strength === 'strong' ? 'bg-green-500' :
              validation.strength === 'good' ? 'bg-blue-500' :
              validation.strength === 'fair' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: progressWidth }}
          />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${strengthColor}`}>
          {validation.strength.charAt(0).toUpperCase() + validation.strength.slice(1)}
        </span>
      </div>

      {/* Score */}
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">
          Password Strength: {validation.score}/100
        </span>
        {validation.isValid && (
          <span className="text-xs text-green-600 font-medium">✓ Valid</span>
        )}
      </div>

      {showDetails && (
        <>
          {/* Errors */}
          {validation.errors.length > 0 && (
            <div className="mt-2 space-y-1">
              {validation.errors.map((error, index) => (
                <div key={index} className="flex items-start space-x-1">
                  <span className="text-red-500 text-xs mt-0.5">✗</span>
                  <span className="text-xs text-red-600">{error}</span>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {validation.suggestions.length > 0 && (
            <div className="mt-2 space-y-1">
              <span className="text-xs font-medium text-gray-700">Suggestions:</span>
              {validation.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-1">
                  <span className="text-blue-500 text-xs mt-0.5">•</span>
                  <span className="text-xs text-gray-600">{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;