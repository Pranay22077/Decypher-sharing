import { useEffect } from "react";
import { X } from "./icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}

export default function SlideOver({ isOpen, onClose, title, children, width = "max-w-4xl" }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease" }}
      />
      
      {/* Panel */}
      <div 
        className={`relative w-full ${width} bg-[var(--color-base-bg)] shadow-2xl flex flex-col h-full border-l border-[var(--color-border-subtle)]`}
        style={{ animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>

        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">{title}</h2>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        {!title && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-6 z-10 p-2 rounded-full bg-[rgba(0,0,0,0.5)] backdrop-blur-md text-white hover:bg-[var(--color-primary)] transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {children}
        </div>
      </div>
    </div>
  );
}
