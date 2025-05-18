import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[hsl(var(--primary))]">404</h1>
        <p className="text-2xl font-semibold mt-4 mb-6">Page Not Found</p>
        <p className="text-[hsl(var(--muted-foreground))] mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary btn-lg"
        >
          <Home size={18} className="mr-2" />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;