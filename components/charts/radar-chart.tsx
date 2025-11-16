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
  data: Array<{ section: SectionId; average: number }>;
}

export function StrengthsRadarChart({ data }: RadarChartProps) {
  const chartData = data.map((item) => ({
    section: SECTIONS[item.section].name,
    moyenne: item.average,
  }));

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
        <Radar
          name="Moyenne"
          dataKey="moyenne"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}

