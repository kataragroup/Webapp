import React from 'react';
import { Logo } from '../Logo';
import { Facebook, Twitter, Instagram, Github, Mail, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-white/5 bg-black/20 backdrop-blur-3xl pt-16 pb-12 px-6">
      <div className="container mx-auto lg:max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <Logo size="sm" />
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-relaxed max-w-xs font-mono">
              The next generation of modular urban transit. Synchronizing pilots and clients across the global infrastructure node.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-[#00E054] hover:border-[#00E054]/30 transition-all shadow-xl"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[9px] font-black text-[#00E054] uppercase tracking-[0.4em] font-mono italic">Protocol</h4>
            <ul className="space-y-3">
              {['Dashboard', 'History', 'Wallet', 'Identity'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] font-mono italic">Support</h4>
            <ul className="space-y-3">
              {['Feedback', 'Security', 'Compliance', 'Terminal'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status Column */}
          <div className="md:col-span-4 bg-white/5 border border-white/5 rounded-[32px] p-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono">Network Core Status</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00E054] shadow-[0_0_8px_rgba(0,224,84,0.8)]" />
                <span className="text-[8px] font-black text-[#00E054] uppercase">Operational</span>
              </div>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Shield size={20} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">End-to-End Encryption</p>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest font-mono">Protocol V.2.8.4 Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
          <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em] font-mono italic">
            © 2026 GO-YATREE INFRASTRUCTURE. ALL SEQUENCES RESERVED.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[8px] font-black text-white/20 uppercase tracking-widest hover:text-[#00E054] transition-colors">Privacy Protocol</a>
            <a href="#" className="text-[8px] font-black text-white/20 uppercase tracking-widest hover:text-[#00E054] transition-colors">Terminals of Service</a>
            <a href="#" className="text-[8px] font-black text-white/20 uppercase tracking-widest hover:text-[#00E054] transition-colors">ID Node Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
