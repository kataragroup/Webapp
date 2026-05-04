import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';

export default function Ratings() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6 text-white text-center">
      <button onClick={() => navigate(-1)} className="mb-12 p-3 bg-white/5 rounded-2xl w-fit">
        <ArrowLeft size={24} />
      </button>
      <div className="max-w-md mx-auto space-y-8">
        <Star size={48} className="text-orange-500 fill-orange-500 mx-auto" />
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Your Feedback</h1>
        <div className="text-6xl font-black italic">4.92</div>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Protocol Rating</p>
      </div>
    </div>
  );
}
