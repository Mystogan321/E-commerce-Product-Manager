import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
  duration: number;
  onClose: () => void;
}

const Notification = ({ message, duration, onClose }: NotificationProps) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.max(0, prev - (100 / (duration / 50))));
    }, 50);

    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return visible ? (
    <div className="fixed top-4 right-4 z-[9999] bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded-md flex items-start space-x-3 shadow-lg animate-slide-in-right min-w-[300px]">
      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium text-base">{message}</p>
        <p className="text-sm text-green-600 mt-1">View cart to checkout</p>
        <div className="mt-2 h-1 bg-green-100 rounded-full">
          <div 
            className="h-full bg-green-400 rounded-full transition-all duration-50 ease-linear" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  ) : null;
};

export default Notification; 