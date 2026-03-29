import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface AuthSuccessProps {
  onSuccess: (token: string, email: string, avatar?: string) => void;
}

const AuthSuccess = ({ onSuccess }: AuthSuccessProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Extract the parameters sent from the backend redirect
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const avatar = searchParams.get('avatar') || undefined;

    if (token && email) {
      // 2. Trigger the handleLoginSuccess logic from App.tsx
      onSuccess(token, email, avatar);
      
      // 3. Clean transition to the dashboard
      // { replace: true } ensures they can't "Go Back" to this loading page
      navigate('/dashboard', { replace: true });
    } else {
      // 4. Fallback if the URL was tampered with or the handshake failed
      console.error("Authentication failed: Required parameters missing from callback URL.");
      navigate('/login?error=auth_incomplete', { replace: true });
    }
  }, [searchParams, navigate, onSuccess]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#0f172a] text-white">
      <div className="text-center">
        {/* Adansonia Branded Spinner */}
        <div className="mb-6 flex justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#00A36C] border-t-transparent shadow-lg"></div>
        </div>
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Securing Session</h2>
        <p className="text-slate-400 font-medium">Verifying your administrator status...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;