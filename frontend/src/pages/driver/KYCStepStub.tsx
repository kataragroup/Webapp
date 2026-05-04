import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function GenericDriverStep({ title = "Step Detail" }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6 text-white">
      <button onClick={() => navigate(-1)} className="mb-12 p-3 bg-white/5 rounded-2xl w-fit">
        <ArrowLeft size={24} />
      </button>
      <div className="max-w-md mx-auto space-y-12 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 text-orange-500">
            <FileText size={48} />
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">{title}</h1>
          </div>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Upload original documents for validation</p>
        </div>
        <div className="aspect-video bg-[#1a1a1a] rounded-[40px] border-4 border-dashed border-white/5 flex items-center justify-center cursor-pointer hover:border-orange-500/20 transition-all">
          <p className="font-bold text-gray-500">Tap to upload / scan</p>
        </div>
        <Button onClick={() => navigate('/driver/kyc')} className="w-full">Continue Process</Button>
      </div>
    </div>
  );
}
