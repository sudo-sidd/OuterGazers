"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { HTMLMotionProps, motion } from "framer-motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  withArrow?: boolean;
}

export default function Button({
  children,
  variant = "solid",
  size = "md",
  isLoading = false,
  withArrow = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  
  // Base styling for modern, crisp, studio aesthetic
  const baseStyles = "relative inline-flex items-center justify-center font-sans font-bold uppercase tracking-wider transition-all duration-300 overflow-hidden group focus:outline-none";
  
  // Variant specifics
  const variants = {
    solid: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]",
    outline: "bg-transparent border border-zinc-700 text-white hover:border-white",
    ghost: "bg-transparent text-zinc-500 hover:text-white",
  };

  // Size configurations
  const sizes = {
    sm: "text-[10px] px-6 py-3",
    md: "text-xs px-8 py-4",
    lg: "text-sm px-10 py-5",
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      disabled={isDisabled}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      {/* Background sweep animation for outline variant */}
      {variant === "outline" && (
        <div className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full z-0" />
      )}

      <span className={`relative z-10 flex items-center justify-center ${variant === "outline" ? "group-hover:text-black transition-colors duration-500" : ""}`}>
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
        ) : null}
        
        {children}

        {/* Optional animated arrow for calls to action */}
        {withArrow && !isLoading && (
          <span className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300">
            {variant === "outline" ? "➔" : "→"}
          </span>
        )}
      </span>
    </motion.button>
  );
}