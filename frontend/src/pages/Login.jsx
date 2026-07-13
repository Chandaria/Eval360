import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column - Video/Visual Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-navy overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-business-people-walking-in-a-modern-office-building-4436-large.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-20 text-white">
          <div>
            <Logo inverted={true} />
          </div>
          
          <div className="mb-20 mt-auto">
            <h1 className="text-5xl font-display font-semibold leading-tight mb-6">
              Evaluate performance,<br />drive excellence.
            </h1>
            <p className="text-lg text-gray-300 max-w-md">
              Trusted by procurement teams and thousands of suppliers across East Africa.
            </p>
          </div>

          <div className="flex items-start space-x-4 bg-navy/40 p-6 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
              <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=0F2942&color=fff" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm italic text-gray-200">
                "We went from paper assessments to full digital oversight in a single afternoon."
              </p>
              <p className="text-xs font-semibold mt-2 text-white/80">Jane K. — Head of Procurement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo visible only on mobile when left column is hidden */}
          <div className="flex lg:hidden mb-8">
            <Logo />
          </div>
          
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            Sign in to your account to continue
          </p>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline text-sm">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email or phone
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2bafe6] focus:border-[#2bafe6] sm:text-sm bg-white"
                  placeholder="admin@eval360.test"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2bafe6] focus:border-[#2bafe6] sm:text-sm bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-[#2bafe6] hover:bg-[#259ccf] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2bafe6] transition-colors"
              >
                Sign in &rarr;
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 text-xs">or</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Email me a sign-in code
              </button>
              <button className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-100 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors">
                Create a new business &rarr;
              </button>
              
              <div className="pt-4 text-center">
                <a href="#" className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                  Join an existing branch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
