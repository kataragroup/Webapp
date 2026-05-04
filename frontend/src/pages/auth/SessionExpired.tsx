import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function SessionExpired() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-500/20 p-6 rounded-full mb-6">
        <ShieldAlert size={48} className="text-red-500" />
      </div>
      <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Session Expired</h1>
      <p className="text-gray-500 mb-8 max-w-xs">Your security protocol has timed out. Please authenticate again to continue.</p>
      <Button onClick={() => navigate('/login')} className="w-full max-w-xs">
        Return to Login
      </Button>
    </div>
  );
}
