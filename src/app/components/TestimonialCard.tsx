import { Star } from 'lucide-react';
import { motion } from 'motion/react';

interface TestimonialCardProps {
  name: string;
  age: number;
  result: string;
  quote: string;
  details?: string;
  variant?: 'default' | 'compact';
}

export function TestimonialCard({ 
  name, 
  age, 
  result, 
  quote, 
  details,
  variant = 'default' 
}: TestimonialCardProps) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400 text-[10px]">
            Фото
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 text-sm">{name}, {age} лет</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-700 mb-2 leading-relaxed">
              {quote}
            </p>
            <div className="text-[#9CA986] font-semibold text-xs">
              {result}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
          Фото
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">{name}, {age} лет</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <p className="text-gray-700 text-sm mb-3 leading-relaxed">
            {quote}
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="text-[#9CA986] font-semibold">{result}</span>
            {details && <span className="text-gray-500">• {details}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
