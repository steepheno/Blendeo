import React from 'react';

interface ErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  const handleGoHome = () => {
    // 실제 구현 시에는 라우터의 navigate 함수나 window.location을 사용하시면 됩니다
    console.log('Go home clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{message}</p>
        </div>
        
        <button 
          onClick={handleGoHome}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </button>

        <div className="text-sm text-gray-500">
          <p>문제가 지속되면 관리자에게 문의해주세요</p>
          <p className="mt-1">support@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;