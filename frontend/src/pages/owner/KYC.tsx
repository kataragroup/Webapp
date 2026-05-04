import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Camera, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  Upload,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function OwnerKYC() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: 'Identity', icon: ShieldCheck, items: ['Aadhaar Card (Front)', 'Aadhaar Card (Back)', 'PAN Card (Front)', 'PAN Card (Back)'] },
    { title: 'Proof of Residence', icon: FileText, items: ['Light Bill (Own House)', 'Rent Agreement + Light Bill (Tenant)'] },
    { title: 'Bank Details', icon: CreditCard, items: ['Bank Passbook / Cancel Cheque'] },
    { title: 'Verification', icon: Camera, items: ['Live Selfie'] }
  ];

  const handleFinish = () => {
    navigate('/owner');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/owner')}
          className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">Fleet Verification</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Document Portal</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= activeStep ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-white/5'
            }`}
          />
        ))}
      </div>

      <motion.div
        key={activeStep}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4 mb-2">
          {(() => {
            const Icon = steps[activeStep].icon;
            return <Icon size={24} className="text-orange-500" />;
          })()}
          <h2 className="text-xl font-black italic">{steps[activeStep].title}</h2>
        </div>

        <div className="grid gap-4">
          {steps[activeStep].items.map((item, i) => (
            <Card key={i} className="p-6 bg-white/5 border-white/5 rounded-[32px] group hover:border-orange-500/20 transition-all active:scale-[0.98]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                    <Upload size={20} className="text-zinc-500 group-hover:text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight">{item}</h3>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">Ready for upload</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-black">{i + 1}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {activeStep === steps.length - 1 && (
          <Card className="p-6 bg-blue-600/10 border-blue-500/20 rounded-[32px]">
            <div className="flex gap-4">
              <AlertCircle className="text-blue-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-blue-400 italic">Pre-submission Check</h4>
                <p className="text-xs text-blue-400/60 mt-1">Ensure all photos are clearly visible with readable details to avoid rejection.</p>
              </div>
            </div>
          </Card>
        )}
      </motion.div>

      <div className="fixed bottom-8 left-6 right-6">
        <Button 
          className="w-full h-16 rounded-[24px] uppercase font-black tracking-widest text-xs" 
          variant="primary"
          onClick={() => activeStep < steps.length - 1 ? setActiveStep(prev => prev + 1) : handleFinish()}
        >
          {activeStep < steps.length - 1 ? 'Next Phase' : 'Submit Dossier'}
        </Button>
      </div>
    </div>
  );
}
