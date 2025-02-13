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
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <span className="font-medium uppercase">
          {user.name.charAt(0)}
        </span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 dark:bg-gray-800 z-[1000]">
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
            {user.name}
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown; 