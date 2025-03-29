/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaChalkboardTeacher } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Reset error

    try {
      const response = await axios.post(`${BASE_URL}/signup`, {
        fullName,
        email,
        password,
        // role
      });

      if (response.status === 200 || response.status === 201) {
        // Redirect to login after successful signup
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'An error occurred during sign-up.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex w-full">
        <div className="w-1/2 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80"
            alt="Students in a lecture"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12 flex flex-col justify-between">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Join Our Learning Community</h2>
            <p className="text-gray-600 mb-6">Create an account to start your learning journey</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute top-3 left-3 text-gray-400" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
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
              <div className="flex items-center">
                <input id="terms" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" required />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                </label>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
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
              Already have an account?{' '}
              <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
          <div className="mt-6 max-w-md mx-auto w-full">
            <Link
              to="/admin"
              className="block w-full text-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              <FaChalkboardTeacher className="inline-block mr-2" />
              Become a Course Creator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
