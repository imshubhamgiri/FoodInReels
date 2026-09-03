import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({
  isOpen = true,
  onClose,
  title = "Sign in to Continue",
  description = "Log in to view reels, like your favorite dishes, and place orders",
  _userType
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    if (onClose) onClose();
    navigate(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={() => {
        if (onClose) onClose();
      }}
    >
      <div
        className="relative max-w-sm w-full mx-4 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glassmorphism background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        {/* Close Button if onClose is provided */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="relative z-10 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {title}
            </h2>
            <p className="text-gray-200 text-sm">
              {description}
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleNavigate('/user/login')}
              className="w-full px-4 py-3 rounded-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >
              User Login
            </button>

            <button
              onClick={() => handleNavigate('/partner/login')}
              className="w-full px-4 py-3 rounded-full border-2 border-white/30 hover:border-white/50 text-white font-semibold transition-all duration-200 hover:bg-white/10 cursor-pointer"
            >
              Partner Login
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-gray-300 text-xs">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-gray-200 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => handleNavigate('/user/register')}
              className="text-blue-400 hover:text-blue-300 font-semibold underline cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
