import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullPage?: boolean;
}

const ErrorPage = ({ 
  title = '앗! 무엇인가 잘못되었어요.',
  message = 'We encountered an error while processing your request.',
  onRetry,
  fullPage = true
}: ErrorPageProps) => {
  const containerClasses = fullPage 
    ? 'min-h-screen flex items-center justify-center p-4 bg-gray-50'
    : 'w-full py-8 px-4';

  return (
    <div className={containerClasses}>
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 text-red-500 mb-4">
          <AlertTriangle className="h-8 w-8" />
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;