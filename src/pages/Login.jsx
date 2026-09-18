import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import BrandLogo from '@/components/BrandLogo';
export default function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="flex min-h-screen">
      {/* Left panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#040712] p-12 lg:flex">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/5 blur-3xl"/>
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl"/>
        <BrandLogo to="/" className="relative" />
        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight text-white">Welcome back to your command center.</h2>
          <p className="mt-4 text-lg text-primary-100">Your products, sales, and customers — all in one beautifully simple dashboard.</p>
          <div className="mt-8 flex gap-3">
            <div className="h-2 w-12 rounded-full bg-white"/>
            <div className="h-2 w-6 rounded-full bg-white/40"/>
            <div className="h-2 w-6 rounded-full bg-white/40"/>
          </div>
        </div>
        <p className="relative text-sm text-primary-200">© 2026 Optiora. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
            <ArrowLeft className="h-4 w-4"/>
            Back to home
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your credentials to access your dashboard.</p>

          {error && (<div className="mt-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-slide-up">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0"/>
              {error}
            </div>)}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" className="input-field pl-10"/>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="input-field pl-10"/>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"/>
                Remember me
              </label>
              <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Forgot password?
              </button>
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>);
}
