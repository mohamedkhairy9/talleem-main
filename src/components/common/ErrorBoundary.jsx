import React from 'react';
import { MdError, MdRefresh } from 'react-icons/md';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // تحديث الحالة عند حدوث خطأ
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // يمكنك هنا إرسال الخطأ إلى خدمة تتبع الأخطاء
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        // إعادة تحميل الصفحة إذا كان الخطأ خطيراً
        if (this.props.resetOnError) {
            window.location.reload();
        }
    };

    render() {
        if (this.state.hasError) {
            // يمكنك تخصيص واجهة الخطأ هنا
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-center mb-4">
                            <MdError className="text-6xl text-red-500" />
                        </div>
                        
                        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                            عذراً، حدث خطأ ما
                        </h1>
                        
                        <p className="text-center text-gray-600 mb-4">
                            نعتذر عن الإزعاج. حدث خطأ غير متوقع في التطبيق.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-4 p-4 bg-red-50 rounded border border-red-200">
                                <summary className="cursor-pointer font-semibold text-red-700 mb-2">
                                    تفاصيل الخطأ (Development Mode)
                                </summary>
                                <div className="text-sm text-red-600 space-y-2">
                                    <p className="font-mono bg-white p-2 rounded">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <pre className="bg-white p-2 rounded overflow-auto text-xs">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    )}
                                </div>
                            </details>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                <MdRefresh className="text-xl" />
                                <span>إعادة المحاولة</span>
                            </button>
                            
                            <button
                                onClick={() => window.location.href = '/'}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                العودة للرئيسية
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

