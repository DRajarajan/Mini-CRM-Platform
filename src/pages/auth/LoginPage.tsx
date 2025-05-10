import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import { GanttChartSquare } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface GoogleUserData {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
    try {
      // Decode JWT token to get user information
      const decoded = jwtDecode<GoogleUserData>(credentialResponse.credential ?? '');
      
      // Store user data
      login({
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Authentication failed. Please try again.');
    }
  };

  const handleGoogleLoginError = () => {
    setError('Google authentication failed. Please try again.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mb-8 text-center lg:hidden">
        <div className="mb-4 flex justify-center">
          <GanttChartSquare size={48} className="text-primary-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">InsightCRM</h1>
        <p className="mt-2 text-gray-600">Modern customer relationship management</p>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">Welcome back</h2>
        
        {error && (
          <div className="mb-4 rounded-md bg-error-50 p-4 text-sm text-error-800">
            {error}
          </div>
        )}
        
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            useOneTap
            theme="outline"
            shape="rectangular"
            size="large"
            text="signin_with"
            locale="en"
          />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By continuing, you agree to the{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;