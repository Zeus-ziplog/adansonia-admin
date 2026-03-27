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
      // This saves the data as a JSON string in localStorage as your app expects.
      onSuccess(token, email, avatar);
      
      // 3. Clean transition to the dashboard
      navigate('/dashboard');
    } else {
      // 4. Fallback if the URL was tampered with or the handshake failed
      console.error("Authentication failed: Required parameters missing from callback URL.");
      navigate('/login?error=auth_incomplete');
    }
  }, [searchParams, navigate, onSuccess]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#0f172a] text-white">
      <div className="text-center">
        {/* Adansonia Branded Spinner */}
        <div className="mb-6 flex justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-500 border-t-transparent shadow-lg"></div>
        </div>
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Securing Session</h2>
        <p className="text-slate-400 font-medium">Verifying your administrator status...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;