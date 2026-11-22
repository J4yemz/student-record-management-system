import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { GraduationCap, ArrowLeft, UserCheck, Lock } from 'lucide-react';

interface LoginPageProps {
  onNavigateHome: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateHome, onLoginSuccess }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both your university email and password');
      return;
    }
    try {
      setError(null);
      await login({ email: email.trim(), password });
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Home Link */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors mx-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>

        {/* Brand Emblem (Solid Color, Zero Gradient) */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to EduRecord
        </h2>
        <p className="mt-1 text-center text-xs text-slate-600">
          Enter your university credentials to authenticate
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 border border-slate-200 rounded-2xl shadow-sm space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Real Credentials Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="University Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@university.edu"
              icon={<UserCheck className="w-4 h-4" />}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Account Password</label>
                <a href="#forgot" className="text-[11px] font-semibold text-blue-700 hover:underline">
                  Forgot credentials?
                </a>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                icon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-blue-700 focus:ring-blue-700" defaultChecked />
                <span>Keep session active</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5"
              isLoading={isLoading}
            >
              Authenticate & Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
