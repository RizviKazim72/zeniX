/**
 * Register Page
 * Beautiful Netflix-style registration form
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Film, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import ProfileImageUploader from "@/components/ui/ProfileImageUploader";

const RegisterPage = () => {
  const router = useRouter();
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const { success, error: showToastError } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  // Check password strength
  useEffect(() => {
    const checkPasswordStrength = (password: string) => {
      let strength = 0;
      if (password.length >= 6) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/\d/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      return strength;
    };

    setPasswordStrength(checkPasswordStrength(formData.password));
  }, [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      showToastError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      showToastError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      showToastError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        profileImage: profileImage,
      });
      
      if (result.success) {
        success('Registration successful! Welcome to zeniX.');
        router.push('/');
      } else {
        setError(result.message);
        showToastError(result.message);
      }
    } catch (error) {
      const errorMessage = 'Registration failed. Please try again.';
      setError(errorMessage);
      showToastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'Weak';
      case 2:
      case 3: return 'Medium';
      case 4:
      case 5: return 'Strong';
      default: return 'Weak';
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2:
      case 3: return 'bg-yellow-500';
      case 4:
      case 5: return 'bg-green-500';
      default: return 'bg-red-500';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden font-netflix">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/10 via-transparent to-netflix-red/10"></div>
      </div>

      {/* Netflix-style background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-netflix-red/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <Link href="/" className="inline-flex items-center space-x-2 group">
            <div className="h-10 w-10 bg-gradient-netflix flex items-center justify-center rounded-sm shadow-netflix group-hover:scale-110 transition-transform duration-300">
              <Film size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-netflix-red group-hover:text-netflix-red-light transition-colors duration-300">
              zeniX.
            </span>
          </Link>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Register Form Card */}
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Join zeniX</h1>
                <p className="text-text-secondary">Create your account and start watching</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-text-secondary">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-text-disabled" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-bg-tertiary rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200 text-white placeholder-text-disabled"
                        placeholder="First name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-text-secondary">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-bg-secondary border border-bg-tertiary rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200 text-white placeholder-text-disabled"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Profile Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Profile Picture (Optional)
                  </label>
                  <ProfileImageUploader
                    currentImage={profileImagePreview || undefined}
                    onImageChange={(file, preview) => {
                      setProfileImage(file);
                      setProfileImagePreview(preview);
                    }}
                    className="w-full"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-text-secondary">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-text-disabled" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-bg-tertiary rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200 text-white placeholder-text-disabled"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-text-secondary">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-text-disabled" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 bg-bg-secondary border border-bg-tertiary rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200 text-white placeholder-text-disabled"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-disabled hover:text-text-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-disabled">Password strength:</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength <= 2 ? 'text-red-400' : 
                          passwordStrength <= 3 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-bg-tertiary rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-text-secondary">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-text-disabled" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 bg-bg-secondary border rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200 text-white placeholder-text-disabled ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-500' : 'border-bg-tertiary'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-disabled hover:text-text-secondary transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    
                    {/* Password Match Indicator */}
                    {formData.confirmPassword && (
                      <div className="absolute inset-y-0 right-10 flex items-center">
                        {formData.password === formData.confirmPassword ? (
                          <Check className="h-5 w-5 text-green-400" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-red-400"></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-netflix hover:bg-netflix-red-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-netflix"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="text-netflix-red hover:text-netflix-red-light font-medium transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 text-center"
            >
              <p className="text-xs text-text-disabled">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-netflix-red hover:text-netflix-red-light">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-netflix-red hover:text-netflix-red-light">
                  Privacy Policy
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
