'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatDate } from '@/lib/utils';

interface LineChartProps {
  data: Array<{ date: string; score: number }>;
  color?: string;
}

export function ScoreLineChart({ data, color = '#3b82f6' }: LineChartProps) {
  const chartData = data
    .map((item) => ({
      date: formatDate(item.date),
      score: item.score,
    }))
    .reverse();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
        <XAxis
          dataKey="date"
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis
          domain={[0, 15]}
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--background)',
            border: '1px solid var(--foreground)',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="score"
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 4 }}
          activeDot={{ r: 6 }}
          name="Score"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

