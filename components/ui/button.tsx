import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-outfit font-600 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none",
          // Sizes
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2.5 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          // Variants
          variant === "primary" &&
            "bg-gradient-to-r from-[#FF4D00] to-[#ff6a20] text-white hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,77,0,0.4)] active:translate-y-0",
          variant === "secondary" &&
            "bg-[#12121a] border border-white/10 text-[#F0F0F5] hover:border-white/20 hover:-translate-y-0.5 hover:bg-white/5 active:translate-y-0",
          variant === "ghost" &&
            "text-[#6B6B7E] hover:text-[#F0F0F5] hover:bg-white/5",
          variant === "danger" &&
            "bg-[#FF3B5C]/10 border border-[#FF3B5C]/30 text-[#FF3B5C] hover:bg-[#FF3B5C]/20 hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
