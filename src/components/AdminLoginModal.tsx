import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, ShieldAlert, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

const VALID_PINS = ['1234', '7861'];

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setErrorMessage('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitClick = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
    setErrorMessage('');
  };

  const verifyPin = (enteredPin: string) => {
    if (VALID_PINS.includes(enteredPin)) {
      try {
        sessionStorage.setItem('sv_admin_auth', 'true');
      } catch {
        // ignore storage error
      }
      onAuthenticated();
      onClose();
    } else {
      setError(true);
      setErrorMessage('Incorrect PIN. Please try again.');
      setTimeout(() => {
        setPin('');
      }, 700);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      verifyPin(pin);
    } else {
      setError(true);
      setErrorMessage('Please enter a 4-digit PIN.');
    }
  };

  return (
    <div
      id="admin-login-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="admin-login-card"
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative animate-in zoom-in-95 duration-200"
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white p-6 relative">
          <button
            id="admin-login-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Authorized Personnel</span>
              </div>
              <h2 className="text-lg font-black text-white">Owner / Admin Portal</h2>
              <p className="text-xs text-slate-400 font-medium">Sri Vaikundam Men's PG</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <p className="text-xs text-slate-600 font-medium text-center mb-5">
            Enter your 4-digit management PIN to review incoming guest reservations and visit requests.
          </p>

          <form onSubmit={handleFormSubmit}>
            {/* Hidden actual input for keyboard accessibility */}
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val.length <= 4) {
                  setPin(val);
                  setError(false);
                  if (val.length === 4) {
                    verifyPin(val);
                  }
                }
              }}
              className="sr-only"
              autoFocus
            />

            {/* 4 Digit Visual Indicators */}
            <div
              onClick={() => inputRef.current?.focus()}
              className={`flex justify-center gap-3.5 mb-5 cursor-pointer ${
                error ? 'animate-shake' : ''
              }`}
            >
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pin.length > index;
                return (
                  <div
                    key={index}
                    className={`w-12 h-14 rounded-2xl flex items-center justify-center text-xl font-black font-mono transition-all border ${
                      isFilled
                        ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-sm scale-105'
                        : error
                        ? 'bg-rose-50 border-rose-400 text-rose-600'
                        : 'bg-stone-50 border-stone-200 text-slate-400'
                    }`}
                  >
                    {isFilled ? '•' : ''}
                  </div>
                );
              })}
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-in fade-in duration-150">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Numeric Keypad for fast touch on phones/tablets */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigitClick(digit)}
                  className="py-3 rounded-xl bg-stone-50 hover:bg-stone-100 active:bg-amber-100 text-slate-900 font-mono font-bold text-base border border-stone-200/80 transition-colors shadow-2xs cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-600 font-medium text-xs border border-stone-200 transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleDigitClick('0')}
                className="py-3 rounded-xl bg-stone-50 hover:bg-stone-100 active:bg-amber-100 text-slate-900 font-mono font-bold text-base border border-stone-200/80 transition-colors shadow-2xs cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs border border-stone-200 transition-colors cursor-pointer"
              >
                ⌫
              </button>
            </div>

            {/* Direct Submit Button */}
            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={pin.length < 4}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Unlock Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick PIN Hint */}
          <div className="mt-4 pt-3 border-t border-stone-100 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
              <KeyRound className="w-3 h-3 text-amber-600" />
              <span>Default PIN: <strong>1234</strong> or <strong>7861</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
