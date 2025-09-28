import { Navigate } from 'react-router-dom';
import LoginForm from '../../components/auth/login/LoginForm';
import Logo from '../../components/common/Logo';
import { useUserStore } from '../../utils/stores/user.store';

export default function Login() {
    const isAuthenticated = useUserStore(state => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }
    return (
        <div className="bg-gray-100 gap-2 font-montserrat h-screen flex flex-col justify-center items-center">
            <Logo />
            <p className="text-3xl font-semibold text-gray-700">
                Sign in to your account
            </p>
            <p className="mb-6 font-medium text-gray-500">
                Welcome back to Tallam Dashboard
            </p>
            <LoginForm />
            <p className="text-xs text-gray-500 text-center mt-4">
                © {new Date().getFullYear()} NDS Development Solutions. All
                rights reserved.
            </p>
        </div>
    );
}
