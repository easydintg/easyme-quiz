// Утилита для работы с URL параметрами от SaleBot

/**
 * Сохраняет все URL параметры в localStorage
 * Вызывается при первом входе на сайт
 */
export function saveUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  
  // Собираем все параметры из URL
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  
  // Сохраняем только если есть хоть один параметр
  if (Object.keys(params).length > 0) {
    localStorage.setItem('saleBotParams', JSON.stringify(params));
    console.log('✅ SaleBot параметры сохранены:', params);
  }
}

/**
 * Получает сохранённые параметры от SaleBot
 */
export function getSavedParams(): Record<string, string> {
  const saved = localStorage.getItem('saleBotParams');
  return saved ? JSON.parse(saved) : {};
}

/**
 * Формирует ссылку для редиректа в Telegram бот
 */
export function buildTelegramLink(quizData: any, botUsername: string): string {
  const savedParams = getSavedParams();
  
  // Извлекаем данные квиза
  const current = Number(quizData.currentWeight);
  const target = Number(quizData.targetWeight);
  const difference = Math.abs(current - target);
  
  // Рассчитываем недели и дату
  const weightToLose = current - target;
  const originalWeeksEstimate = quizData.weeksToGoal || Math.ceil(weightToLose / 1.95);
  const weeksNeeded = Math.max(originalWeeksEstimate - 1, 4);
  
  const optimizedTargetDate = quizData.optimizedTargetDateTimestamp 
    ? new Date(quizData.optimizedTargetDateTimestamp)
    : null;
  const endDate = optimizedTargetDate || new Date(Date.now() + weeksNeeded * 7 * 24 * 60 * 60 * 1000);
  const endDateStr = endDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace(' ', '');
  
  // Собираем параметры для бота
  const params = [];
  
  // Добавляем user_id или client_id если есть
  const userId = savedParams.user_id || savedParams.client_id || savedParams.chat_id || 'unknown';
  params.push(userId);
  
  // Добавляем данные квиза
  params.push(`вес${current}`);
  params.push(`цель${target}`);
  params.push(`минус${difference}`);
  params.push(`${weeksNeeded}нед`);
  params.push(endDateStr);
  
  // Формируем строку для start параметра
  const startParam = params.join('_');
  
  // Возвращаем полную ссылку на бота
  return `https://t.me/${botUsername}?start=${startParam}`;
}
