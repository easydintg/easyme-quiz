import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle2, BarChart3 } from 'lucide-react';

const steps = [
  'Анализ введённых данных',
  'Расчёт базового метаболизма',
  'Определение дефицита калорий',
  'Расчёт макронутриентов',
  'Подбор программы тренировок',
  'Формирование персонального плана',
];

export function Loading() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    const timeout = setTimeout(() => {
      navigate('/results');
    }, steps.length * 600 + 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">EasyME</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-5 md:px-6 py-8 sm:py-12 md:py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 w-full"
        >
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
              Создаём ваш персональный план
            </h2>
            <p className="text-gray-600">
              Анализируем данные и формируем рекомендации
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: index <= currentStep ? 1 : 0.4,
                  x: 0
                }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className={`flex-shrink-0 ${
                  index < currentStep 
                    ? 'text-green-600' 
                    : index === currentStep 
                    ? 'text-blue-600' 
                    : 'text-gray-300'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      {index === currentStep && (
                        <motion.div
                          className="w-3 h-3 bg-current rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className={`flex-1 font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-600">
                {currentStep + 1} из {steps.length}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
