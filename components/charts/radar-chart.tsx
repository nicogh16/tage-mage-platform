'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SECTIONS, SectionId } from '@/lib/constants';

interface RadarChartProps {
  data: Array<{ section: SectionId; average: number; min?: number; max?: number }>;
}

export function StrengthsRadarChart({ data }: RadarChartProps) {
  const chartData = data.map((item) => ({
    section: SECTIONS[item.section].name,
    moyenne: item.average,
    min: item.min || 0,
    max: item.max || 0,
  }));

  // Check if we have min/max data
  const hasMinMax = data.some(item => item.min !== undefined && item.max !== undefined);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={chartData}>
        <PolarGrid className="stroke-gray-300 dark:stroke-gray-700" />
        <PolarAngleAxis
          dataKey="section"
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 15]}
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        {hasMinMax && (
          <>
            <Radar
              name="Min"
              dataKey="min"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.2}
              strokeWidth={1}
            />
            <Radar
              name="Max"
              dataKey="max"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.2}
              strokeWidth={1}
            />
          </>
        )}
        <Radar
          name="Moyenne"
          dataKey="moyenne"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.6}
          strokeWidth={2}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}

