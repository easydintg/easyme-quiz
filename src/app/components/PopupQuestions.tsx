interface PopupQuestionsProps {
  familyHealthHistory: string;
  regularMealTimes: string;
  dayActivity: string;
  onFamilyHealthHistoryChange: (value: string) => void;
  onRegularMealTimesChange: (value: string) => void;
  onDayActivityChange: (value: string) => void;
}

export function PopupQuestions({
  familyHealthHistory,
  regularMealTimes,
  dayActivity,
  onFamilyHealthHistoryChange,
  onRegularMealTimesChange,
  onDayActivityChange,
}: PopupQuestionsProps) {
  return (
    <div className="space-y-6">
      {/* Question 1 */}
      <div>
        <p className="text-lg font-semibold text-gray-900 mb-4">
          Есть ли в вашей расширенной семье случаи сердечных заболеваний или диабета?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onFamilyHealthHistoryChange('no')}
            className={`p-4 rounded-lg border-2 transition-all ${
              familyHealthHistory === 'no'
                ? 'border-[#9CA986] bg-[#9CA986]/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-lg font-medium text-gray-900">Нет</span>
          </button>
          <button
            onClick={() => onFamilyHealthHistoryChange('yes')}
            className={`p-4 rounded-lg border-2 transition-all ${
              familyHealthHistory === 'yes'
                ? 'border-[#9CA986] bg-[#9CA986]/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-lg font-medium text-gray-900">Да</span>
          </button>
        </div>
      </div>

      {/* Question 2 */}
      <div>
        <p className="text-lg font-semibold text-gray-900 mb-4">
          Вы едите примерно в одно и то же время каждый день?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onRegularMealTimesChange('no')}
            className={`p-4 rounded-lg border-2 transition-all ${
              regularMealTimes === 'no'
                ? 'border-[#9CA986] bg-[#9CA986]/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-lg font-medium text-gray-900">Нет</span>
          </button>
          <button
            onClick={() => onRegularMealTimesChange('yes')}
            className={`p-4 rounded-lg border-2 transition-all ${
              regularMealTimes === 'yes'
                ? 'border-[#9CA986] bg-[#9CA986]/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-lg font-medium text-gray-900">Да</span>
          </button>
        </div>
      </div>

      {/* Question 3 */}
      <div>
        <p className="text-lg font-semibold text-gray-900 mb-4">
          Вы обычно проводите большую часть дня на ногах или сидя?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onDayActivityChange('sitting')}
            className={`p-4 rounded-lg border-2 transition-all ${
              dayActivity === 'sitting'
                ? 'border-[#9CA986] bg-[#9CA986]/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-lg font-medium text-gray-900">Сидя</span>
          </button>
          <button
            onClick={() => onDayActivityChange('standing')}
            className={`p-4 rounded-lg border-2 transition-all ${
              dayActivity === 'standing'
                ? 'border-[#9CA986] bg-[#9CA986]/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-lg font-medium text-gray-900">На ногах</span>
          </button>
        </div>
      </div>
    </div>
  );
}
