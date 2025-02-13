import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { 
  login, 
  register, 
  loginFailure, 
  registerFailure, 
  clearAuthError 
} from '../../store/authSlice';
import { Smartphone, Lock, Mail, User, XCircle } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (type === 'register' && !name) {
      setError('Please enter your name');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (type === 'register') {
        const existingUser = users.find((user: any) => user.email === email);
        if (existingUser) {
          dispatch(registerFailure('User already exists with this email'));
          return;
        }
        
        const newUser = { name, email, password };
        localStorage.setItem('users', JSON.stringify([...users, newUser]));
        dispatch(register({ 
          user: { name, email }, 
          token: Math.random().toString(36).substr(2) 
        }));
      } else {
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (!user) {
          dispatch(loginFailure('Invalid credentials'));
          return;
        }
        
        dispatch(login({ 
          user: { name: user.name, email: user.email }, 
          token: Math.random().toString(36).substr(2) 
        }));
      }
      
      navigate('/');
    } catch (err) {
      dispatch(loginFailure('An error occurred. Please try again.'));
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-4">
        <div className={`flex flex-col md:flex-row rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Left Side - Illustration */}
          <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 p-12 hidden md:flex flex-col items-center justify-center">
            <div className="mb-8 flex items-center justify-center rounded-full border-4 border-white/20 p-2">
              <img 
                src="https://imgs.search.brave.com/0cuAfs_5FYaHc4TptMddMqmN7_Q2W0DQEvQl2Kw7qsw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/LmNvbS9pbWFnZS1j/ZG4vaW1hZ2VzL2t0/czkyOHBkL3Byb2R1/Y3Rpb24vZThjMjlj/MWRhYjUxYzVmYTAw/ZmUyYzk0NGI0YTNm/NjExZGIxZDk2ZS00/MDJ4NDA5LnBuZz93/PTEwODAmcT03MiZm/bT13ZWJw" 
                alt="E-commerce Auth"
                className="rounded-full w-48 h-48 object-cover shadow-xl border-4 border-white/30"
              />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 text-center">
              Welcome to Our Store
            </h2>
            <p className="text-lg text-indigo-100">
              {type === 'login' 
                ? 'Sign in to access exclusive deals and personalized shopping'
                : 'Join our community for special member benefits'}
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-12">
            <h2 className={`text-4xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {type === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>

            {error && (
              <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-lg flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-600">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {type === 'register' && (
                <div className="relative">
                  <User className={`h-5 w-5 absolute top-3.5 left-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className={`pl-10 w-full rounded-lg py-3 px-4 border-2 focus:ring-2 focus:ring-indigo-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className={`h-5 w-5 absolute top-3.5 left-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className={`pl-10 w-full rounded-lg py-3 px-4 border-2 focus:ring-2 focus:ring-indigo-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div className="relative">
                <Lock className={`h-5 w-5 absolute top-3.5 left-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`pl-10 w-full rounded-lg py-3 px-4 border-2 focus:ring-2 focus:ring-indigo-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-semibold
                         hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 shadow-lg"
              >
                {type === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {type === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <Link 
                  to={type === 'login' ? '/register' : '/login'} 
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  {type === 'login' ? 'Register here' : 'Sign in here'}
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;