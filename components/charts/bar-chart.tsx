'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SECTIONS, SectionId } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

interface BarChartProps {
  data: Array<{ section: SectionId; score: number; date: string }>;
}

export function RecentScoresBarChart({ data }: BarChartProps) {
  const chartData = data.slice(0, 10).map((item) => ({
    section: SECTIONS[item.section].name,
    score: item.score,
    date: formatDate(item.date),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
        <XAxis
          dataKey="section"
          className="text-xs"
          tick={{ fill: 'currentColor' }}
          angle={-45}
          textAnchor="end"
          height={100}
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
        <Bar dataKey="score" fill="#3b82f6" name="Score" />
      </BarChart>
    </ResponsiveContainer>
  );
}

