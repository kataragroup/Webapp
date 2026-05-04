import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Headphones } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function Support() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6 text-white text-center">
      <button onClick={() => navigate(-1)} className="mb-12 p-3 bg-white/5 rounded-2xl w-fit">
        <ArrowLeft size={24} />
      </button>
      <div className="max-w-md mx-auto space-y-8">
        <Headphones size={48} className="text-orange-500 mx-auto" />
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Support Protocol</h1>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Connect with system command</p>
        <Button className="w-full">Live Chat</Button>
        <Button variant="outline" className="w-full">Emergency Link</Button>
      </div>
    </div>
  );
}
