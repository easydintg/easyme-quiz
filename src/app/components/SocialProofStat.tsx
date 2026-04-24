import { motion } from 'motion/react';
import { Users } from 'lucide-react';

interface SocialProofStatProps {
  percentage: number;
  text: string;
  variant?: 'default' | 'inline';
}

export function SocialProofStat({ percentage, text, variant = 'default' }: SocialProofStatProps) {
  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100"
      >
        <Users className="w-4 h-4 text-[#9CA986]" />
        <span className="text-sm text-gray-700">
          <span className="font-bold text-[#9CA986]">{percentage}%</span> {text}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#9CA986] rounded-full flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-3xl font-bold text-[#9CA986] mb-1 text-left">{percentage}%</div>
          <p className="text-sm text-gray-700">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}
