import { useState } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Password reset modal states
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState('email'); // 'email', 'loading', 'resetForm', 'success'
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  // Debug state
  const [debugInfo, setDebugInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Reset error message
    setDebugInfo(''); // Reset debug info
  
    console.log('SignIn form submitted');
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Add debug info for login attempt
    let debugMessage = `Login attempt with email: ${email}\n`;
    setDebugInfo(debugMessage);
  
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
  
      console.log('Login response:', response);
      
      // Add debug info for successful login
      debugMessage += `Login response status: ${response.status}\n`;
      setDebugInfo(debugMessage);
  
      if (response.status === 200) {
        console.log('Login successful');
        
        // Add debug info for successful login
        debugMessage += 'Login successful\n';
        setDebugInfo(debugMessage);
  
        // ✅ Store both access and refresh tokens
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken); // ✅ Store refresh token
  
        navigate('/dashboard'); // Redirect to a protected route (dashboard)
      } else {
        console.log('Login failed:', response.data.message);
        
        // Add debug info for failed login
        debugMessage += `Login failed: ${response.data.message}\n`;
        setDebugInfo(debugMessage);
        
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      
      // Add debug info for login error
      debugMessage += `Login error: ${error.message}\n`;
      if (error.response) {
        debugMessage += `Response status: ${error.response.status}\n`;
        debugMessage += `Response data: ${JSON.stringify(error.response.data)}\n`;
      }
      setDebugInfo(debugMessage);
  
      // ✅ Improved error handling
      if (error.response) {
        setError(error.response.data?.message || 'Invalid credentials. Please try again.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Password reset functionality
  const handleResetRequest = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetStep('loading');
    
    // Add debug info for reset request
    let debugMessage = `Reset password request for email: ${resetEmail}\n`;
    setDebugInfo(debugMessage);
    
    try {
      const response = await axios.post(`${BASE_URL}/forgotPassoword`, { email: resetEmail });
      
      // Add debug info for reset request response
      debugMessage += `Reset request response status: ${response.status}\n`;
      debugMessage += `Has token: ${Boolean(response.data.forgotpasswordtoken)}\n`;
      setDebugInfo(debugMessage);
      
      if (response.data.forgotpasswordtoken) {
        setResetToken(response.data.forgotpasswordtoken);
        setResetStep('resetForm');
      } else {
        setResetError('Something went wrong. Please try again.');
        setResetStep('email');
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      
      // Add debug info for reset request error
      debugMessage += `Reset request error: ${error.message}\n`;
      if (error.response) {
        debugMessage += `Response status: ${error.response.status}\n`;
        debugMessage += `Response data: ${JSON.stringify(error.response.data)}\n`;
      }
      setDebugInfo(debugMessage);
      
      setResetError(error.response?.data?.message || 'Failed to process your request. Please try again.');
      setResetStep('email');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    
    // Add debug info for password reset
    let debugMessage = `Attempting to reset password for: ${resetEmail}\n`;
    debugMessage += `New password: ${newPassword}\n`; // For debugging only, remove in production
    setDebugInfo(debugMessage);
    
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      debugMessage += 'Error: Passwords do not match\n';
      setDebugInfo(debugMessage);
      return;
    }

    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters long');
      debugMessage += 'Error: Password too short\n';
      setDebugInfo(debugMessage);
      return;
    }

    try {
      const response = await axios.put(`${BASE_URL}/resetPassword`, {
        email: resetEmail,
        forgotpasswordtoken: resetToken,
        newPassword
      });

      // Add debug info for reset response
      debugMessage += `Reset response status: ${response.status}\n`;
      debugMessage += `Response data: ${JSON.stringify(response.data)}\n`;
      setDebugInfo(debugMessage);

      if (response.status === 200) {
        setResetStep('success');
        
        // Store the new password in local storage for easy access
        // IMPORTANT: Only for debugging, remove in production!
        localStorage.setItem('lastResetPassword', newPassword);
        debugMessage += 'Password reset successful\n';
        setDebugInfo(debugMessage);
      } else {
        setResetError('Failed to reset password. Please try again.');
        debugMessage += 'Password reset failed\n';
        setDebugInfo(debugMessage);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      
      // Add debug info for reset error
      debugMessage += `Reset error: ${error.message}\n`;
      if (error.response) {
        debugMessage += `Response status: ${error.response.status}\n`;
        debugMessage += `Response data: ${JSON.stringify(error.response.data)}\n`;
      }
      setDebugInfo(debugMessage);
      
      setResetError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  const closeModal = () => {
    setShowResetModal(false);
    setResetStep('email');
    setResetEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setResetToken('');
    setResetError('');
    // Don't clear debug info when closing modal
  };

  const openResetModal = (e) => {
    e.preventDefault(); // Prevent # navigation
    setShowResetModal(true);
    setResetEmail(email); // Pre-fill with the email from the login form if available
  };

  return (
    <div className="min-h-screen flex items-stretch bg-gray-100">
      <div className="flex w-full">
        <div className="w-1/2 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3271&q=80"
            alt="Students collaborating"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12 h-full flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome Back</h2>
            <p className="text-gray-600 mb-6">Sign in to access your courses and continue learning</p>
            
            {/* Debug Info Panel */}
            {debugInfo && (
              <div className="bg-gray-100 p-4 rounded-lg mb-4 overflow-auto max-h-40">
                <h4 className="font-medium text-sm mb-2">Debug Information:</h4>
                <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <FaLock className="absolute top-3 left-3 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                </div>
                <button 
                  type="button" 
                  onClick={openResetModal} 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
              
              {/* Auto-fill from recent reset - DEBUG ONLY */}
              {localStorage.getItem('lastResetPassword') && (
                <button
                  type="button"
                  onClick={() => {
                    setPassword(localStorage.getItem('lastResetPassword'));
                    setDebugInfo(prev => prev + `\nAuto-filled with last reset password: ${localStorage.getItem('lastResetPassword')}`);
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
                >
                  Debug: Use Last Reset Password
                </button>
              )}
            </form>
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <FaGoogle className="mr-2" />
                  Google
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <FaFacebookF className="mr-2" />
                  Facebook
                </button>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Reset Password</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Debug Info Panel Inside Modal */}
            {debugInfo && (
              <div className="bg-gray-100 p-4 rounded-lg mb-4 overflow-auto max-h-40">
                <h4 className="font-medium text-sm mb-2">Debug Information:</h4>
                <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}

            {resetStep === 'email' && (
              <form onSubmit={handleResetRequest} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                    <input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                {resetError && <p className="text-red-500 text-sm">{resetError}</p>}
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Request Password Reset
                </button>
              </form>
            )}

            {resetStep === 'loading' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="mt-4 text-gray-600">Verifying your account...</p>
              </div>
            )}

            {resetStep === 'resetForm' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Please enter your new password below:</p>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <FaLock className="absolute top-3 left-3 text-gray-400" />
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <FaLock className="absolute top-3 left-3 text-gray-400" />
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                {resetError && <p className="text-red-500 text-sm">{resetError}</p>}
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reset Password
                </button>
              </form>
            )}

            {resetStep === 'success' && (
              <div className="text-center py-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Password Reset Successful</h3>
                <p className="mt-2 text-sm text-gray-500">Your password has been successfully reset. You can now sign in with your new password.</p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;