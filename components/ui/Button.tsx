"use client";

import { motion } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "netflix" | "ghost" | "outline";
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
  type = "button",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base", 
    lg: "px-8 py-4 text-lg"
  };

  const variantClasses = {
    primary: "bg-netflix-red text-white hover:bg-netflix-red-dark",
    secondary: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700",
    accent: "bg-blue-500 text-white hover:bg-blue-600",
    netflix: "bg-netflix-red text-white hover:bg-netflix-red-dark shadow-netflix",
    ghost: "text-white hover:bg-white/10 border border-transparent",
    outline: "border-2 border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white"
  };

  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

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
            {icon}
            <span>{children}</span>
          </>
        )}
      </div>
    </motion.button>
  );
};

export default Button;