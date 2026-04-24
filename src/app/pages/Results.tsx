import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowRight, Calendar, Target, TrendingDown, Activity, Apple, Flame, BarChart3 } from 'lucide-react';

interface QuizData {
  gender: string;
  age: string;
  currentWeight: string;
  targetWeight: string;
  height: string;
  activity: string;
  goal: string;
  timeframe: string;
  weeksToGoal?: number;
  targetDateTimestamp?: number;
  optimizedTargetDateTimestamp?: number;
}

export function Results() {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [weightData, setWeightData] = useState<any[]>([]);
  const [macrosData, setMacrosData] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('quizData');
    if (data) {
      const parsed = JSON.parse(data);
      setQuizData(parsed);
      generateChartData(parsed);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const generateChartData = (data: QuizData) => {
    const current = Number(data.currentWeight);
    const target = Number(data.targetWeight);
    const difference = current - target;
    
    // Calculate weeks needed - OPTIMIZED (1 week faster, same as Step 50 and Paywall)
    const weightToLose = difference;
    const originalWeeksEstimate = Math.round(weightToLose * 2); // ~2 weeks per kg
    const weeksNeeded = Math.max(originalWeeksEstimate - 1, 4); // 1 week faster, minimum 4 weeks
    
    // Weight progression
    const weightPoints = [];
    const weeklyLoss = weightToLose / weeksNeeded;
    
    for (let i = 0; i <= weeksNeeded; i++) {
      const weight = Math.max(current - (weeklyLoss * i), target);
      weightPoints.push({
        week: i,
        weight: Math.round(weight * 10) / 10,
      });
    }
    setWeightData(weightPoints);

    // Macros data
    setMacrosData([
      { name: 'Белки', value: 125, color: '#3b82f6' },
      { name: 'Углеводы', value: 190, color: '#10b981' },
      { name: 'Жиры', value: 55, color: '#f59e0b' },
    ]);
  };

  if (!quizData) return null;

  const current = Number(quizData.currentWeight);
  const target = Number(quizData.targetWeight);
  const difference = current - target;
  
  // Calculate weeks needed - OPTIMIZED (1 week faster)
  const weightToLose = difference;
  const originalWeeksEstimate = Math.round(weightToLose * 2);
  const weeksNeeded = Math.max(originalWeeksEstimate - 1, 4);
  const monthsNeeded = Math.ceil(weeksNeeded / 4);
  const weeklyLoss = Math.round((weightToLose / weeksNeeded) * 10) / 10; // kg per week

  // Get optimized target date
  const optimizedTargetDate = quizData.optimizedTargetDateTimestamp 
    ? new Date(quizData.optimizedTargetDateTimestamp)
    : null;
  
  const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const targetDateStr = optimizedTargetDate 
    ? `${optimizedTargetDate.getDate()} ${monthNames[optimizedTargetDate.getMonth()]}`
    : '';

  // Calculate BMR
  const height = Number(quizData.height);
  const age = parseInt(quizData.age.split('-')[0]);
  let bmr = 0;
  if (quizData.gender === 'male') {
    bmr = 10 * current + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * current + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    high: 1.725,
    extreme: 1.9,
  };

  const tdee = Math.round(bmr * activityMultipliers[quizData.activity]);
  const targetCalories = tdee - (quizData.timeframe === 'fast' ? 750 : quizData.timeframe === 'balanced' ? 500 : 300);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-semibold text-gray-900">EasyME</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm font-medium">
            <Target className="w-4 h-4" />
            Ваш персональный план готов
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Результаты расчёта
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Персональный план достижения вашей цели на основе введённых данных
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-gray-600">Цель</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">-{difference} кг</div>
            <div className="text-sm text-gray-600">{current} → {target} кг</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-sm font-medium text-gray-600">Срок</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {monthsNeeded} {monthsNeeded === 1 ? 'месяц' : monthsNeeded < 5 ? 'месяца' : 'месяцев'}
            </div>
            <div className="text-sm text-gray-600">
              {targetDateStr ? `До ${targetDateStr} (~${weeksNeeded} недель)` : `~${weeksNeeded} недель`}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-sm font-medium text-gray-600">Калории/день</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{targetCalories}</div>
            <div className="text-sm text-gray-600">TDEE: {tdee}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-sm font-medium text-gray-600">Темп</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{weeklyLoss} кг</div>
            <div className="text-sm text-gray-600">в неделю</div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Weight Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Прогноз снижения веса
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid key="grid-results" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    key="xaxis-results"
                    dataKey="week" 
                    label={{ value: 'Недели', position: 'insideBottom', offset: -5 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    key="yaxis-results"
                    label={{ value: 'Вес (кг)', angle: -90, position: 'insideLeft' }}
                    domain={[target - 1, current + 1]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    key="tooltip-results"
                    formatter={(value: any) => [`${value} кг`, 'Вес']}
                    labelFormatter={(label) => `Неделя ${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    key="line-results"
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Macros Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Распределение макронутриентов
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={macrosData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis label={{ value: 'Граммы', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: any) => [`${value}г`, '']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {macrosData.map((entry, index) => (
                      <motion.rect
                        key={index}
                        fill={entry.color}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              {macrosData.map((macro, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                    <span className="text-sm text-gray-600">{macro.name}</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{macro.value}г</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Plan Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 mb-12"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Рекомендации для достижения цели
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Apple className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Питание</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Калории: {targetCalories} ккал/день</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>5-6 приёмов пищи в день</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Баланс макронутриентов</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>2-3 литра воды в день</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Тренировки</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    {quizData.activity === 'sedentary' ? '3' : 
                     quizData.activity === 'light' ? '3-4' :
                     quizData.activity === 'moderate' ? '4-5' : '5-6'} тренировки в неделю
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>45-60 минут на тренировку</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Кардио + силовые упражнения</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Отдых между тренировками</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Контроль</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Взвешивание каждое утро</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Ведение дневника питания</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Фото прогресса раз в неделю</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Корректировка плана по результатам</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-blue-600 rounded-xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            Готовы начать путь к цели?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Получите полный доступ к персональному плану питания, программе тренировок и инструментам отслеживания прогресса
          </p>
          <button
            onClick={() => navigate('/plan')}
            className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
          >
            Получить полный план
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}