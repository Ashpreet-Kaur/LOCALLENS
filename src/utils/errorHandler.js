// 🐛 Centralized error handling utility
// Fixes Problem #10: Missing Error Handling

/**
 * Display user-friendly error messages instead of console.error
 * @param {string} context - Where the error occurred (e.g., 'Weather API', 'Location')
 * @param {Error} error - The error object
 * @param {boolean} showAlert - Whether to show browser alert (default: true)
 */
export const handleError = (context, error, showAlert = true) => {
  console.error(`[${context}] Error:`, error);
  
  const errorMessages = {
    'Weather API': 'Unable to fetch weather data. Please check your internet connection.',
    'Location': 'Could not get your location. Please check your device settings.',
    'Places API': 'Unable to load nearby places. Please try again later.',
    'Network': 'Network error. Please check your internet connection.',
    'Auth': 'Authentication failed. Please try logging in again.',
  };

  const message = errorMessages[context] || `An error occurred: ${error.message}`;
  
  if (showAlert) {
    alert(`❌ ${message}`);
  }
  
  return message;
};

/**
 * Handle geolocation-specific errors
 * @param {GeolocationPositionError} error - Geolocation error
 */
export const handleGeolocationError = (error) => {
  const messages = {
    1: 'Location access denied. Please enable location permissions in your browser settings.',
    2: 'Location unavailable. Please check your device settings.',
    3: 'Location request timed out. Please try again.',
  };
  
  const message = messages[error.code] || 'Unable to get your location.';
  alert(`📍 ${message}`);
  console.error('Geolocation error:', error);
};

/**
 * Handle fetch/API errors with retry suggestion
 * @param {string} apiName - Name of the API
 * @param {Error} error - The error object
 * @param {Function} retryFn - Optional retry function
 */
export const handleApiError = (apiName, error, retryFn = null) => {
  console.error(`[${apiName} API] Error:`, error);
  
  let message = `Failed to fetch data from ${apiName}.`;
  
  if (!navigator.onLine) {
    message = 'You appear to be offline. Please check your internet connection.';
  } else if (error.message.includes('404')) {
    message = `${apiName} endpoint not found. Please contact support.`;
  } else if (error.message.includes('500')) {
    message = `${apiName} server error. Please try again later.`;
  }
  
  if (retryFn) {
    const retry = confirm(`${message}\n\nWould you like to retry?`);
    if (retry) {
      retryFn();
    }
  } else {
    alert(`❌ ${message}`);
  }
};

/**
 * Validate API response
 * @param {Response} response - Fetch response
 * @param {string} apiName - Name of the API for error messages
 */
export const validateApiResponse = async (response, apiName) => {
  if (!response.ok) {
    throw new Error(`${apiName} API error: ${response.status} ${response.statusText}`);
  }
  return response;
};
