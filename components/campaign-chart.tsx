'use client';

import { useMemo, useState } from 'react';
import type { Lead } from '@/lib/types';

interface CampaignChartProps {
  leads: Lead[];
}

type Segment = 'fit_score' | 'status' | 'source';

export function CampaignChart({ leads }: CampaignChartProps) {
  const [activeSegment, setActiveSegment] = useState<Segment>('fit_score');

  const chartData = useMemo(() => {
    if (activeSegment === 'fit_score') {
      const buckets = [
        { label: '90-100', min: 90, max: 100 },
        { label: '70-89', min: 70, max: 89 },
        { label: '55-69', min: 55, max: 69 },
        { label: '40-54', min: 40, max: 54 },
        { label: '0-39', min: 0, max: 39 }
      ];
      return buckets.map((b) => ({
        label: b.label,
        value: leads.filter((l) => l.fit_score >= b.min && l.fit_score <= b.max).length
      }));
    }

    if (activeSegment === 'status') {
      const statusOrder = ['scraped', 'qualified', 'demo_ready', 'outreach_sent', 'replied', 'converted'] as const;
      return statusOrder.map((s) => ({
        label: s.replace('_', ' '),
        value: leads.filter((l) => l.status === s).length
      }));
    }

    // source
    const sourceMap = new Map<string, number>();
    for (const l of leads) {
      sourceMap.set(l.source, (sourceMap.get(l.source) || 0) + 1);
    }
    return Array.from(sourceMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label: label.replace('_', ' '), value }));
  }, [leads, activeSegment]);

  const maxVal = Math.max(1, ...chartData.map((d) => d.value));

  const width = 500;
  const height = 180;
  const padding = 20;

  const points = chartData.map((d, index) => {
    const x = chartData.length === 1
      ? width / 2
      : padding + (index / (chartData.length - 1)) * (width - 2 * padding);
    const y = height - padding - (d.value / maxVal) * (height - 2 * padding);
    return { x, y, value: d.value };
  });

  const pathD = points.length > 1
    ? `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`
    : '';

  const areaD = points.length > 1
    ? `M ${padding},${height - padding} L ${points.map((p) => `${p.x},${p.y}`).join(' L ')} L ${width - padding},${height - padding} Z`
    : '';

  return (
    <div className="panel p-6 flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            Campaign Performance
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {leads.length === 0
              ? 'Launch a campaign to see performance data'
              : `${leads.length} lead${leads.length === 1 ? '' : 's'} in current campaign`}
          </p>
        </div>

        {/* Segment Toggles */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100/80 border border-gray-200/50">
          <button
            onClick={() => setActiveSegment('fit_score')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              activeSegment === 'fit_score' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Fit Score
          </button>
          <button
            onClick={() => setActiveSegment('status')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              activeSegment === 'status' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Status
          </button>
          <button
            onClick={() => setActiveSegment('source')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              activeSegment === 'source' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Source
          </button>
        </div>
      </div>

      {/* SVG Chart */}
      {leads.length === 0 ? (
        <div className="flex items-center justify-center h-[180px] text-sm text-gray-400 font-medium">
          No data yet — launch your first campaign
        </div>
      ) : (
        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007aff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#007aff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.33, 0.66, 1].map((pct, i) => {
              const y = height - padding - pct * (height - 2 * padding);
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              );
            })}

            {/* Area under curve */}
            {areaD && <path d={areaD} fill="url(#chartGradient)" />}

            {/* Line curve */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#007aff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points */}
            {points.map((p, index) => (
              <g key={index} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  className="fill-white stroke-blue-600 stroke-[3] transition-all group-hover:r-7"
                />
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  className="fill-gray-500 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {p.value}
                </text>
              </g>
            ))}
          </svg>

          {/* X Axis Labels */}
          <div className="flex justify-between px-2 mt-2 text-[11px] font-semibold text-gray-400">
            {chartData.map((d) => (
              <span key={d.label} className="truncate max-w-[80px] text-center">{d.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
