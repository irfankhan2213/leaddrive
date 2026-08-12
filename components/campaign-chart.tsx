'use client';

import { useState } from 'react';

const timeSeriesData = [
  { day: 'Mon', prospects: 1200, demos: 340, replies: 42 },
  { day: 'Tue', prospects: 1900, demos: 520, replies: 68 },
  { day: 'Wed', prospects: 2400, demos: 780, replies: 94 },
  { day: 'Thu', prospects: 2100, demos: 690, replies: 88 },
  { day: 'Fri', prospects: 3100, demos: 980, replies: 142 },
  { day: 'Sat', prospects: 1800, demos: 450, replies: 56 },
  { day: 'Sun', prospects: 2685, demos: 732, replies: 110 }
];

export function CampaignChart() {
  const [activeSegment, setActiveSegment] = useState<'prospects' | 'demos' | 'replies'>('demos');

  const maxVal = 3500;
  const width = 500;
  const height = 180;
  const padding = 20;

  // Generate SVG path string
  const points = timeSeriesData.map((d, index) => {
    const x = padding + (index / (timeSeriesData.length - 1)) * (width - 2 * padding);
    const val = d[activeSegment];
    const y = height - padding - (val / maxVal) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${padding},${height - padding} L ${points.join(' L ')} L ${width - padding},${height - padding} Z`;

  return (
    <div className="panel p-6 flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            Campaign Performance
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Automated engine traffic & conversions
          </p>
        </div>

        {/* Segment Toggles */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100/80 border border-gray-200/50">
          <button
            onClick={() => setActiveSegment('prospects')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              activeSegment === 'prospects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Prospects
          </button>
          <button
            onClick={() => setActiveSegment('demos')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              activeSegment === 'demos' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Demos Built
          </button>
          <button
            onClick={() => setActiveSegment('replies')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              activeSegment === 'replies' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Replies
          </button>
        </div>
      </div>

      {/* SVG Chart */}
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
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Line curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#007aff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {timeSeriesData.map((d, index) => {
            const x = padding + (index / (timeSeriesData.length - 1)) * (width - 2 * padding);
            const val = d[activeSegment];
            const y = height - padding - (val / maxVal) * (height - 2 * padding);
            return (
              <g key={index} className="group cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  className="fill-white stroke-blue-600 stroke-[3] transition-all group-hover:r-7"
                />
              </g>
            );
          })}
        </svg>

        {/* X Axis Labels */}
        <div className="flex justify-between px-2 mt-2 text-[11px] font-semibold text-gray-400">
          {timeSeriesData.map((d) => (
            <span key={d.day}>{d.day}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
