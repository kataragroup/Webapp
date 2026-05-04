import React from 'react';
import { Card } from '../ui/Card';
import { CreditCard, Star, FileText, Info, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickLinkItem {
  label: string;
  icon: LucideIcon;
  path: string;
  color: string;
  bg: string;
}

interface QuickLinksProps {
  links?: QuickLinkItem[];
}

const defaultLinks: QuickLinkItem[] = [
  { label: 'My Bank', icon: CreditCard, path: '/driver/bank', color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Ratings', icon: Star, path: '/driver/ratings', color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Documents', icon: FileText, path: '/driver/kyc', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Support', icon: Info, path: '/driver/support', color: 'text-purple-500', bg: 'bg-purple-50' },
];

export const QuickLinks: React.FC<QuickLinksProps> = ({ links = defaultLinks }) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 gap-4">
      {links.map((link) => (
        <Card
          key={link.label}
          onClick={() => navigate(link.path)}
          className="p-6 bg-zinc-50 border-zinc-100 flex flex-col items-center gap-3 cursor-pointer hover:bg-white hover:shadow-xl transition-all rounded-[32px]"
        >
          <div className={`p-3 rounded-2xl ${link.bg} ${link.color}`}>
            <link.icon size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {link.label}
          </span>
        </Card>
      ))}
    </div>
  );
};
