'use client';

import { ArrowUpRight, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  badge: string;
  icon: LucideIcon;
  subtext?: string;
  badgeType?: 'positive' | 'neutral';
}

export function MetricCard({
  label,
  value,
  badge,
  icon: Icon,
  subtext = 'vs last mo',
  badgeType = 'positive'
}: MetricCardProps) {
  return (
    <div className="panel metric p-4 sm:p-5 flex flex-col justify-between transition-all hover:translate-y-[-2px] hover:shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase text-gray-500 truncate">
          {label}
        </span>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight truncate">
          {value}
        </div>
        <div
          className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
            badgeType === 'positive'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
              : 'bg-blue-50 text-blue-700 border border-blue-200/60'
          }`}
        >
          <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
          <span>{badge}</span>
        </div>
      </div>
    </div>
  );
}
