import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Camera, Calendar, Heart, Target, BarChart3, Sparkles, Star, Zap, TrendingUp, Search, HelpCircle, Moon, Activity, FileText, CheckCircle } from 'lucide-react';
import logo from 'figma:asset/15026009c8c482650b861dfa3b38035558e9dec0.png';
import clubPhoto from '../../imports/2026-03-31_17.45.28.jpg';
import alexandraTransformation from '../../imports/Снимок_экрана_2026-03-25_в_14.10.45.png';
import svetlanaTransformation from '../../imports/Снимок_экрана_2026-04-24_в_20.25.37_1.png';
import { SimpleCarousel } from '../components/SimpleCarousel';
import { TestimonialCard } from '../components/TestimonialCard';
import { SocialProofStat } from '../components/SocialProofStat';
import { PopupQuestions } from '../components/PopupQuestions';

// Lazy load heavy components
const YoYoDietChart = lazy(() => import('../components/YoYoDietChart').then(module => ({ default: module.YoYoDietChart })));

interface QuizData {
  goalType: string;
  hasChildren: string;
  onMaternityLeave: string;
  age: string;
  currentWeight: string;
  targetWeight: string;
  height: string;
  activity: string;
  goal: string;
  timeframe: string;
  healthIssues: string[];
  name: string;
  desiredFeelings: string[];
  needsPlan: string;
  weightAffectsConfidence: string;
  procrastinating: string;
  preferredTime: string;
  startGoal: string;
  physicalLimitations: string;
  dietaryRestrictions: string;
  eatingPreference: string;
  motivationChanges: string;
  readinessLevel: string;
  weightLossThinking: string;
  emotionalComfort: string;
  dietCycles: string;
  peopleMayInterfere: string;
  multitaskingWhileEating: string;
  finishingPlate: string;
  failureFeeling: string;
  interestsToExplore: string[];
  changesPace: string;
  additionalGoals: string[];
  weighingTime: string;
  recentFoods: string[];
  cravings: string[];
  wouldEatFoods: string[];
  familyHealthHistory: string;
  regularMealTimes: string;
  dayActivity: string;
  weeksToGoal?: number;
  targetDateTimestamp?: number;
  optimizedTargetDateTimestamp?: number;
}

const initialData: QuizData = {
  goalType: '',
  hasChildren: '',
  onMaternityLeave: '',
  age: '',
  currentWeight: '',
  targetWeight: '',
  height: '',
  activity: '',
  goal: '',
  timeframe: '',
  healthIssues: [],
  name: '',
  desiredFeelings: [],
  needsPlan: '',
  weightAffectsConfidence: '',
  procrastinating: '',
  preferredTime: '',
  startGoal: '',
  physicalLimitations: '',
  dietaryRestrictions: '',
  eatingPreference: '',
  motivationChanges: '',
  readinessLevel: '',
  weightLossThinking: '',
  emotionalComfort: '',
  dietCycles: '',
  peopleMayInterfere: '',
  multitaskingWhileEating: '',
  finishingPlate: '',
  failureFeeling: '',
  interestsToExplore: [],
  changesPace: '',
  additionalGoals: [],
  weighingTime: '',
  recentFoods: [],
  cravings: [],
  wouldEatFoods: [],
  familyHealthHistory: '',
  regularMealTimes: '',
  dayActivity: '',
};

// Define categories and their steps
const categories = [
  { name: 'Цель', steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { name: 'Психология и привычки', steps: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28] },
  { name: 'Питание и физическая активность', steps: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
  { name: 'План', steps: [] },
];

export function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuizData>(initialData);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [planCompleted, setPlanCompleted] = useState(false);
  const totalSteps = 50;

  // Animate loading progress for Step 12 and Step 49
  useEffect(() => {
    if (step === 12 || step === 49) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Auto-advance from Step 28 after animation completes
  useEffect(() => {
    if (step === 28) {
      setPlanCompleted(false); // Reset when entering step 28
    }
    
    if (step === 28 && planCompleted) {
      const timer = setTimeout(() => {
        setStep(29);
        setPlanCompleted(false);
      }, 1500); // Wait 1.5 seconds after showing "План собран!"
      return () => clearTimeout(timer);
    }
  }, [step, planCompleted]);

  // Get current category based on step
  const getCurrentCategory = () => {
    return categories.findIndex(cat => cat.steps.includes(step));
  };

  const getCategoryProgress = (categoryIndex: number) => {
    const category = categories[categoryIndex];
    const currentCategoryIndex = getCurrentCategory();
    
    if (categoryIndex < currentCategoryIndex) return 100;
    if (categoryIndex > currentCategoryIndex) return 0;
    
    // Calculate progress within current category
    const stepsInCategory = category.steps.length;
    const currentStepInCategory = category.steps.indexOf(step) + 1;
    return (currentStepInCategory / stepsInCategory) * 100;
  };

  const handleNext = () => {
    console.log('=== HANDLE NEXT === Step:', step, 'Data:', data);
    
    // Save optimized target date when leaving Step 50
    if (step === 50) {
      const currentWeight = Number(data.currentWeight) || 75;
      const targetWeight = Number(data.targetWeight) || 65;
      const originalWeeksEstimate = data.weeksToGoal || Math.ceil((currentWeight - targetWeight) / 1.95);
      
      // Calculate optimized date (minus 7 days)
      const originalTargetDate = data.targetDateTimestamp 
        ? new Date(data.targetDateTimestamp) 
        : new Date(Date.now() + originalWeeksEstimate * 7 * 24 * 60 * 60 * 1000);
      
      const optimizedTargetDate = new Date(originalTargetDate);
      optimizedTargetDate.setDate(optimizedTargetDate.getDate() - 7);
      
      setData({ ...data, optimizedTargetDateTimestamp: optimizedTargetDate.getTime() });
      
      // Save to localStorage with optimized date
      localStorage.setItem('quizData', JSON.stringify({ 
        ...data, 
        optimizedTargetDateTimestamp: optimizedTargetDate.getTime() 
      }));
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      localStorage.setItem('quizData', JSON.stringify(data));
      navigate('/plan');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.goalType !== '';
      case 2: return true; // Social proof - always can proceed
      case 3: return data.hasChildren !== '';
      case 4: return data.onMaternityLeave !== '';
      case 5: return true; // Club introduction - always can proceed
      case 6: return true; // Age - always can proceed
      case 7: return data.currentWeight !== '' && data.height !== ''
      case 8: return data.targetWeight !== '' && Number(data.targetWeight) < Number(data.currentWeight); // Must be less than current
      case 9: return true; // Why it works explanation - always can proceed
      case 10: return true; // Health issues - always can proceed (optional selection)
      case 11: return true; // Thank you message - always can proceed
      case 12: return true; // Testimonials carousel - always can proceed
      case 13: return data.activity !== '';
      case 14: return true; // Weight loss results - always can proceed
      case 15: return data.name.trim() !== '';
      case 16: return true; // Information message - always can proceed
      case 17: return true; // Desired feelings - always can proceed (optional selection)
      case 18: return data.needsPlan !== '';
      case 19: return true; // Information - always can proceed
      case 20: return data.weightAffectsConfidence !== '';
      case 21: return data.procrastinating !== '';
      case 22: return true; // Information - always can proceed
      case 23: return data.preferredTime !== '';
      case 24: return data.startGoal !== '';
      case 25: return data.physicalLimitations !== '';
      case 26: return data.dietaryRestrictions !== '';
      case 27: return data.eatingPreference !== '';
      case 28: return true; // Final loading screen - always can proceed
      case 29: return true; // You are not alone message - always can proceed
      case 30: return data.motivationChanges !== '';
      case 31: return data.readinessLevel !== '';
      case 32: return data.weightLossThinking !== '';
      case 33: return data.emotionalComfort !== '';
      case 34: return data.dietCycles !== '';
      case 35: return true; // Step by step message - always can proceed
      case 36: return data.peopleMayInterfere !== '';
      case 37: return data.multitaskingWhileEating !== '';
      case 38: return data.finishingPlate !== '';
      case 39: return data.failureFeeling !== '';
      case 40: return true; // Interests to explore - always can proceed (optional selection)
      case 41: return data.changesPace !== '';
      case 42: return true; // Goal without plan message - always can proceed
      case 43: return true; // Additional goals - always can proceed (optional selection)
      case 44: return data.weighingTime !== '';
      case 45: return true; // Recent foods - always can proceed (optional selection)
      case 46: return true; // Cravings - always can proceed (optional selection)
      case 47: return true; // Would eat foods - always can proceed (optional selection)
      case 48: return true; // Almost ready message - always can proceed
      case 49: return data.familyHealthHistory !== '' && data.regularMealTimes !== '' && data.dayActivity !== '';
      case 50: return true; // Final results with graph - always can proceed
      default: return false;
    }
  };

  // Calculate recommended weight range based on height using BMI
  const getRecommendedWeight = () => {
    if (!data.height) return null;
    const heightInMeters = Number(data.height) / 100;
    const minBMI = 18.5;
    const maxBMI = 24.9;
    const minWeight = Math.round(minBMI * heightInMeters * heightInMeters);
    const maxWeight = Math.round(maxBMI * heightInMeters * heightInMeters);
    return { min: minWeight, max: maxWeight };
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="EasyME Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-semibold text-[#9CA986]">EasyME</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-6">
        {/* Custom Progress Bar with 3 Categories */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200" style={{ marginLeft: '5%', marginRight: '5%' }} />
            
            {/* Category Circles and Labels */}
            <div className="relative flex justify-between items-start">
              {categories.map((category, index) => {
                const currentCategoryIndex = getCurrentCategory();
                const isActive = index === currentCategoryIndex;
                const isCompleted = index < currentCategoryIndex;
                const progress = getCategoryProgress(index);
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    {/* Progress Line Segment */}
                    {index > 0 && (
                      <div className="absolute top-6 h-1" style={{
                        left: `${(index - 1) * 50 + 5}%`,
                        width: '40%',
                      }}>
                        <motion.div
                          className="h-full bg-[#9CA986]"
                          initial={{ width: 0 }}
                          animate={{ width: `${getCategoryProgress(index - 1)}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                    
                    {/* Circle */}
                    <div className="relative z-10 mb-2 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                        isCompleted || isActive
                          ? 'bg-[#9CA986] border-[#9CA986]'
                          : 'bg-white border-gray-300'
                      }`}>
                        {isCompleted ? (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className={`text-sm sm:text-base font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Label */}
                    <span className={`text-xs sm:text-sm font-medium text-center px-1 ${
                      isActive ? 'text-[#9CA986]' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {category.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-6 mb-3 sm:mb-4"
          >
            {/* Step 1: Goal Type */}
            {step === 1 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Какая у вас цель сейчас?
                </h2>
                <p className="text-xs sm:text-sm md:text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                  Выберите то, что лучше всего описывает вашу текущую цель
                </p>
                <div className="space-y-2 sm:space-y-1.5 sm:space-y-2 md:space-y-3 max-w-2xl">
                  {[
                    { value: '1-10kg', label: 'Похудеть на 1–10 кг и закрепить результат' },
                    { value: '11-20kg', label: 'Похудеть на 11–20 кг' },
                    { value: '20kg-plus', label: 'Похудеть более чем на 20 кг' },
                    { value: 'tone', label: 'Подтянуть тело и убрать живот' },
                    { value: 'unsure', label: 'Пока не уверена, но хочу начать' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setData({ ...data, goalType: option.value });
                        setTimeout(() => handleNext(), 300);
                      }}
                      className={`w-full p-2.5 sm:p-3 md:p-4 rounded-lg border-2 transition-all text-left text-xs sm:text-sm md:text-base font-medium ${
                        data.goalType === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Social Proof */}
            {step === 2 && (
              <div className="text-center max-w-2xl mx-auto">
                <div className="mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-[#9CA986]/10 border-2 border-[#9CA986]/30 rounded-2xl"
                  >
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-16 h-16 bg-[#9CA986] rounded-full flex items-center justify-center">
                        <ArrowRight className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3">
                          87% участниц начинали с той же цели
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6">
                          и уже увидели результат в первые 3-5 дней
                        </p>
                      </div>
                      
                      {/* Transformation Photo */}
                      <div className="w-full max-w-lg">
                        <img 
                          src={alexandraTransformation} 
                          alt="Результат трансформации участницы" 
                          className="w-full rounded-xl shadow-lg mb-4"
                        />
                        <div className="text-left space-y-2 px-4">
                          <p className="text-sm text-gray-700 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-[#9CA986]" />
                            <span className="font-semibold">До и после:</span> Александра - участница клуба EasyME
                          </p>
                          <p className="text-sm text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#9CA986]" />
                            <span className="font-semibold">Период:</span> 3 месяца тренировок по 15-20 минут
                          </p>
                          <p className="text-xs text-gray-500 italic mt-3 pt-3 border-t border-gray-300">
                            * Все фото опубликованы с согласия участниц. Результаты индивидуальны и зависят от множества факторов.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Step 3: Has Children */}
            {step === 3 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  У вас есть дети?
                </h2>
                <p className="text-xs sm:text-sm md:text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                  Это поможет нам подобрать подходящий формат тренировок
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  {[
                    { value: 'yes', label: 'Да' },
                    { value: 'no', label: 'Нет' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setData({ ...data, hasChildren: option.value });
                        setTimeout(() => handleNext(), 300);
                      }}
                      className={`p-6 rounded-lg border-2 transition-all font-medium ${
                        data.hasChildren === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: On Maternity Leave */}
            {step === 4 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Вы в декрете?
                </h2>
                <p className="text-xs sm:text-sm md:text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                  Адаптируем план под ваш распорядок дня
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  {[
                    { value: 'yes', label: 'Да' },
                    { value: 'no', label: 'Нет' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setData({ ...data, onMaternityLeave: option.value });
                        setTimeout(() => handleNext(), 300);
                      }}
                      className={`p-6 rounded-lg border-2 transition-all font-medium ${
                        data.onMaternityLeave === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Club Introduction */}
            {step === 5 && (
              <div className="text-center">
                <div className="mb-8">
                  {/* Placeholder for image */}
                  <img 
                    src={clubPhoto} 
                    alt="Женский клуб EasyME - короткие тренировки по 15-20 минут" 
                    className="w-full h-64 sm:h-80 md:h-96 object-contain rounded-xl mb-6 bg-gradient-to-br from-[#9CA986]/10 to-[#9CA986]/5"
                    loading="lazy"
                  />
                  
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    Мы — женский клуб EasyME
                  </h2>
                  
                  <div className="space-y-2 sm:space-y-3 text-left max-w-xl mx-auto mb-8">
                    <div className="flex items-start gap-3">
                      <span className="text-[#9CA986] text-xl mt-1">—</span>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700">
                        короткие тренировки по 15–20 минут
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#9CA986] text-xl mt-1">—</span>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700">
                        без перегруза и диет
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#9CA986] text-xl mt-1">—</span>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700">
                        можно заниматься даже с ребёнком дома
                      </p>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg md:text-xl text-gray-900 font-semibold flex items-center justify-center gap-2">
                    Более 1,500 участниц уже с нами <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-500" />
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Age */}
            {step === 6 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Сколько вам лет?
                </h2>
                <p className="text-xs sm:text-sm md:text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                  Укаите ваш возраст
                </p>
                
                {/* Age Input Field */}
                <div className="max-w-sm">
                  <div className="relative">
                    <input
                      type="number"
                      value={data.age}
                      onChange={(e) => setData({ ...data, age: e.target.value })}
                      placeholder="25"
                      min="14"
                      max="120"
                      className="w-full p-4 pr-16 text-2xl border-2 border-gray-200 rounded-lg focus:border-[#9CA986] focus:outline-none transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                      лет
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Height and Current Weight */}
            {step === 7 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Ваш рост и текущий вес
                </h2>
                <p className="text-xs sm:text-sm md:text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                  Эти данные помогут рассчитать персональный план
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  {/* Height Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Рост
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={data.height}
                        onChange={(e) => setData({ ...data, height: e.target.value })}
                        placeholder="170"
                        min="140"
                        max="220"
                        className="w-full p-4 pr-12 text-2xl border-2 border-gray-200 rounded-lg focus:border-[#9CA986] focus:outline-none transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                        см
                      </span>
                    </div>
                  </div>

                  {/* Current Weight Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Текущий вес
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={data.currentWeight}
                        onChange={(e) => setData({ ...data, currentWeight: e.target.value })}
                        placeholder="75"
                        min="30"
                        max="200"
                        className="w-full p-4 pr-12 text-2xl border-2 border-gray-200 rounded-lg focus:border-[#9CA986] focus:outline-none transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                        кг
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Target Weight */}
            {step === 8 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Какой идеальный вес вы хотите достичь?
                </h2>
                <p className="text-gray-600 mb-4">
                  Укажите желаемый вес в килограммах
                </p>
                
                {/* Show current weight for reference */}
                {data.currentWeight && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      Ваш текущий вес: <span className="font-bold text-sm sm:text-base md:text-lg text-gray-900">{data.currentWeight} кг</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Укажите ниже вес, который вы хотите достичь (должен быть меньше текущего для похудения)
                    </p>
                  </div>
                )}
                
                <div className="max-w-md">
                  <div className="relative mb-6">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      🎯 Желаемый (целевой) вес
                    </label>
                    <input
                      type="number"
                      value={data.targetWeight}
                      onChange={(e) => {
                        console.log('Target weight input changed to:', e.target.value);
                        setData({ ...data, targetWeight: e.target.value });
                      }}
                      placeholder="65"
                      min="30"
                      max="200"
                      className="w-full p-4 pr-12 text-2xl border-2 border-gray-200 rounded-lg focus:border-[#9CA986] focus:outline-none transition-colors text-center"
                    />
                    <span className="absolute right-4 top-1/2 translate-y-1/2 text-gray-400 text-xl">
                      кг
                    </span>
                  </div>

                  {/* Warning if target weight is >= current weight */}
                  {data.targetWeight && data.currentWeight && Number(data.targetWeight) >= Number(data.currentWeight) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p className="text-sm text-red-700 font-semibold flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Внимание: Целевой вес ({data.targetWeight} кг) должен быть меньше текущего веса ({data.currentWeight} кг) для программы похудения
                      </p>
                    </motion.div>
                  )}

                  {/* Recommended Weight Range */}
                  {data.height && getRecommendedWeight() && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 text-center"
                    >
                      <p className="text-gray-600 text-sm mb-2">
                        Рекомендуемый диапазон:
                      </p>
                      <p className="text-xl font-semibold text-gray-900">
                        {getRecommendedWeight()!.min} кг – {getRecommendedWeight()!.max} кг
                      </p>
                    </motion.div>
                  )}

                  {/* Information Box */}
                  <div className="p-5 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-gray-700 leading-relaxed">На основе данных реальных результатов участниц нашего клуба вашего возраста мы рассчитаем, когда вы сможете достичь целевого веса, если будете следовать персональному плану. В среднем участницы вашего стартового веса снижают вес на 2–3 кг в неделю.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 9: Why it works explanation */}
            {step === 9 && (() => {
              // Data for the comparison chart
              const chartData = [
                { week: 0, chaotic: 75, smooth: 75 },
                { week: 2, chaotic: 73, smooth: 73.5 },
                { week: 4, chaotic: 76, smooth: 72 },
                { week: 6, chaotic: 72, smooth: 70.5 },
                { week: 8, chaotic: 75, smooth: 69 },
                { week: 10, chaotic: 74, smooth: 67.5 },
                { week: 12, chaotic: 73, smooth: 66 },
              ];

              return (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                    Почему раньше не получалось — и почему здесь получится
                  </h2>
                  
                  <div className="space-y-3 sm:space-y-4 md:space-y-5 text-left mb-8">
                    <div>
                      <p className="text-sm sm:text-base md:text-lg text-gray-900 mb-3"><span className="font-bold">Вы уже пробовали худеть.</span></p>
                      <div className="space-y-1 ml-4">
                        <p className="text-sm sm:text-base md:text-lg text-gray-700">— начинали</p>
                        <p className="text-sm sm:text-base md:text-lg text-gray-700">— держались несколько дней</p>
                        <p className="text-sm sm:text-base md:text-lg text-gray-700">— бросали</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm sm:text-base md:text-lg text-gray-900 font-semibold">И дело не в вас.</p>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700 mt-2">
                        Вам просто никто нормально не объяснял, ЧТО делать каждый день.
                      </p>
                    </div>

                    <div>
                      <p className="text-sm sm:text-base md:text-lg text-gray-900 font-semibold mb-3">Здесь всё по-другому:</p>
                      <div className="space-y-2">
                        <p className="text-sm sm:text-base md:text-lg text-gray-700 flex items-start gap-2"><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA986] flex-shrink-0 mt-0.5" /> вы попадаете в закрытый канал со своим индивидуальным планом</p>
                        <p className="text-sm sm:text-base md:text-lg text-gray-700 flex items-start gap-2"><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA986] flex-shrink-0 mt-0.5" /> на каждый день есть готовая тренировка (в записи)</p>
                        <p className="text-sm sm:text-base md:text-lg text-gray-700 flex items-start gap-2"><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA986] flex-shrink-0 mt-0.5" /> просто открываете и повторяете</p>
                      </div>
                      <div className="space-y-1 ml-4 mt-2">
                        <p className="text-xs sm:text-sm md:text-base text-gray-600">— без зала</p>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600">— без сложных программ</p>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600">— без «разберусь пото»</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm sm:text-base md:text-lg text-gray-900 font-semibold mb-3">Как проходят тренировки:</p>
                      <div className="space-y-1 ml-4">
                        <p className="text-xs sm:text-sm md:text-base text-gray-700">— длительность 15–20 минут</p>
                        <p className="text-xs sm:text-sm md:text-base text-gray-700">— можно делать дома</p>
                        <p className="text-xs sm:text-sm md:text-base text-gray-700">— показывают профессиональные тренеры и специалисты (вы просто повторяете)</p>
                      </div>
                      <div className="space-y-2 mt-3">
                        <p className="text-sm sm:text-base md:text-lg text-gray-700 flex items-start gap-2"><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA986] flex-shrink-0 mt-0.5" /> не нужно ничего придумывать</p>
                        <p className="text-sm sm:text-base md:text-lg text-gray-700 flex items-start gap-2"><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA986] flex-shrink-0 mt-0.5" /> не нужно разбираться</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm sm:text-base md:text-lg text-gray-900 font-semibold mb-2">Почему у большинства не получается:</p>
                      <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-2">они пытаются сразу:</p>
                      <div className="space-y-1 ml-4">
                        <p className="text-xs sm:text-sm md:text-base text-gray-700">— жесткие диеты</p>
                        <p className="text-xs sm:text-sm md:text-base text-gray-700">— долгие тренировки</p>
                        <p className="text-xs sm:text-sm md:text-base text-gray-700">— перегруз</p>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base text-gray-700 mt-2 ml-0">и в итоге бросают</p>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-gray-50 p-6 rounded-xl mb-8">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <defs>
                          <linearGradient id="chaoticGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                          </linearGradient>
                          <linearGradient id="smoothGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9CA986" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#9CA986" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid key="grid-step9" strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          key="xaxis-step9"
                          dataKey="week" 
                          label={{ value: 'Недели', position: 'insideBottom', offset: -10 }}
                          stroke="#6b7280"
                        />
                        <YAxis 
                          key="yaxis-step9"
                          domain={[60, 80]}
                          label={{ value: 'Вес (кг)', angle: -90, position: 'insideLeft' }}
                          stroke="#6b7280"
                        />
                        <Tooltip key="tooltip-step9" />
                        <Area 
                          key="area-chaotic"
                          type="monotone" 
                          dataKey="chaotic" 
                          stroke="#ef4444" 
                          strokeWidth={3}
                          fill="url(#chaoticGradient)"
                          name="Резкие диеты и спотзал"
                        />
                        <Area 
                          key="area-smooth"
                          type="monotone" 
                          dataKey="smooth" 
                          stroke="#9CA986" 
                          strokeWidth={3}
                          fill="url(#smoothGradient)"
                          name="Похудение «Лёгкостью»"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    
                    {/* Legend */}
                    <div className="flex justify-center gap-8 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-sm text-gray-700">Резкие диеты и другие программы</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#9CA986] rounded"></div>
                        <span className="text-sm text-gray-700">Похудение с EasyME</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Message */}
                  <div className="text-center bg-[#9CA986]/10 p-6 rounded-xl">
                    <p className="text-sm sm:text-base md:text-lg text-gray-900 mb-3 font-semibold">
                      В нашем плане вам не нужно «держаться»
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 flex items-center justify-center gap-2"><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA986] flex-shrink-0" /> вам нужно просто делать 15–20 минут в день</p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 flex items-center justify-center gap-2"><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA986] flex-shrink-0" /> и вы дойдете до результата</p>
                  </div>
                </div>
              );
            })()}

            {/* Step 10: Health Issues */}
            {step === 10 && (() => {
              const healthOptions = [
                'Повышенное артериальное давление',
                'Повышенный уровень холестерина',
                'Бессонница',
                'Остеоартроз',
                'Депрессия',
                'Другое',
                'Ничего из перечисленного',
              ];

              const toggleHealthIssue = (issue: string) => {
                const current = data.healthIssues;
                if (current.includes(issue)) {
                  setData({ ...data, healthIssues: current.filter(i => i !== issue) });
                } else {
                  setData({ ...data, healthIssues: [...current, issue] });
                }
              };

              return (
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    Есть ли у ва что-то из этого?
                  </h2>
                  <p className="text-xs sm:text-sm md:text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                    Выберите все подходящие варианты
                  </p>
                  <div className="space-y-1.5 sm:space-y-2 md:space-y-3 max-w-2xl">
                    {healthOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => toggleHealthIssue(option)}
                        className={`w-full p-2.5 sm:p-3 md:p-4 rounded-lg border-2 transition-all text-left font-medium ${
                          data.healthIssues.includes(option)
                            ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                            : 'border-gray-200 hover:border-gray-300 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            data.healthIssues.includes(option)
                              ? 'border-[#9CA986] bg-[#9CA986]'
                              : 'border-gray-300'
                          }`}>
                            {data.healthIssues.includes(option) && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Step 11: Thank You Message */}
            {step === 11 && (
              <div className="text-center max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 bg-[#9CA986]/10 border-2 border-[#9CA986]/30 rounded-2xl mb-6"
                >
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    Спасибо, что поделились.
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                    Снижение веса — важная цель. Но наша задача — ещё и помочь вам стать здоровой и счастливой.
                  </p>
                </motion.div>

                {/* СОЦИАЛЬНОЕ ДОКАЗАТЕЛЬСТВО: 87% участниц начинали с той же цели */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <SocialProofStat 
                    percentage={87} 
                    text="участниц начинали с той же цели, что и вы" 
                  />
                </motion.div>

                {/* ОТЗЫВ: релевантный к весу */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <TestimonialCard
                    name="Анна"
                    age={34}
                    result="-5 кг за 6 недель"
                    quote="Я тоже хотела сбросить вес. Думала, что это невозможно с моим графиком. Но программа подошла идеально — всего 15-20 минут в день!"
                  />
                </motion.div>
              </div>
            )}

            {/* Step 12: Loading with Testimonials */}
            {step === 12 && (() => {
              // Testimonials data
              const testimonials = [
                {
                  name: 'Светлана',
                  avatar: '',
                  beforeAfter: svetlanaTransformation,
                },
                {
                  name: 'Мария',
                  avatar: '',
                  beforeAfter: alexandraTransformation,
                },
                {
                  name: 'Елена',
                  avatar: '',
                  beforeAfter: alexandraTransformation,
                },
              ];

              return (
                <div className="max-w-4xl mx-auto -mt-4">
                  {/* Top Loading Bar */}
                  <div className="mb-8">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">
                      АНАЛИЗИРУЕМ ОТВЕТЫ...
                    </p>
                    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#9CA986] to-[#b8c9a0] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(loadingProgress, 100)}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <p className="text-right text-sm font-semibold text-[#9CA986] mt-2">
                      {Math.min(loadingProgress, 100)}%
                    </p>
                  </div>

                  <p className="text-center text-gray-500 mb-8">
                    Подождите немного...
                  </p>

                  {/* Main Heading */}
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8 text-left">
                    Мы помогли похудеть 874 девушкам твоего возраста
                  </h2>

                  {/* Testimonials Carousel */}
                  <div className="mb-8">
                    <SimpleCarousel showDots={true}>
                      {testimonials.map((testimonial, index) => (
                        <div key={index} className="space-y-3 sm:space-y-4 md:space-y-5">
                          {/* Profile */}
                          <div className="flex items-center gap-4">
                            {testimonial.avatar && (
                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-16 h-16 rounded-full object-cover"
                                loading="lazy"
                              />
                            )}
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                              <p className="text-gray-600 text-sm">Участница EasyME</p>
                            </div>
                          </div>

                          {/* Before/After Image */}
                          <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                            <img
                              src={testimonial.beforeAfter}
                              alt={`${testimonial.name} результат`}
                              className="w-full h-auto object-contain rounded-2xl"
                              loading="eager"
                              onError={(e) => {
                                console.error('Image failed to load:', testimonial.beforeAfter);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>

                          {/* Disclaimer */}
                          
                        </div>
                      ))}
                    </SimpleCarousel>
                  </div>

                  {/* Bottom Loading Bar */}
                  <div className="mt-12">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">
                      ГОТОВИМ РЕЗУЛЬТАТЫ...
                    </p>
                    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#9CA986] to-[#b8c9a0] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(loadingProgress, 100)}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <p className="text-right text-sm font-semibold text-[#9CA986] mt-2">
                      {Math.min(loadingProgress, 100)}%
                    </p>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-500 mb-4">Нажмите "Продолжить" ниже</p>
                  </div>
                </div>
              );
            })()}

            {/* Step 13: Activity */}
            {step === 13 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Уровень активности
                </h2>
                <p className="text-xs sm:text-sm md:text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                  Как часто вы занимаетесь физическими упражнениями?
                </p>
                <div className="space-y-1.5 sm:space-y-2 md:space-y-3 max-w-2xl">
                  {[
                    { value: 'sedentary', label: 'Малоактивный (сидячий образ жизни)' },
                    { value: 'lightly-active', label: 'Немного активный (легкие физические упражнения 1-3 раза в неделю)' },
                    { value: 'moderately-active', label: 'Умеренно активный (средние физические упражнения 3-5 раза в неделю)' },
                    { value: 'very-active', label: 'Очень активный (интенсивные физические упражнения 6-7 раз в неделю)' },
                    { value: 'super-active', label: 'Сверхактивный (физичские упражнения 2 раза в день)' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setData({ ...data, activity: option.value });
                        setTimeout(() => handleNext(), 300);
                      }}
                      className={`w-full p-2.5 sm:p-3 md:p-4 rounded-lg border-2 transition-all text-left font-medium ${
                        data.activity === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 14: Weight Loss Results */}
            {step === 14 && (() => {
              const currentWeight = Number(data.currentWeight) || 75;
              const targetWeight = Number(data.targetWeight) || 60;
              
              // DEBUG: Log the values to check
              console.log('Step 14 - Current Weight:', data.currentWeight, 'Parsed:', currentWeight);
              console.log('Step 14 - Target Weight:', data.targetWeight, 'Parsed:', targetWeight);
              console.log('Step 14 - All data:', data);
              
              const weightDifference = currentWeight - targetWeight;
              const weeklyLoss = 1.95; // Average of 1.7-2.2 kg per week
              const weeksToGoal = Math.ceil(weightDifference / weeklyLoss);
              
              // Calculate target date
              const today = new Date();
              const targetDate = new Date(today);
              targetDate.setDate(targetDate.getDate() + (weeksToGoal * 7));
              const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
              const targetDateStr = `${targetDate.getDate()} ${monthNames[targetDate.getMonth()]}`;

              // Save these calculations to data for use in later steps
              if (!data.weeksToGoal) {
                setData({ ...data, weeksToGoal, targetDateTimestamp: targetDate.getTime() });
              }

              // Generate chart data points
              const chartData = [];
              const numPoints = Math.min(weeksToGoal, 12); // Max 12 points on chart
              const interval = weeksToGoal / numPoints;
              
              for (let i = 0; i <= numPoints; i++) {
                const weekNum = Math.floor(i * interval);
                const weight = currentWeight - (weekNum * weeklyLoss);
                const adjustedWeight = Math.max(weight, targetWeight);
                const date = new Date(today);
                date.setDate(date.getDate() + (weekNum * 7));
                const dateStr = `${date.getDate()} ${monthNames[date.getMonth()].slice(0, 3)}.`;
                
                chartData.push({
                  week: dateStr,
                  weight: Number(adjustedWeight.toFixed(1))
                });
              }

              // Testimonial images - using local images
              const testimonialImages = [
                alexandraTransformation,
                svetlanaTransformation,
                clubPhoto,
                alexandraTransformation,
                svetlanaTransformation,
                clubPhoto,
                alexandraTransformation,
                svetlanaTransformation,
                clubPhoto,
                alexandraTransformation,
              ];

              return (
                <div className="max-w-4xl mx-auto -mt-4">
                  {/* Header */}
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide">
                    ПОСЛЕДНЯЯ ПРОГРАММА СНИЖЕНИЯ ВЕСА, КОТОРАЯ ВАМ ПОНАДОБИТСЯ
                  </p>

                  {/* Main Heading */}
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8">
                    Мы предполагаем, что вы будете
                  </h2>

                  {/* Target Weight and Date */}
                  <div className="mb-8">
                    <p className="text-5xl md:text-6xl font-bold text-gray-900">
                      {targetWeight} кг к {targetDateStr}.
                    </p>
                  </div>

                  {/* Chart */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid key="grid-step14" strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis 
                          key="xaxis-step14"
                          dataKey="week" 
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          key="yaxis-step14"
                          domain={[targetWeight - 2, currentWeight + 2]}
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip key="tooltip-step14" />
                        <Line 
                          key="line-step14"
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', r: 5 }}
                          name="Вес (кг)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    
                    {/* Goal label */}
                    <div className="flex justify-end mt-4">
                      <span className="text-sm font-semibold text-red-500 uppercase tracking-wide">
                        ЦЕЛЬ {targetWeight} КГ
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 sm:space-y-3 mb-8">
                    <p className="text-gray-700 leading-relaxed">
                      Отличные новости! Основываясь на участницах клуба EasyME, похожих на вас, мы предполагаем, 
                      что вы сможете консервативно достичь своей цели по снижению веса к {targetDateStr}.
                    </p>
                    <p className="text-gray-700 leading-relaxed">Далее расскажите нам о своих привычках и поведении, чтобы мы могли определить, сможете ли вы достичь цели раньше.</p>
                  </div>

                  {/* СОЦИАЛЬНОЕ ДОКАЗАТЕЛЬСТВО: статистика участниц */}
                  <div className="mb-8">
                    <SocialProofStat 
                      percentage={63} 
                      text="участниц начинают с того же уровня, что и вы" 
                    />
                    <p className="text-sm text-gray-500 text-center mt-3">
                      Более 1,500 девушек уже прошли этот путь
                    </p>
                  </div>

                  {/* Success Badge */}
                  <div className="flex items-center justify-center gap-3 mb-12">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#10b981] rounded-full">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      Вы поставили себе хорошую цель!
                    </span>
                  </div>

                  {/* Continue Button (Orange) */}
                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-[#ff4500] hover:bg-[#e63e00] text-white text-lg font-bold rounded-xl transition-colors mb-12"
                  >
                    Далее
                  </button>

                  {/* Testimonials Section */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      Отзывы и результаты
                    </h3>
                    
                    {/* Grid of 10 Images */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {testimonialImages.map((img, index) => (
                        <div key={index} className="relative aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={img}
                            alt={`Отзыв ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Step 15: Name */}
            {step === 15 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Как вас зовут?
                </h2>
                <p className="text-xs sm:text-sm md:text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                  Укажите ваше имя
                </p>
                
                {/* Name Input Field */}
                <div className="max-w-sm">
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    placeholder="Алла"
                    className="w-full p-4 text-2xl border-2 border-gray-200 rounded-lg focus:border-[#9CA986] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Step 16: Information Message */}
            {step === 16 && (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Честно говоря: желаемый вес часто отличается от веса, который действительно подходит организму.
                </h2>
                
                <div className="space-y-3 sm:space-y-4 md:space-y-5 text-left">
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                    Мы не утверждаем, что это про вас. Нам нужно понять, что для вас действительно важно. 
                    По ходу программы мы разберём это подробнее. А пока давайте представим, каким может быть 
                    ваш комфортный и счастливый вес.
                  </p>

                  <div className="p-6 bg-[#9CA986]/10 border-l-4 border-[#9CA986] rounded-lg">
                    <p className="text-base font-semibold text-gray-900 mb-3">Совет:</p>
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">Отвечая на вопросы, вспомните период, когда вы меньше всего зацикливались на цифрах на весах. Чем вы тогда занимались для удовольствия? С кем проводили время? Какие занятия и хобби приносили радость? Что вы чувствовали?</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 17: Desired Feelings */}
            {step === 17 && (() => {
              const feelingOptions = [
                'Чувствовать себя увереннее',
                'Больше энергии и лёгкости',
                'Спокойствие и контроль над собой',
                'Нравиться себе в зеркале',
                'Не стесняться своего тела',
                'Другое',
              ];

              const toggleFeeling = (feeling: string) => {
                const current = data.desiredFeelings;
                if (current.includes(feeling)) {
                  setData({ ...data, desiredFeelings: current.filter(f => f !== feeling) });
                } else {
                  setData({ ...data, desiredFeelings: [...current, feeling] });
                }
              };

              return (
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    Каких ощущений вы хотите достичь, когда похудеете?
                  </h2>
                  <p className="text-xs sm:text-sm md:text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">Можно выбрать несколько вариантов</p>
                  
                  <div className="space-y-1.5 sm:space-y-2 md:space-y-3 max-w-2xl mb-10">
                    {feelingOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => toggleFeeling(option)}
                        className={`w-full p-2.5 sm:p-3 md:p-4 rounded-lg border-2 transition-all text-left font-medium ${
                          data.desiredFeelings.includes(option)
                            ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                            : 'border-gray-200 hover:border-gray-300 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            data.desiredFeelings.includes(option)
                              ? 'border-[#9CA986] bg-[#9CA986]'
                              : 'border-gray-300'
                          }`}>
                            {data.desiredFeelings.includes(option) && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span>{option.toLowerCase()}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Micro Message */}
                  <div className="p-6 bg-[#9CA986]/10 border-2 border-[#9CA986]/30 rounded-xl text-center">
                    <p className="text-sm sm:text-base md:text-lg text-gray-900 mb-2">Большинство участниц приходят не только за весом</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA986] flex-shrink-0" /> а за ощущением «я снова нравлюсь себе»
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Step 18: Needs Plan */}
            {step === 18 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Насколько вам откликается:
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 italic">
                  «Я знаю, что нужно делать, чтобы похудеть, но мне нужен план, который реально впишется в мою жизнь»
                </p>
                <div className="space-y-3 max-w-md">
                  {[
                    { value: 'yes', label: 'Да, это про меня' },
                    { value: 'sometimes', label: 'Иногда' },
                    { value: 'no', label: 'Нет' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setData({ ...data, needsPlan: option.value });
                        setTimeout(() => handleNext(), 300);
                      }}
                      className={`w-full p-2.5 sm:p-3 md:p-4 rounded-lg border-2 transition-all text-left font-medium ${
                        data.needsPlan === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 19: Real Problem Explanation */}
            {step === 19 && (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8">
                  Вот в чём настоящая проблема
                </h2>
                
                <div className="space-y-3 sm:space-y-4 md:space-y-5 text-left">
                  <div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-900 mb-2">Вы уже знаете базу:</p>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm sm:text-base md:text-lg text-gray-700">— меньше есть</p>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700">— больше двигаться</p>
                    </div>
                  </div>

                  <p className="text-lg font-semibold text-gray-900">
                    Но в жизни это не работает.
                  </p>

                  <div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-900 mb-2">Потому что:</p>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm sm:text-base md:text-lg text-gray-700">— нет времени</p>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700">— нет чёткого плана</p>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700">— нет системы</p>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-900 mt-2 flex items-center gap-2"><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA986] flex-shrink-0" /> и всё откладывается</p>
                  </div>

                  <div className="pt-4">
                    <p className="text-xl font-bold text-gray-900 mb-3">В EasyME всё иначе:</p>
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base md:text-lg text-gray-700">— вы открываете день</p>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700">— включаете тренировку</p>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700">— просто повторяете</p>
                    </div>
                  </div>

                  <div className="space-y-1 ml-4">
                    <p className="text-sm sm:text-base md:text-lg text-gray-700">15–20 минут</p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700">дома</p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700">без сложностей</p>
                  </div>

                  <div className="p-6 bg-[#9CA986]/10 border-2 border-[#9CA986]/30 rounded-xl">
                    <p className="text-xl font-semibold text-gray-900 text-center flex items-center justify-center gap-2">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#9CA986] flex-shrink-0" /> поэтому это реально встраивается в жизнь
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 20: Weight Affects Confidence */}
            {step === 20 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Насколько вам откликается:
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 italic">
                  «Мой вес влияет на мою уверенность и общение с людьми»
                </p>
                <div className="space-y-3 max-w-md">
                  {[
                    { value: 'yes', label: 'Да' },
                    { value: 'sometimes', label: 'Иногда' },
                    { value: 'no', label: 'Нет' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setData({ ...data, weightAffectsConfidence: option.value });
                        setTimeout(() => handleNext(), 300);
                      }}
                      className={`w-full p-2.5 sm:p-3 md:p-4 rounded-lg border-2 transition-all text-left font-medium ${
                        data.weightAffectsConfidence === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 21: Procrastinating */}
            {step === 21 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Насколько вам откликается:
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 italic">
                  «Я давно думаю похудеть, но постоянно откладываю»
                </p>
                <div className="space-y-3 max-w-md">
                  {[
                    { value: 'yes', label: 'Да' },
                    { value: 'sometimes', label: 'Иногда' },
                    { value: 'no', label: 'Нет' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setData({ ...data, procrastinating: option.value });
                        setTimeout(() => handleNext(), 300);
                      }}
                      className={`w-full p-2.5 sm:p-3 md:p-4 rounded-lg border-2 transition-all text-left font-medium ${
                        data.procrastinating === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 22: Short Message - 15-20 minutes */}
            {step === 22 && (
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8">
                  Всего 15–20 минут в день
                </h2>
                
                <div className="space-y-3 sm:space-y-4 md:space-y-5 text-left">
                  <p className="text-base sm:text-lg md:text-xl text-gray-900 font-semibold">
                    Это всё, что нужно.
                  </p>

                  <div className="space-y-2 ml-4">
                    <p className="text-sm sm:text-base md:text-lg text-gray-700">Без зала</p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700">без сложных программ</p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700">без перегруза</p>
                  </div>

                  <div className="p-6 bg-[#9CA986]/10 border-2 border-[#9CA986]/30 rounded-xl">
                    <p className="text-xl font-semibold text-gray-900 flex items-center gap-2"><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#9CA986] flex-shrink-0" /> маленькие действия каждый день дают результат</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 23: Preferred Time */}
            {step === 23 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Когда вам удобнее заниматься?
                </h2>
                <p className="text-sm text-gray-500 mb-8">
                  мы встроим тренировки в ваш график
                </p>
                <div className="space-y-3 max-w-md">
                  {[
                    { value: 'morning', label: 'Утром' },
                    { value: 'afternoon', label: 'Днём' },
                    { value: 'evening', label: 'Вечером' },
                    { value: 'before-bed', label: 'Перед сном' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setData({ ...data, preferredTime: option.value });
                        setTimeout(() => handleNext(), 300);
                      }}
                      className={`w-full p-2.5 sm:p-3 md:p-4 rounded-lg border-2 transition-all text-left font-medium ${
                        data.preferredTime === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 24: Start Goal */}
            {step === 24 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                  С чего вы хотите начать?
                </h2>
                <div className="space-y-1.5 sm:space-y-2 md:space-y-3 max-w-2xl">
                  {[
                    { value: 'train-no-overload', label: 'Начать тренироваться без перегруза' },
                    { value: 'fix-nutrition', label: 'Наладить питание' },
                    { value: 'remove-belly', label: 'Убрать живот и подтянуть тело' },
                    { value: 'just-start', label: 'Просто начать и войти в режим' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setData({ ...data, startGoal: option.value });
                        setTimeout(() => handleNext(), 300);
                      }}
                      className={`w-full p-2.5 sm:p-3 md:p-4 rounded-lg border-2 transition-all text-left font-medium ${
                        data.startGoal === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 25: Physical Limitations */}
            {step === 25 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                  Есть ли у вас физические ограничения?
                </h2>

                {/* ОТЗЫВ: про то что можно заниматься с детьми дома */}
                <div className="mb-8 max-w-2xl">
                  <TestimonialCard
                    name="Екатерина"
                    age={32}
                    result="-7 кг за 2 месяца"
                    quote="У меня двое детей и совсем нет времени на зал. Тренировки по 15 минут дома стали для меня спасением!"
                    details="2 детей, занималась дома"
                    variant="compact"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md">
                  {[
                    { value: 'yes', label: 'Да' },
                    { value: 'no', label: 'Нет' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setData({ ...data, physicalLimitations: option.value });
                        setTimeout(() => handleNext(), 300);
                      }}
                      className={`p-6 rounded-lg border-2 transition-all font-medium ${
                        data.physicalLimitations === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 26: Dietary Restrictions */}
            {step === 26 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                  Есть ли ограничения в питании или аллергия?
                </h2>

                {/* ОТЗЫВ: про питание без строгих диет */}
                <div className="mb-8 max-w-2xl">
                  <TestimonialCard
                    name="Мария"
                    age={29}
                    result="-3 кг за 10 дней"
                    quote="Я наконец-то поняла, что дело было не в диетах! Ушли отёки, появилась лёгкость. Без голодовок и срывов!"
                    details="ушли отёки"
                    variant="compact"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md">
                  {[
                    { value: 'yes', label: 'Да' },
                    { value: 'no', label: 'Нет' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setData({ ...data, dietaryRestrictions: option.value });
                        setTimeout(() => handleNext(), 300);
                      }}
                      className={`p-6 rounded-lg border-2 transition-all font-medium ${
                        data.dietaryRestrictions === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 27: Eating Preference */}
            {step === 27 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                  Как вам удобнее питаться?
                </h2>
                <div className="space-y-3 max-w-md">
                  {[
                    { value: 'eat-all', label: 'Ем всё' },
                    { value: 'eat-light', label: 'Стараюсь есть легче' },
                    { value: 'have-restrictions', label: 'Есть ограничения' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setData({ ...data, eatingPreference: option.value });
                        setTimeout(() => handleNext(), 300);
                      }}
                      className={`w-full p-2.5 sm:p-3 md:p-4 rounded-lg border-2 transition-all text-left font-medium ${
                        data.eatingPreference === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/10 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 28: Final Analysis Screen */}
            {step === 28 && (() => {
              const currentWeight = Number(data.currentWeight) || 75;
              const targetWeight = Number(data.targetWeight) || 60;
              
              // DEBUG: Log the values to check
              console.log('Step 28 - Current Weight:', data.currentWeight, 'Parsed:', currentWeight);
              console.log('Step 28 - Target Weight:', data.targetWeight, 'Parsed:', targetWeight);
              console.log('Step 28 - All data:', data);
              
              const weightDifference = currentWeight - targetWeight;
              const weeklyLoss = 1.95; // Average of 1.7-2.2 kg per week
              const weeksToGoal = Math.ceil(weightDifference / weeklyLoss);
              
              // Calculate target date
              const today = new Date();
              const targetDate = new Date(today);
              targetDate.setDate(targetDate.getDate() + (weeksToGoal * 7));
              const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
              const targetDateStr = `${targetDate.getDate()} ${monthNames[targetDate.getMonth()]}`;

              // Generate chart data points
              const chartData = [];
              const numPoints = Math.min(weeksToGoal, 12); // Max 12 points on chart
              const interval = weeksToGoal / numPoints;
              
              for (let i = 0; i <= numPoints; i++) {
                const weekNum = Math.floor(i * interval);
                const weight = currentWeight - (weekNum * weeklyLoss);
                const adjustedWeight = Math.max(weight, targetWeight);
                const date = new Date(today);
                date.setDate(date.getDate() + (weekNum * 7));
                const dateStr = `${date.getDate()} ${monthNames[date.getMonth()].slice(0, 3)}.`;
                
                chartData.push({
                  week: dateStr,
                  weight: Number(adjustedWeight.toFixed(1))
                });
              }

              return (
                <div className="max-w-4xl mx-auto -mt-4">
                  {/* Header */}
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8">
                    {planCompleted ? 'План собран!' : 'Собираем ваш персональный план...'}
                  </h2>

                  {/* Loading animation placeholder */}
                  <div className="mb-8">
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#9CA986] to-[#b8c9a0] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3.5, ease: 'easeInOut' }}
                        onAnimationComplete={() => {
                          setPlanCompleted(true);
                        }}
                      />
                    </div>
                  </div>

                  {/* What we've considered */}
                  <div className="mb-8">
                    <p className="text-lg font-semibold text-gray-900 mb-4">Мы уже учли:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm sm:text-base md:text-lg text-gray-700">ваш уровень</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm sm:text-base md:text-lg text-gray-700">ваш ритм жизни</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm sm:text-base md:text-lg text-gray-700">ваши цели</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
                    <p className="text-sm font-semibold text-gray-900 mb-4">ваш результат с планом</p>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid key="grid-step28" strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis 
                          key="xaxis-step28"
                          dataKey="week" 
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          key="yaxis-step28"
                          domain={[targetWeight - 2, currentWeight + 2]}
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip key="tooltip-step28" />
                        <Line 
                          key="line-step28"
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#9CA986" 
                          strokeWidth={3}
                          dot={{ fill: '#9CA986', r: 5 }}
                          name="Вес (кг)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Prediction */}
                  <div className="mb-8 p-6 bg-[#9CA986]/10 border-2 border-[#9CA986]/30 rounded-xl">
                    <p className="text-xl font-bold text-gray-900 text-center">
                      Мы также считаем что вы достигните {targetWeight} кг к {targetDateStr}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3 mb-8">
                    <p className="text-lg font-semibold text-gray-900">Вы можете снизить:</p>
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base md:text-lg text-gray-700 flex items-start gap-2"><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA986] flex-shrink-0 mt-0.5" /> 1.7–2.2 кг в неделю</p>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700 flex items-start gap-2"><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA986] flex-shrink-0 mt-0.5" /> убрать отёки уже в первые дни</p>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700 flex items-start gap-2"><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA986] flex-shrink-0 mt-0.5" /> увидеть изменения через 7–10 дней</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#10b981] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm sm:text-base md:text-lg text-gray-700">вы ищете план, который впишется в вашу жизнь</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#10b981] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm sm:text-base md:text-lg text-gray-700">вы готовы начать</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Step 29: You Are Not Alone */}
            {step === 29 && (
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                  Ты не одна
                </h2>
                
                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                  <p className="text-2xl text-gray-900">
                    Мы помогли похудеть <span className="font-bold text-[#9CA986]">6400 девушкам</span>.
                  </p>

                  <div className="h-px bg-gray-200 my-8"></div>

                  <p className="text-base sm:text-lg md:text-xl text-gray-700">
                    А прямо сейчас в <span className="font-semibold">Лёгкости</span> рядом с тобой будут более{' '}
                    <span className="font-bold text-[#9CA986]">1500 единомышленниц</span>.
                  </p>
                </div>
              </div>
            )}

            {/* Step 30: Motivation Changes */}
            {step === 30 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Понимание того, как ваши эмоции меняются со временем, помогает нам настроить программу под вас
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8">
                  Как со временем менялась ваша мотивация к снижению веса?
                </p>

                <div className="space-y-2 sm:space-y-3">
                  {[
                    { value: 'stable', label: 'Она остаётся стабильной', Icon: BarChart3 },
                    { value: 'fluctuating', label: 'То усиливается, то ослабевает', Icon: TrendingUp },
                    { value: 'searching', label: 'Я всё ещё ищу свою мотивацию', Icon: Search }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, motivationChanges: option.value })}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                        data.motivationChanges === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <option.Icon className="w-8 h-8 text-[#9CA986]" />
                        <span className="text-sm sm:text-base md:text-lg text-gray-900">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 31: Readiness Level */}
            {step === 31 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Давайте лучше поймём ваше текущее состояние
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8">
                  Насколько сейчас вы готовы достичь цели?
                </p>

                <div className="space-y-2 sm:space-y-3">
                  {[
                    { value: 'ready', label: 'Я готова', Icon: Zap },
                    { value: 'hopeful', label: 'Чувствую надежду', Icon: Sparkles },
                    { value: 'cautious', label: 'Осторожный оптимизм', Icon: HelpCircle },
                    { value: 'calm', label: 'Двигаюсь спокойно, без спешки', Icon: Heart }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, readinessLevel: option.value })}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                        data.readinessLevel === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <option.Icon className="w-8 h-8 text-[#9CA986]" />
                        <span className="text-sm sm:text-base md:text-lg text-gray-900">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 32: Weight Loss Thinking */}
            {step === 32 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8">
                  Когда вы думаете о снижении веса, что сейчас у вас в голове?
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  {[
                    { value: 'concrete_goal', label: 'У меня есть конкретная цель и запрос', Icon: Target },
                    { value: 'self_care', label: 'Я хочу позаботиться о себе', Icon: Heart },
                    { value: 'seeking_new', label: 'Я ищу что-то новое', Icon: Star }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, weightLossThinking: option.value })}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                        data.weightLossThinking === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <option.Icon className="w-8 h-8 text-[#9CA986]" />
                        <span className="text-sm sm:text-base md:text-lg text-gray-900">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 33: Emotional Comfort */}
            {step === 33 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6">
                  Насколько вам откликается следующее утверждение?
                </h2>
                <p className="text-2xl text-gray-800 mb-8 italic">
                  «Еда часто приносит мне эмоциональный комфорт»
                </p>

                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                  <div className="flex justify-between items-center gap-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => setData({ ...data, emotionalComfort: value.toString() })}
                        className={`flex-1 aspect-square rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                          data.emotionalComfort === value.toString()
                            ? 'border-[#9CA986] bg-[#9CA986] text-white scale-105'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <span className="text-4xl font-bold">{value}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 px-2">
                    <span>Совершенно не согласна</span>
                    <span>Полностью согласна</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 34: Diet Cycles */}
            {step === 34 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6">
                  Насколько вам откликается следующее утверждение?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-8 leading-relaxed">
                  «Мне удаётся питаться более здорово или заниматься спортом неделю-две, но потом я срываюсь и возвращаюсь к старым привычкам»
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setData({ ...data, dietCycles: 'no' })}
                    className={`p-8 rounded-xl border-2 transition-all ${
                      data.dietCycles === 'no'
                        ? 'border-[#9CA986] bg-[#9CA986]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl">✕</span>
                      <span className="text-2xl font-semibold text-gray-900">Нет</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setData({ ...data, dietCycles: 'yes' })}
                    className={`p-8 rounded-xl border-2 transition-all ${
                      data.dietCycles === 'yes'
                        ? 'border-[#9CA986] bg-[#9CA986]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl">✓</span>
                      <span className="text-2xl font-semibold text-gray-900">Да</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 35: Step by Step Message */}
            {step === 35 && (
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                  Шаг за шагом
                </h2>
                
                <div className="space-y-3 sm:space-y-4 md:space-y-5 text-left bg-gray-50 p-3 sm:p-4 md:p-6 rounded-2xl">
                  <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed">
                    Большинство из нас никогда не учили, как формировать новые привычки — поэтому и возникает эффект «качелей» в похудении.
                  </p>

                  <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed">
                    Поверьте, это не происходит за одну ночь благодаря резким изменениям.{' '}
                    <span className="font-bold text-[#9CA986]">Мы поможем вам.</span>
                  </p>
                </div>
              </div>
            )}

            {/* Step 36: People May Interfere */}
            {step === 36 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6">
                  Насколько вам откликается следующее утверждение?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-8 italic">
                  «Люди вокруг меня могут мешать мне поддерживать здоровые привычки»
                </p>

                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                  <div className="flex justify-between items-center gap-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => setData({ ...data, peopleMayInterfere: value.toString() })}
                        className={`flex-1 aspect-square rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                          data.peopleMayInterfere === value.toString()
                            ? 'border-[#9CA986] bg-[#9CA986] text-white scale-105'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <span className="text-4xl font-bold">{value}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 px-2">
                    <span>Совершенно не согласна</span>
                    <span>Полностью согласна</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 37: Multitasking While Eating */}
            {step === 37 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6">
                  Насколько вам откликается следующее утверждение?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-8 leading-relaxed">
                  «Я обычно делаю несколько дел одновременно во время еды (например, смотрю YouTube или листаю ленту)»
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setData({ ...data, multitaskingWhileEating: 'no' })}
                    className={`p-8 rounded-xl border-2 transition-all ${
                      data.multitaskingWhileEating === 'no'
                        ? 'border-[#9CA986] bg-[#9CA986]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl">✕</span>
                      <span className="text-2xl font-semibold text-gray-900">Нет</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setData({ ...data, multitaskingWhileEating: 'yes' })}
                    className={`p-8 rounded-xl border-2 transition-all ${
                      data.multitaskingWhileEating === 'yes'
                        ? 'border-[#9CA986] bg-[#9CA986]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl">✓</span>
                      <span className="text-2xl font-semibold text-gray-900">Да</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 38: Finishing Plate */}
            {step === 38 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6">
                  Насколько вам откликается следующее утверждение?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-8 leading-relaxed">
                  «Я обычно доедаю всё на тарелке, даже если уже чувствую сытость»
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setData({ ...data, finishingPlate: 'no' })}
                    className={`p-8 rounded-xl border-2 transition-all ${
                      data.finishingPlate === 'no'
                        ? 'border-[#9CA986] bg-[#9CA986]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl">✕</span>
                      <span className="text-2xl font-semibold text-gray-900">Нет</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setData({ ...data, finishingPlate: 'yes' })}
                    className={`p-8 rounded-xl border-2 transition-all ${
                      data.finishingPlate === 'yes'
                        ? 'border-[#9CA986] bg-[#9CA986]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl">✓</span>
                      <span className="text-2xl font-semibold text-gray-900">Да</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 39: Failure Feeling */}
            {step === 39 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6">
                  Насколько вам откликается следующее утверждение?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-8 leading-relaxed">
                  «Из-за одного неправильного решения или поступка я чувствовала себя «неудачницей». 
                  И это часто приводило к тому, что я совершала ещё больше неправильных поступков»
                </p>

                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                  <div className="flex justify-between items-center gap-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => setData({ ...data, failureFeeling: value.toString() })}
                        className={`flex-1 aspect-square rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                          data.failureFeeling === value.toString()
                            ? 'border-[#9CA986] bg-[#9CA986] text-white scale-105'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <span className="text-4xl font-bold">{value}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 px-2">
                    <span>Совершенно не согласна</span>
                    <span>Полностью согласна</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 40: Interests to Explore */}
            {step === 40 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8">
                  Пока мы формируем ваш план снижения веса, что ещё вам интересно изучить?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: 'healthy_aging', label: 'Здоровое старение', Icon: Heart },
                    { value: 'metabolism', label: 'Изменения в метаболизме', Icon: Zap },
                    { value: 'digestion', label: 'Пищеварение', Icon: Activity },
                    { value: 'sleep', label: 'Улучшение сна', Icon: Moon },
                    { value: 'stress', label: 'Снижение стресса', Icon: Heart },
                    { value: 'energy', label: 'Повышение уровня энергии', Icon: Zap },
                    { value: 'emotional', label: 'Эмоциональное благополучие', Icon: Heart },
                    { value: 'recovery', label: 'Отдых и восстановление', Icon: Moon },
                    { value: 'other', label: 'Другое', Icon: Sparkles }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const current = data.interestsToExplore || [];
                        const newInterests = current.includes(option.value)
                          ? current.filter(i => i !== option.value)
                          : [...current, option.value];
                        setData({ ...data, interestsToExplore: newInterests });
                      }}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        data.interestsToExplore?.includes(option.value)
                          ? 'border-[#9CA986] bg-[#9CA986]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <option.Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#9CA986]" />
                        <span className="text-xs sm:text-sm md:text-base text-gray-900">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 41: Diet Cycles Graph and Pace */}
            {step === 41 && (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                  Почему ограничительные диеты не работают
                </h2>
                <p className="text-xl text-[#9CA986] mb-8 text-center font-semibold">
                  Эффект качелей
                </p>

                <Suspense fallback={<div className="w-full h-[300px] bg-gray-100 animate-pulse rounded-xl" />}>
                  <YoYoDietChart />
                </Suspense>

                <div className="mt-8 space-y-3 sm:space-y-4 md:space-y-5 bg-gray-50 p-6 rounded-2xl">
                  <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed">Традиционные строгие диеты могут помогать снижать вес короткими рывками. Эффект «качелей», но в итоге не помогают удерживать результат.</p>

                  <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed">
                    Мы поможем вам добиться <span className="font-bold text-[#9CA986]">долгосрочных изменений</span> через 
                    формирование привычек и изменение поведения, а не через строгие ограничения в питании.
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    План будет создан так, чтобы работать в вашем темпе. Только вы знаете себя лучше всех, 
                    поэтому какой темп вам ближе?
                  </h3>

                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { value: 'fast', label: 'Как можно быстрее', Icon: Zap },
                      { value: 'slow', label: 'Медленно, но стабильно', Icon: TrendingUp },
                      { value: 'medium', label: 'Что-то среднее между ними', Icon: Activity }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setData({ ...data, changesPace: option.value })}
                        className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                          data.changesPace === option.value
                            ? 'border-[#9CA986] bg-[#9CA986]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <option.Icon className="w-8 h-8 text-[#9CA986]" />
                          <span className="text-sm sm:text-base md:text-lg text-gray-900">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 42: Goal Without Plan */}
            {step === 42 && (
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Цель без плана — это просто мечта
                </h2>
                <p className="text-2xl text-[#9CA986] mb-8 font-semibold">
                  Вот вам лайфхак
                </p>
                
                <div className="space-y-3 sm:space-y-4 md:space-y-5 text-left bg-gray-50 p-3 sm:p-4 md:p-6 rounded-2xl mb-8">
                  <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed">
                    Если разбить большую цель на маленькие, то вы будете чаще ощущать результат. 
                    Мотивация будет расти и укрепляться.
                  </p>

                  <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed">
                    А с мотивацией уже легче идти к новым целям.
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-6">
                    Давай начнём, {data.name || 'Илья'}.
                  </p>
                </div>

                <div className="text-lg text-[#9CA986] font-semibold">
                  Поставить первую цель →
                </div>
              </div>
            )}

            {/* Step 43: Additional Goals */}
            {step === 43 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8">
                  Помимо цели по снижению веса, какой результат вы хотели бы получить с помощью программы?
                </h2>

                <div className="space-y-3">
                  {[
                    { value: 'be_fit', label: 'Быть в форме', Icon: Zap },
                    { value: 'outdoor_activities', label: 'С легкостью заниматься активностями на свежем воздухе', Icon: Activity },
                    { value: 'confident_body', label: 'Чувствовать себя комфортно и уверенно в своём теле', Icon: Sparkles },
                    { value: 'feel_healthier', label: 'Чувствовать себя более здоровой', Icon: Star },
                    { value: 'other', label: 'Другое', Icon: FileText }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const current = data.additionalGoals || [];
                        const newGoals = current.includes(option.value)
                          ? current.filter(g => g !== option.value)
                          : [...current, option.value];
                        setData({ ...data, additionalGoals: newGoals });
                      }}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                        data.additionalGoals?.includes(option.value)
                          ? 'border-[#9CA986] bg-[#9CA986]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <option.Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#9CA986]" />
                        <span className="text-xs sm:text-sm md:text-base text-gray-900">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 44: Weighing Time */}
            {step === 44 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8">
                  Как вы думаете, когда лучше всего взвешиваться?
                </h2>

                <div className="space-y-2 sm:space-y-3 mb-8">
                  {[
                    { value: 'morning', label: 'Сразу после пробуждения — до еды и напитков', Icon: Calendar },
                    { value: 'evening', label: 'После последнего приёма пищи за день', Icon: Moon }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, weighingTime: option.value })}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                        data.weighingTime === option.value
                          ? 'border-[#9CA986] bg-[#9CA986]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <option.Icon className="w-8 h-8 text-[#9CA986]" />
                        <span className="text-sm sm:text-base md:text-lg text-gray-900">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bg-[#9CA986]/10 p-6 rounded-2xl border-2 border-[#9CA986]/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Совет</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed mb-3">
                    Вес может меняться каждый день в зависимости от еды и других факторов. 
                    Лучше всего взвешиваться в одно и то же время, на одних и тех же весах, каждый день натощак.
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed">
                    Исследования показывают, что регулярные взвешивания помогают снижать вес и легче его удерживать. 
                    Ежедневный контроль повышает осознанность и помогает делать более здоровый выбор.
                  </p>
                </div>
              </div>
            )}

            {/* Step 45: Recent Foods */}
            {step === 45 && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    Спасибо за ваш вклад, {data.name || 'Илья'}!
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                    Мы видим, что у вас есть всё необходимое для результата, и сейчас персонализируем вашу программу, 
                    чтобы выстроить более здоровый образ жизни, который лучше всего вам подходит.
                  </p>
                </div>

                <div className="bg-[#9CA986]/10 p-6 rounded-2xl mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Есть 2 хорошие новости для вас:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base md:text-lg text-gray-800">
                    <li>Мы против подхода «одна диета подходит всем»</li>
                    <li>То, что вы уже едите, скорее всего можно адаптировать под ваши цели по снижению веса</li>
                  </ol>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  За последнюю неделю какие из этих продуктов вы ели?
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'eggs', label: 'Яйца', icon: '🥚' },
                    { value: 'white_rice', label: 'Белый рис', icon: '🍚' },
                    { value: 'avocado', label: 'Авокадо', icon: '🥑' },
                    { value: 'chicken', label: 'Курица', icon: '🍗' },
                    { value: 'none', label: 'Ничего из перечисленного', icon: '🚫' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const current = data.recentFoods || [];
                        const newFoods = current.includes(option.value)
                          ? current.filter(f => f !== option.value)
                          : [...current, option.value];
                        setData({ ...data, recentFoods: newFoods });
                      }}
                      className={`p-5 rounded-xl border-2 transition-all ${
                        data.recentFoods?.includes(option.value)
                          ? 'border-[#9CA986] bg-[#9CA986]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <span className="text-4xl">{option.icon}</span>
                        <span className="text-sm text-gray-900">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 46: Cravings */}
            {step === 46 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8">
                  Тянет ли вас на что-нибудь из следующего?
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'wine', label: 'Вино', icon: '🍷' },
                    { value: 'cheese', label: 'Сыр', icon: '🧀' },
                    { value: 'chocolate', label: 'Шоколад', icon: '🍫' },
                    { value: 'fried', label: 'Жареное', icon: '🍟' },
                    { value: 'none', label: 'Ничего из перечисленного', icon: '🚫' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const current = data.cravings || [];
                        const newCravings = current.includes(option.value)
                          ? current.filter(c => c !== option.value)
                          : [...current, option.value];
                        setData({ ...data, cravings: newCravings });
                      }}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        data.cravings?.includes(option.value)
                          ? 'border-[#9CA986] bg-[#9CA986]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3 text-center">
                        <span className="text-5xl">{option.icon}</span>
                        <span className="text-xs sm:text-sm md:text-base text-gray-900 font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 47: Would Eat Foods */}
            {step === 47 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8">
                  И наконец, какие из этих продуктов вы бы съели?
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'lettuce', label: 'Листья салата', icon: '🥬' },
                    { value: 'tomatoes', label: 'Помидоры', icon: '🍅' },
                    { value: 'cucumbers', label: 'Огурцы', icon: '🥒' },
                    { value: 'bananas', label: 'Бананы', icon: '🍌' },
                    { value: 'none', label: 'Ничего из перечисленного', icon: '🚫' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const current = data.wouldEatFoods || [];
                        const newFoods = current.includes(option.value)
                          ? current.filter(f => f !== option.value)
                          : [...current, option.value];
                        setData({ ...data, wouldEatFoods: newFoods });
                      }}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        data.wouldEatFoods?.includes(option.value)
                          ? 'border-[#9CA986] bg-[#9CA986]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3 text-center">
                        <span className="text-5xl">{option.icon}</span>
                        <span className="text-xs sm:text-sm md:text-base text-gray-900 font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 48: Almost Ready */}
            {step === 48 && (
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                  В вашей персональной программе мы подробнее разберём лучшие способы чувствовать сытость, 
                  потребляя меньше калорий!
                </h2>
                
                <div className="text-3xl font-bold text-[#9CA986] mt-12">
                  Почти готово
                </div>
              </div>
            )}

            {/* Step 49: Final Analysis with Popup */}
            {step === 49 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
                  Анализируем ваши данные
                </h2>

                {/* СОЦИАЛЬНОЕ ДОКАЗАТЕЛЬСТВО: на основе опыта */}
                <p className="text-center text-sm sm:text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6">
                  На основе опыта более <span className="font-semibold text-[#9CA986]">1,500 участниц</span>
                </p>

                {/* Loading animation */}
                <div className="mb-8">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-[#9CA986]">
                          {Math.min(Math.round(loadingProgress), 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200">
                      <div
                        style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#9CA986] transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Popup overlay */}
                <div className="bg-white rounded-2xl border-2 border-[#9CA986] p-6 shadow-lg">
                  <PopupQuestions
                    familyHealthHistory={data.familyHealthHistory}
                    regularMealTimes={data.regularMealTimes}
                    dayActivity={data.dayActivity}
                    onFamilyHealthHistoryChange={(value) => setData({ ...data, familyHealthHistory: value })}
                    onRegularMealTimesChange={(value) => setData({ ...data, regularMealTimes: value })}
                    onDayActivityChange={(value) => setData({ ...data, dayActivity: value })}
                  />
                </div>
              </div>
            )}

            {/* Step 50: Optimized Results */}
            {step === 50 && (() => {
              const currentWeight = Number(data.currentWeight) || 75;
              const targetWeight = Number(data.targetWeight) || 65;
              
              // DEBUG: Log the values to check
              console.log('Step 50 - Current Weight:', data.currentWeight, 'Parsed:', currentWeight);
              console.log('Step 50 - Target Weight:', data.targetWeight, 'Parsed:', targetWeight);
              console.log('Step 50 - All data:', data);
              
              // Use saved weeksToGoal and targetDate from step 14
              const originalWeeksEstimate = data.weeksToGoal || Math.ceil((currentWeight - targetWeight) / 1.95);
              const optimizedWeeksEstimate = Math.max(originalWeeksEstimate - 1, 4);
              
              // Calculate original and optimized target dates
              const originalTargetDate = data.targetDateTimestamp 
                ? new Date(data.targetDateTimestamp) 
                : new Date(Date.now() + originalWeeksEstimate * 7 * 24 * 60 * 60 * 1000);
              
              const optimizedTargetDate = new Date(originalTargetDate);
              optimizedTargetDate.setDate(optimizedTargetDate.getDate() - 7); // Minus 1 week (7 days)
              
              const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
              const optimizedTargetDateStr = `${optimizedTargetDate.getDate()} ${monthNames[optimizedTargetDate.getMonth()]}`;
              const originalTargetDateStr = `${originalTargetDate.getDate()} ${monthNames[originalTargetDate.getMonth()]}`;

              const weightToLose = currentWeight - targetWeight;
              const generateWeightData = (weeks: number) => {
                const dataPoints = [];
                const weeklyLoss = weightToLose / weeks;
                
                for (let i = 0; i <= weeks; i++) {
                  dataPoints.push({
                    week: i,
                    weight: Math.max(currentWeight - (weeklyLoss * i), targetWeight)
                  });
                }
                
                return dataPoints;
              };

              const weightProgressData = generateWeightData(optimizedWeeksEstimate);

              return (
                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full mb-6">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-bold text-lg">Отличные новости!</span>
                    </div>

                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                      Мы нашли способ ускорить ваш результат еще на неделю раньше
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-2">
                      <span className="line-through text-gray-400">Ваш прогноз: {originalTargetDateStr} ({originalWeeksEstimate} недель)</span>
                    </p>
                    <p className="text-2xl text-gray-900 font-bold">
                      Новый прогноз: <span className="text-[#9CA986]">{optimizedTargetDateStr}</span> ({optimizedWeeksEstimate} недель) 🎉
                    </p>
                  </div>

                  {/* Updated Chart */}
                  <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Ваш обновленный путь к цели</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={weightProgressData}>
                        <defs>
                          <linearGradient id="weightGradientOptimized" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9CA986" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#9CA986" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid key="grid-optimized" strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          key="xaxis-optimized"
                          dataKey="week" 
                          label={{ value: 'Недели', position: 'insideBottom', offset: -5 }}
                          stroke="#6b7280"
                        />
                        <YAxis 
                          key="yaxis-optimized"
                          domain={[targetWeight - 2, currentWeight + 2]}
                          label={{ value: 'Вес (кг)', angle: -90, position: 'insideLeft' }}
                          stroke="#6b7280"
                        />
                        <Tooltip 
                          key="tooltip-optimized"
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '2px solid #9CA986',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`${value.toFixed(1)} кг`, 'Вес']}
                          labelFormatter={(week) => `Неделя ${week}`}
                        />
                        <Area 
                          key="area-optimized"
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#9CA986" 
                          strokeWidth={3}
                          fill="url(#weightGradientOptimized)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* СОЦИАЛЬНОЕ ДОКАЗАТЕЛЬСТВО: результаты */}
                  <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl border-2 border-blue-100">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} className="w-5 h-5 fill-[#00b67a] text-[#00b67a]" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-bold text-lg">4.96 из 5</span>
                    </div>
                    <p className="text-center text-gray-700 font-semibold mb-2">
                      1,500+ участниц уже в процессе
                    </p>
                    <p className="text-center text-sm text-gray-600">
                      Средняя потеря веса: <span className="font-semibold text-[#9CA986]">15.2 кг за 12 недель</span>
                    </p>
                  </div>

                  {/* CTA Info */}
                  <div className="text-center bg-[#9CA986]/10 p-3 sm:p-4 md:p-6 rounded-2xl border-2 border-[#9CA986]/20">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Ваш персональный план готов!
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-gray-900 mb-3">
                      Вы достигнете <span className="font-bold text-[#9CA986]">{targetWeight} кг</span> к <span className="font-bold text-[#9CA986]">{optimizedTargetDateStr}</span>
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6">
                      Получите доступ к полной программе с тренировками, питанием и поддержкой сообщества
                    </p>
                    <div className="inline-flex items-center gap-2 text-[#9CA986] font-semibold text-lg">
                      <span>Переходим к оформлению</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg font-semibold transition-colors ${
              canProceed()
                ? 'bg-[#9CA986] text-white hover:bg-[#8a9877]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step === totalSteps ? 'Получить план' : 'Продолжить'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}