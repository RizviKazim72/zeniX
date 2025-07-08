'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Check } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState(''); // Only for development
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('success');
        // For development only - remove in production
        if (data.resetToken) {
          setResetToken(data.resetToken);
        }
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevResetPassword = () => {
    if (resetToken) {
      router.push(`/reset-password?token=${resetToken}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(229,9,20,0.3),transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Login */}
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        {/* Main Card */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-4">
              {step === 'email' ? (
                <Mail className="w-8 h-8 text-red-500" />
              ) : (
                <Check className="w-8 h-8 text-green-500" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 'email' ? 'Forgot Password?' : 'Check Your Email'}
            </h1>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              {step === 'email' 
                ? "Don't worry! Enter your email address and we'll send you a link to reset your password."
                : "We've sent a password reset link to your email address. Please check your inbox and follow the instructions."
              }
            </p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-900/30 border border-red-800/50 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="p-4 bg-green-900/30 border border-green-800/50 rounded-xl">
                <p className="text-green-400 text-sm">
                  Reset link sent to <strong>{email}</strong>
                </p>
              </div>

              {/* Development Only - Reset Password Button */}
              {resetToken && process.env.NODE_ENV === 'development' && (
                <div className="p-4 bg-blue-900/30 border border-blue-800/50 rounded-xl">
                  <p className="text-blue-400 text-xs mb-3">
                    Development Mode: Click below to test the reset flow
                  </p>
                  <button
                    onClick={handleDevResetPassword}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Test Reset Password
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setStep('email');
                    setError('');
                    setResetToken('');
                  }}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Try Another Email
                </button>
                
                <Link
                  href="/login"
                  className="block w-full text-center text-gray-400 hover:text-white py-3 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Remember your password?{' '}
            <Link href="/login" className="text-red-500 hover:text-red-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
