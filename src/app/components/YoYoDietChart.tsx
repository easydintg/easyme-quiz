import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

const yoyoData = [
  { month: 'Янв', weight: 80 },
  { month: 'Фев', weight: 75 },
  { month: 'Мар', weight: 73 },
  { month: 'Апр', weight: 78 },
  { month: 'Май', weight: 74 },
  { month: 'Июн', weight: 72 },
  { month: 'Июл', weight: 76 },
  { month: 'Авг', weight: 73 },
  { month: 'Сен', weight: 77 },
  { month: 'Окт', weight: 75 },
  { month: 'Ноя', weight: 79 },
  { month: 'Дек', weight: 80 },
];

export function YoYoDietChart() {
  return (
    <div className="w-full h-[300px] bg-white p-6 rounded-xl border-2 border-gray-200">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={yoyoData}>
          <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            key="xaxis"
            dataKey="month" 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            key="yaxis"
            domain={[70, 82]}
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            label={{ value: 'Вес (кг)', angle: -90, position: 'insideLeft' }}
          />
          <ReferenceLine 
            key="refline"
            y={80} 
            stroke="#ef4444" 
            strokeDasharray="5 5"
            label={{ value: 'Начальный вес', position: 'right', fill: '#ef4444' }}
          />
          <Line 
            key="line"
            type="monotone" 
            dataKey="weight" 
            stroke="#ef4444" 
            strokeWidth={3}
            dot={{ fill: '#ef4444', r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}