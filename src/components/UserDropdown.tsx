import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

interface UserDropdownProps {
  user: {
    name: string;
  };
}

const UserDropdown = ({ user }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-[1000]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-800/30 dark:hover:bg-indigo-800/40 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="font-medium uppercase text-indigo-600 dark:text-indigo-300">
          {user.name.charAt(0)}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl dark:bg-gray-800 border dark:border-gray-700 z-[1000]">
          <div className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 border-b dark:border-gray-700">
            {user.name}
          </div>
          <div className="p-1">
            <button
              onClick={() => {
                dispatch(logout());
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-left rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown; 