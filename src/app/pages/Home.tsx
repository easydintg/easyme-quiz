import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle, BarChart3, Users, Award, TrendingUp, Star, Play } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import logo from 'figma:asset/15026009c8c482650b861dfa3b38035558e9dec0.png';
import { useState, useEffect } from 'react';
import { saveUrlParams } from '../utils/urlParams';

export function Home() {
  const navigate = useNavigate();

  // Сохраняем параметры от SaleBot при первом входе
  useEffect(() => {
    saveUrlParams();
  }, []);

  // Массив отзывов для ротации
  const testimonials = [
    {
      name: 'Анна, 34 года',
      text: '«Я не верила, что смогу сбросить вес после родов. За 2 месяца минус 6 кг, ушёл живот, тренировки по 15 минут дома»',
      result: '-6 кг за 2 месяца',
      duration: '15 мин/день'
    },
    {
      name: 'Мария, 28 лет',
      text: '«Впервые за много лет я получила план, который реально работает! Минус 8 кг за 3 месяца без жёстких диет»',
      result: '-8 кг за 3 месяца',
      duration: '20 мин/день'
    },
    {
      name: 'Елена, 42 года',
      text: '«После 40 думала, что уже поздно. Но программа доказала обратное! Ушло 10 кг, появилась энергия и уверенность»',
      result: '-10 кг за 4 месяца',
      duration: '25 мин/день'
    },
    {
      name: 'Ольга, 31 год',
      text: '«Занимаюсь дома, пока ребёнок спит. За месяц минус 4 кг, и это только начало! Тренер в Telegram всегда поддерживает»',
      result: '-4 кг за месяц',
      duration: '15 мин/день'
    }
  ];

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Автоматическая смена отзывов каждые 4 секунды
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(147, 197, 253, 0.03) 0%, rgba(147, 197, 253, 0) 70%)',
            filter: 'blur(80px)',
            top: '-200px',
            left: '-100px',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(203, 213, 225, 0.02) 0%, rgba(203, 213, 225, 0) 70%)',
            filter: 'blur(90px)',
            top: '20%',
            right: '-200px',
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(186, 230, 253, 0.02) 0%, rgba(186, 230, 253, 0) 70%)',
            filter: 'blur(100px)',
            bottom: '10%',
            left: '30%',
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(224, 242, 254, 0.015) 0%, rgba(224, 242, 254, 0) 70%)',
            filter: 'blur(70px)',
            bottom: '-100px',
            right: '20%',
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, -70, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header with Glass Effect */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="bg-white/30 backdrop-blur-2xl border border-white/30 shadow-xl rounded-[32px]">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="EasyME Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-semibold text-[#9CA986]">EasyME</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-16 pt-24 sm:pt-28 md:pt-32 relative z-10">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          {/* Centered Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-16 px-4"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6 text-sm font-medium text-[#9ca986]">
              <TrendingUp className="w-4 h-4" />
              Сегодня создано 117 планов
            </div>
            
            <h1 className="font-bold mb-3 sm:mb-4 md:mb-6 leading-tight text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-[#9ca986]">
              Персональная программа снижения веса
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4 md:mb-6 leading-relaxed text-[#607147] max-w-3xl mx-auto">
              Узнай точное время достижения цели и получи индивидуальный план питания и тренировок, основанный на твоих данных.
            </p>

            {/* МИНИ-КЕЙС ПОД ЗАГОЛОВКОМ - с автоматической сменой отзывов */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-3 sm:p-4 md:p-5 mb-3 sm:mb-4 md:mb-6 max-w-2xl mx-auto border border-green-100 relative overflow-hidden" style={{ minHeight: '180px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex items-start gap-4"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                    Фото
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        {testimonials[currentTestimonialIndex].name}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      {testimonials[currentTestimonialIndex].text}
                    </p>
                    <div className="flex gap-4 text-xs">
                      <span className="text-[#9CA986] font-semibold">
                        {testimonials[currentTestimonialIndex].result}
                      </span>
                      <span className="text-gray-500">
                        • {testimonials[currentTestimonialIndex].duration}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Индикаторы прогресса */}
              <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonialIndex
                        ? 'bg-[#9CA986] w-6'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Показать отзыв ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/quiz')}
              className="bg-[#9CA986] hover:bg-[#8a9877] text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg text-sm sm:text-base font-semibold inline-flex items-center gap-2 transition-colors mb-8"
            >
              Получить план
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Бесплатный расчёт</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Займёт 2 минуты</span>
              </div>
            </div>
          </motion.div>

          {/* Horizontal Stats Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Пример расчёта</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Реальный результат
              </span>
            </div>

            <div className="grid lg:grid-cols-[300px_1fr_1fr] gap-8">
              {/* Progress Section */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        stroke="#9CA986"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={2 * Math.PI * 42 * 0.62}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-xl font-bold text-gray-900">38%</span>
                      <span className="text-xs text-gray-500">цели</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Текущий вес</div>
                        <div className="text-lg font-semibold text-gray-900">65 кг</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">71 → 55 кг</div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-[#9CA986] h-1.5 rounded-full" style={{ width: '38%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Калории</div>
                    <div className="font-semibold text-gray-900">1,650</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Тренировок</div>
                    <div className="font-semibold text-gray-900">5/нед</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Срок</div>
                    <div className="font-semibold text-gray-900">3 мес</div>
                  </div>
                </div>
              </div>

              {/* Workout Plan Preview - Blurred */}
              <div className="relative overflow-hidden rounded-lg border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white z-10 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="bg-[#9CA986] text-white px-5 py-2 rounded-full font-semibold text-sm shadow-lg">
                    🔓 Доступно после квиза
                  </div>
                </div>
                <div className="p-4 bg-gray-50 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-[#9CA986]" />
                    <span className="text-sm font-semibold text-gray-900">План тренировок</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#9CA986] flex-shrink-0"></div>
                      <span className="text-xs text-gray-700">Пн: Шагательная 40 мин</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#9CA986] flex-shrink-0"></div>
                      <span className="text-xs text-gray-700">Ср: Биодинамика 35 мин</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#9CA986] flex-shrink-0"></div>
                      <span className="text-xs text-gray-700">Пт: Силовая + кардио 45 мин</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#9CA986] flex-shrink-0"></div>
                      <span className="text-xs text-gray-700">Сб: Йога + растяжка 30 мин</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nutrition Plan Preview - Blurred */}
              <div className="relative overflow-hidden rounded-lg border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white z-10 backdrop-blur-[2px]"></div>
                <div className="p-4 bg-gray-50 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-[#9CA986]" />
                    <span className="text-sm font-semibold text-gray-900">План питания</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white p-2.5 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Завтрак</div>
                      <div className="text-xs text-gray-700">Овсянка с ягодами</div>
                      <div className="text-xs font-semibold text-[#9CA986]">320 ккал</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Обед</div>
                      <div className="text-xs text-gray-700">Куриная грудка с овощами</div>
                      <div className="text-xs font-semibold text-[#9CA986]">450 ккал</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Ужин</div>
                      <div className="text-xs text-gray-700">Рыба с салатом</div>
                      <div className="text-xs font-semibold text-[#9CA986]">380 ккал</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-24"
        >
          {[
            { value: '1,496', label: 'Активных участниц', change: '+23% за месяц' },
            { value: '15.2 кг', label: 'Средняя потеря веса', change: 'За 12 недель' },
            { value: '94%', label: 'Достигают целей', change: 'В первые 3 месяца' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200"
            >
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-900 font-medium mb-1">{stat.label}</div>
              <div className="text-sm text-green-600">{stat.change}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Как это работает
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Научный подход к похудению в 3 простых шага
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Анализ данных',
                description: 'Отвечаешь на вопросы о своём образе жизни, целях и предпочтениях',
              },
              {
                step: '2',
                title: 'Расчёт плана',
                description: 'Алгоритм рассчитывает калории, макронутриенты и время достижения цели',
              },
              {
                step: '3',
                title: 'Достижение результата',
                description: 'Следуешь персональному плану и отслеживаешь прогресс в приложении',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 h-full">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xl mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-[#9CA986]/20 rounded-2xl p-6 sm:p-8 md:p-12 text-center"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-gray-900">
            Готова рассчитать срок достижения твоей цели?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Получи персональный расчёт времени и план действий за 2 минуты
          </p>
          <button
            onClick={() => navigate('/quiz')}
            className="bg-[#9CA986] text-white hover:bg-[#8a9877] px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg text-sm sm:text-base font-semibold inline-flex items-center gap-2 transition-colors"
          >
            Начать расчёт
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>© 2026 EasyME. Все права защищены.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-900">Политика конфиденциальности</a>
              <a href="#" className="hover:text-gray-900">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}