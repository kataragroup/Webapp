import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface CancelRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isCancelling: boolean;
}

export const CancelRideModal = ({ isOpen, onClose, onConfirm, isCancelling }: CancelRideModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
          >
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Cancel Ride?</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Are you sure you want to cancel your current ride? This action cannot be undone.
                </p>
              </div>

              <div className="w-full flex flex-col gap-3 mt-4">
                <Button 
                  onClick={onConfirm}
                  disabled={isCancelling}
                  className="w-full h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-lg"
                >
                  {isCancelling ? 'Processing...' : 'Yes, Cancel Ride'}
                </Button>
                <Button 
                  onClick={onClose}
                  disabled={isCancelling}
                  variant="ghost"
                  className="w-full h-12 rounded-xl text-white/40 hover:text-white"
                >
                  No, Go Back
                </Button>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
