"use client";

import { motion } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "netflix" | "ghost" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
  glow?: boolean;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  glow = false,
  className = "",
  onClick,
  ariaLabel,
  disabled,
  type = "button"
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm font-medium",
    md: "px-6 py-3 text-base font-medium", 
    lg: "px-8 py-4 text-lg font-semibold"
  };

  const variantClasses = {
    primary: "bg-netflix-red text-white hover:bg-netflix-red-dark border border-transparent",
    secondary: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-600 hover:border-gray-500",
    accent: "bg-blue-500 text-white hover:bg-blue-600 border border-transparent",
    netflix: "bg-netflix-red text-white hover:bg-netflix-red-dark shadow-netflix border border-transparent",
    ghost: "bg-transparent text-white hover:bg-white/10 border border-white/20 hover:border-white/40",
    outline: "border-2 border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white",
    white: "bg-white text-black hover:bg-gray-200 font-semibold shadow-lg border border-transparent"
  };

  const baseClasses = "inline-flex items-center justify-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-netflix-red/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const glowClasses = glow ? "hover:shadow-netflix" : "";

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${glowClasses}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      type={type}
    >
      <div className="flex items-center space-x-2">
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </div>
    </motion.button>
  );
};

export default Button;