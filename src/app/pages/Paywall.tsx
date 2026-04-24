import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Check, BarChart3, Star, Play, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { buildTelegramLink } from '../utils/urlParams';
import alexandraTransformation from '../../imports/alexandra-transformation.png';


interface QuizData {
  gender: string;
  age: string;
  currentWeight: string;
  targetWeight: string;
  height: string;
  activity: string;
  goal: string;
  timeframe: string;
  name: string;
  weeksToGoal?: number;
  targetDateTimestamp?: number;
  optimizedTargetDateTimestamp?: number;
}

export function Paywall() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('quizData');
    if (data) {
      setQuizData(JSON.parse(data));
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!quizData) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const current = Number(quizData.currentWeight);
  const target = Number(quizData.targetWeight);
  const difference = Math.abs(current - target);
  const isWeightLoss = current > target;

  // Обработчик клика на кнопку
  const handleGetPlan = () => {
    // Формируем ссылку на Telegram бота с параметрами
    const telegramLink = buildTelegramLink(quizData, 'easymeclub_bot');
    
    // Логируем для отладки
    console.log('🚀 Редирект в Telegram:', telegramLink);
    
    // Перенаправляем пользователя в Telegram
    window.location.href = telegramLink;
  };

  // Use optimized target date (minus 7 days) if available
  const optimizedTargetDate = quizData.optimizedTargetDateTimestamp 
    ? new Date(quizData.optimizedTargetDateTimestamp)
    : null;
  
  // Calculate timeline - OPTIMIZED (using saved optimized date or calculating)
  const weightToLose = current - target;
  const originalWeeksEstimate = quizData.weeksToGoal || Math.ceil(weightToLose / 1.95);
  const weeksNeeded = Math.max(originalWeeksEstimate - 1, 4); // Optimized: 1 week faster
  
  const endDate = optimizedTargetDate || new Date(Date.now() + weeksNeeded * 7 * 24 * 60 * 60 * 1000);
  const endDateStr = endDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

  // Generate chart data - using optimized timeline
  const chartData = [];
  const numPoints = Math.min(weeksNeeded, 16); // Max 16 points for smooth curve
  const interval = weeksNeeded / numPoints;
  const weeklyLoss = weightToLose / weeksNeeded;
  
  for (let i = 0; i <= numPoints; i++) {
    const weekNum = Math.floor(i * interval);
    const date = new Date();
    date.setDate(date.getDate() + weekNum * 7);
    
    // EasyME план: волнистое снижение с плато и скачками вниз
    const baseWeight = Math.max(current - (weekNum * weeklyLoss), target);
    
    // Добавляем реалистичные колебания: плато и скачки
    const weekPhase = weekNum % 3; // Цикл из 3 недель
    let plateau = 0;
    
    // Последние 30% времени - ускоренное снижение (добавление гантелей и увеличение нагрузки)
    const accelerationPoint = Math.floor(weeksNeeded * 0.7);
    const isAccelerationPhase = weekNum >= accelerationPoint;
    
    if (isAccelerationPhase) {
      // Фаза ускорения: более интенсивное снижение веса
      const accelerationProgress = (weekNum - accelerationPoint) / (weeksNeeded - accelerationPoint);
      const accelerationBonus = accelerationProgress * 1.5; // Дополнительное снижение до 1.5 кг
      plateau = -accelerationBonus;
    } else {
      // Обычная фаза с плато и скачками
      if (weekPhase === 0) {
        // Неделя плато - вес почти стоит на месте
        plateau = Math.random() * 0.3;
      } else if (weekPhase === 1) {
        // Неделя небольшого снижения
        plateau = -Math.random() * 0.4;
      } else {
        // Неделя активного снижения
        plateau = -Math.random() * 0.8;
      }
    }
    
    const weight = Math.max(baseWeight + plateau, target);
    
    // Другие методы: сначала снижение с колебаниями, потом откат к начальному весу
    let otherMethodsWeight;
    const midPoint = Math.floor(weeksNeeded / 2);
    
    if (weekNum <= midPoint) {
      // Первая половина: снижение с колебаниями
      const baseDecrease = (current - target) * 0.6 * (weekNum / midPoint);
      const oscillation = Math.sin(weekNum * 1.2) * 1.5; // Колебания ±1.5 кг
      otherMethodsWeight = current - baseDecrease + oscillation;
    } else {
      // Вторая половина: откат к начальному весу
      const progress = (weekNum - midPoint) / (weeksNeeded - midPoint);
      const maxDecrease = (current - target) * 0.6;
      const returnWeight = current - maxDecrease + (maxDecrease * progress);
      const oscillation = Math.sin(weekNum * 1.2) * 2; // Более сильные колебания при откате
      otherMethodsWeight = returnWeight + oscillation;
    }
    
    chartData.push({
      date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      weight: Math.round(weight * 10) / 10,
      otherMethods: Math.round(Math.max(otherMethodsWeight, target - 2) * 10) / 10, // Не опускаем ниже цели
    });
  }

  const planFeatures = [
    `${isWeightLoss ? 'Снизить' : 'Набрать'} ${difference} кг к ${endDateStr}`,
    'Продолжить формировать здоровые привычки для поддержания веса после достижения цели',
    'Чувсвовать себя здоровее',
  ];

  const benefits = [
    'Фокусируемся на психологии похудения',
    'Идём в специально подобранном темпе под вас, чтобы вы достичли цели и сохранили результат навсегда',
    'Индивидуальный план с учётом ваших ограничений в питании',
    'Учёт ваших чувств: Бодрость',
    'Персональная поддержка 24/7',
  ];

  // Success Stories для карточек
  const successStories = [
    {
      name: 'Анна',
      result: '-8 кг за 2 месяца',
      quote: 'Я наконец-то нашла то, что работает! Без срывов и голодовок',
    },
    {
      name: 'Мария',
      result: '-5 кг за 6 недель',
      quote: 'После родов думала что это невозможно. Программа идеальная!',
    },
    {
      name: 'Екатерина',
      result: '-10 кг за 3 месяца',
      quote: 'Занималась дома с детьми. Это реально работает!',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Top Color Bar */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-pink-500 via-red-500 to-purple-500" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-2xl font-bold text-center text-[#9CA986]">EasyME</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Ваш прогресс
            </span>
            <span className="text-xs font-semibold text-teal-600">100%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-teal-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>

        {/* 🔥 БЛОК 1: РЕЙТИНГ ВВЕРХУ (Trustpilot style) */}
        

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 border border-gray-200"
        >
          <h2 className="text-sm sm:text-base md:text-lg md:text-2xl font-bold text-gray-900 mb-4">
            {quizData.name}, ваш персональный план готов!
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            На основе ваших ответов мы создали индивидуальный план, который поможет вам достичь цели.
          </p>
          
          {/* Таймер блок */}
          <div className="bg-sky-50 rounded-xl p-6 border-2 border-sky-200">
            <h3 className="text-teal-700 font-bold text-lg mb-2 uppercase">
              Персональный план зарезервирован
            </h3>
            <p className="text-gray-700 mb-3">
              Ваш план сохранён на ближайшие 15 минут!
            </p>
            <div className="flex items-center gap-2">
              <p className="text-gray-600 font-medium">Истекает через:</p>
              <p className="text-sm sm:text-base md:text-lg md:text-2xl font-bold text-teal-600">
                {minutes}:{String(seconds).padStart(2, '0')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 border border-gray-200"
        >
          <h3 className="text-gray-500 uppercase text-sm font-semibold mb-4 tracking-wide">
            Цель вашего плана
          </h3>
          <div className="space-y-3">
            {planFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-teal-600" />
                </div>
                <p className="text-gray-800 leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-6 mb-6 border border-gray-200"
        >
          <h3 className="text-gray-500 uppercase text-sm font-semibold mb-2 tracking-wide flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Ваш прогресс к цели
          </h3>
          
          {/* Метрики сверху графика */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-600 mb-1 font-medium">Старт</p>
              <p className="text-2xl font-bold text-gray-900">{current} кг</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-600 mb-1 font-medium">Цель</p>
              <p className="text-2xl font-bold text-[#9CA986]">{target} кг</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-600 mb-1 font-medium">Сбросить</p>
              <p className="text-2xl font-bold text-purple-600">-{difference} кг</p>
            </div>
          </div>

          <div className="mb-4">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <defs>
                  {/* Грдиент для зоны целевого веса */}
                  <linearGradient id="targetZoneGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9CA986" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#9CA986" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid key="grid-paywall" strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                
                <XAxis 
                  key="xaxis-paywall"
                  dataKey="date" 
                  stroke="#6b7280"
                  tick={{ fontSize: 11 }}
                  tickMargin={10}
                />
                
                {/* YAxis с правильным диапазоном */}
                <YAxis 
                  key="yaxis-paywall"
                  domain={[target - 5, current + 5]}
                  stroke="#6b7280"
                  tick={{ fontSize: 11 }}
                  tickMargin={10}
                  label={{ value: 'Вес (кг)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
                />
                
                {/* Референсная линия целевого веса */}
                <ReferenceLine
                  y={target}
                  stroke="#9CA986"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                />
                
                {/* Линия других методов - с откатом */}
                <Line 
                  key="line-other-methods"
                  type="natural" 
                  dataKey="otherMethods" 
                  stroke="#FF6B6B" 
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Другие методы"
                />
                
                {/* Линия EasyME - достижение цели */}
                <Line 
                  key="line-paywall"
                  type="natural" 
                  dataKey="weight" 
                  stroke="#0D9488" 
                  strokeWidth={4}
                  dot={false}
                  name="План EasyME"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Легенда графика */}
          <div className="flex items-center justify-center gap-6 mb-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-10 h-1 bg-[#0D9488] rounded"></div>
              <span className="text-xs text-gray-600 font-medium">План EasyME</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-0.5 border-t-2 border-dashed border-[#FF6B6B]"></div>
              <span className="text-xs text-gray-600 font-medium">Другие методы</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-0.5 border-t-2 border-dashed border-[#9CA986]"></div>
              <span className="text-xs text-gray-600 font-medium">Целевой вес</span>
            </div>
          </div>
          
          {/* Итоговая метрика */}
          <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-4 border-2 border-teal-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1 font-medium uppercase tracking-wide">Достижение цели</p>
                <p className="text-2xl font-bold text-teal-700">{endDateStr}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 mb-1 font-medium uppercase tracking-wide">За {weeksNeeded} недель</p>
                <p className="text-2xl font-bold text-teal-700">-{difference} кг</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🔥 БЛОК 2: 3 КАРТОЧКИ КЕЙСОВ (сразу под графиком) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h3 className="text-center text-xl font-bold text-gray-900 mb-4">
            Реальные результаты участниц
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {successStories.map((story, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-5 border border-green-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                    Фото
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{story.name}</div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  «{story.quote}»
                </p>
                <div className="text-[#9CA986] font-bold text-sm">
                  {story.result}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 🔥 БЛОК 3: ВИДЕО ОТЗЫВЫ (заглушки) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 border border-gray-200"
        >
          <h3 className="text-center text-xl font-bold text-gray-900 mb-6">
            Видео-отзывы участниц
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((video) => (
              <div 
                key={video}
                className="relative aspect-[9/16] bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-[#9CA986] ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-xs font-semibold">
                    Видео отзыв #{video}
                  </p>
                  <p className="text-white/80 text-[10px]">
                    Результат за 2 месяца
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 🔥 НОВЫЙ БЛОК: ФОТО ДО/ПОСЛЕ (заглушки) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 border border-gray-200"
        >
          <h3 className="text-center text-xl font-bold text-gray-900 mb-2">
            Результаты наших участниц
          </h3>
          <p className="text-center text-gray-600 mb-6 text-sm">
            Трансформация за 2-3 месяца
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-3">
                {/* До/После блок */}
                <div className="grid grid-cols-2 gap-2">
                  {/* До */}
                  <div className="relative">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Фото ДО</span>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                      ДО
                    </div>
                  </div>
                  {/* После */}
                  <div className="relative">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Фото ПОСЛЕ</span>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                      ПОСЛЕ
                    </div>
                  </div>
                </div>
                {/* Результат */}
                <div className="text-center">
                  <p className="font-bold text-[#9CA986] text-lg">
                    {item === 1 ? '-12 кг' : item === 2 ? '-9 кг' : '-15 кг'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item === 1 ? '3 месяца' : item === 2 ? '2 месяца' : '4 месяца'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Plan Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 border border-gray-200"
        >
          <h3 className="text-gray-500 uppercase text-sm font-semibold mb-6 tracking-wide">
            Особенности вашего плана
          </h3>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-red-500 text-xl mt-0.5">◆</span>
                <p className="text-gray-800 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 🔥 БЛОК 4: ЭКСПЕРТНОСТЬ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 border-2 border-blue-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#9CA986] rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
              Почему это работает
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            План основан на научных принципах:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-[#9CA986] mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">Постепенное увеличение нагрузки без перегрузок</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-[#9CA986] mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">Работа с отёками и водным балансом</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-[#9CA986] mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">Формирование устойчивых привычек</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white/60 rounded-xl border border-blue-100">
            <p className="text-sm text-gray-600 text-center">
              Именно поэтому результат появляется уже в <span className="font-semibold text-[#9CA986]">первые дни</span>
            </p>
          </div>
        </motion.div>

        {/* 💥 СУПЕР-ФИШКА: 87% статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6 border-2 border-green-100"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Фото результата */}
            <div className="flex-shrink-0">
              <img
                src={alexandraTransformation}
                alt="Результаты трансформации"
                className="w-full md:w-64 rounded-xl shadow-lg"
                loading="eager"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Александра - участница клуба EasyME
              </p>
            </div>

            {/* Текст */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#9CA986] rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm sm:text-base md:text-lg md:text-2xl font-bold text-[#9CA986] mb-1">87%</div>
                  <p className="text-gray-700 font-medium">участниц начинали с той же цели</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 italic">
                Все фото опубликованы с согласия участниц
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 border-2 border-[#9CA986]"
        >
          <div className="text-center mb-6">
            <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
              СКИДКА 50%
            </div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-sm sm:text-base md:text-lg md:text-2xl font-bold text-gray-900">495 ₽/мес</span>
              <span className="text-2xl text-gray-400 line-through">990 ₽</span>
            </div>
            <p className="text-gray-500 text-sm">
              Специальная цена действует только сегодня
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-bold text-gray-900 text-lg mb-4">
              Что вы получаете:
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#9CA986] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">Готовый персональный план</span> — как похудеть на {difference} кг к {endDateStr}
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#9CA986] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">Доступ к клубу EasyME</span> с 1,500 участницами и ежедневными тренировками с большой командой тренеров
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#9CA986] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">300+ тренировок в записи</span> на разные проблемы: похудение, осанка, женское здоровье и другие
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#9CA986] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">Чат с участницами</span> — поддержка и мотивация 24/7
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#9CA986] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">Доступ ко всем материалам навсегда</span> пока активна подписка на клуб
                </p>
              </div>
            </div>
          </div>
          
          
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-xl mb-6"
          onClick={handleGetPlan}
        >
          Получить план и доступ к клубу со скидкой
        </motion.button>

        {/* Footer Timer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="bg-sky-50 rounded-xl p-4 text-center mb-6"
        >
          <p className="text-teal-700 font-medium">
            Персональный план сохранён: {minutes}:{String(seconds).padStart(2, '0')}
          </p>
        </motion.div>

        {/* 🔥 ДОЖИМ: Размытый превью плана внизу страницы */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-lg border-2 border-gray-300 relative overflow-hidden mb-6"
        >
          {/* Контент который размыт - ОСНОВНОЙ ФОН */}
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">Ваш план на {weeksNeeded} недель</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {weeksNeeded * 7} тренировок
              </span>
            </div>

            {/* Сетка тренировок по неделям */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Неделя 1 */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">Неделя 1-2</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#9CA986]"></div>
                    <span className="text-gray-700">Пн: Шагательная 40 мин</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#9CA986]"></div>
                    <span className="text-gray-700">Вт: Йога + растяжка 30 мин</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#9CA986]"></div>
                    <span className="text-gray-700">Ср: Биодинамика 35 мин</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span className="text-gray-500">Чт: Отдых</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#9CA986]"></div>
                    <span className="text-gray-700">Пт: Силовая + кардио 45 мин</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#9CA986]"></div>
                    <span className="text-gray-700">Сб: Танцы 30 мин</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#9CA986]"></div>
                    <span className="text-gray-700">Вс: Активная прогулка 60 мин</span>
                  </div>
                </div>
              </div>

              {/* Неделя 3-4 */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">Неделя 3-4</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#9CA986]"></div>
                    <span className="text-gray-700">Пн: Шагательная усиленная 45 мин</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#9CA986]"></div>
                    <span className="text-gray-700">Вт: Пилатес 35 мин</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#9CA986]"></div>
                    <span className="text-gray-700">Ср: Биодинамика + гантели 40 мин</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span className="text-gray-500">Чт: Отдых</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#9CA986]"></div>
                    <span className="text-gray-700">Пт: HIIT тренировка 35 мин</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#9CA986]"></div>
                    <span className="text-gray-700">Сб: Танцы интенсив 40 мин</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#9CA986]"></div>
                    <span className="text-gray-700">Вс: Йога восстановление 45 мин</span>
                  </div>
                </div>
              </div>

              {/* План питания */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">Ваше питание</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Дневная норма</span>
                    <span className="font-bold text-[#9CA986]">{Math.round(1200 + (current - target) * 50)} ккал</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Завтрак</span>
                      <span className="text-gray-900">380 ккал</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Обед</span>
                      <span className="text-gray-900">520 ккал</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ужин</span>
                      <span className="text-gray-900">450 ккал</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Перекусы</span>
                      <span className="text-gray-900">270 ккал</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Прогресс */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">Ожидаемый результат</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Неделя 2</span>
                      <span className="font-semibold text-[#9CA986]">-2 кг</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#9CA986] h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Неделя 4</span>
                      <span className="font-semibold text-[#9CA986]">-4 кг</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#9CA986] h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Цель ({weeksNeeded} нед)</span>
                      <span className="font-semibold text-green-600">-{difference} кг</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#9CA986]">{weeksNeeded * 7}</div>
                <div className="text-xs text-gray-600">Тренировок</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#9CA986]">{weeksNeeded * 21}</div>
                <div className="text-xs text-gray-600">Приёмов пищи</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#9CA986]">-{difference} кг</div>
                <div className="text-xs text-gray-600">Результат</div>
              </div>
            </div>
          </div>

          {/* Overlay с размытием - ПОВЕРХ КОНТЕНТА */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white/80 backdrop-blur-[3px] flex flex-col items-center justify-center px-4 z-10">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🔒 Ваш план тренировок готов
              </h3>
              <p className="text-gray-600 text-sm">
                Разблокируйте доступ к персональному плану
              </p>
            </div>
            <button
              onClick={handleGetPlan}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl mb-4"
            >
              Разблокировать за 495 ₽/мес
            </button>
            
            {/* Бонусы под кнопкой */}
            <div className="text-center max-w-md">
              <p className="text-xs text-gray-500 font-medium mb-2">А также получите:</p>
              <div className="text-xs text-gray-600 leading-relaxed space-y-1">
                <p>✓ Доступ к клубу EasyME с 1,500 участницами и ежедневными тренировками с большой командой тренеров</p>
                <p>✓ 300+ тренировок в записи на разные проблемы: похудение, осанка, женское здоровье и другие</p>
                <p>✓ Чат с участницами — поддержка и мотивация 24/7</p>
                <p>✓ Доступ ко всем материалам навсегда пока активна подписка на клуб</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}