import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-[#6B6B7E] uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#F0F0F5] placeholder:text-[#6B6B7E] font-outfit",
            "focus:border-[#FF4D00]/50 focus:ring-1 focus:ring-[#FF4D00]/20 transition-colors duration-200",
            error && "border-[#FF3B5C]/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#FF3B5C]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-[#6B6B7E] uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#F0F0F5] placeholder:text-[#6B6B7E] font-outfit resize-none",
            "focus:border-[#FF4D00]/50 focus:ring-1 focus:ring-[#FF4D00]/20 transition-colors duration-200",
            error && "border-[#FF3B5C]/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#FF3B5C]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
