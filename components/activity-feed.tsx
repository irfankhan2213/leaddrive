'use client';

import {
  AlertTriangle,
  Bot,
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  MousePointerClick
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'click' | 'complete' | 'ai' | 'bounce' | 'meeting';
  text: string;
  time: string;
  target?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'click',
    text: 'Demo link clicked by Sarah Jenkins',
    target: 'Acme Corp',
    time: '2m ago'
  },
  {
    id: '2',
    type: 'complete',
    text: 'Campaign: Q3 Enterprise Expansion completed sending',
    time: '14m ago'
  },
  {
    id: '3',
    type: 'ai',
    text: 'AI Agent generated 45 personalized demos',
    time: '32m ago'
  },
  {
    id: '4',
    type: 'bounce',
    text: 'Email bounce detected for domain legacy-tech.io',
    time: '1h ago'
  },
  {
    id: '5',
    type: 'meeting',
    text: 'Meeting booked with David Chen',
    target: 'TechFlow',
    time: '2h ago'
  }
];

export function ActivityFeed() {
  return (
    <div className="panel p-6 flex flex-col h-full">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            Live Activity
          </h3>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Real-time
          </span>
        </div>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <span>View All</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Activity List */}
      <div className="mt-4 space-y-3.5 overflow-y-auto max-h-[220px] pr-1">
        {mockActivities.map((act) => {
          let Icon = MousePointerClick;
          let iconBg = 'bg-blue-50 text-blue-600 border-blue-100';

          if (act.type === 'complete') {
            Icon = CheckCircle2;
            iconBg = 'bg-emerald-50 text-emerald-600 border-emerald-100';
          } else if (act.type === 'ai') {
            Icon = Bot;
            iconBg = 'bg-purple-50 text-purple-600 border-purple-100';
          } else if (act.type === 'bounce') {
            Icon = AlertTriangle;
            iconBg = 'bg-rose-50 text-rose-600 border-rose-100';
          } else if (act.type === 'meeting') {
            Icon = CalendarCheck;
            iconBg = 'bg-amber-50 text-amber-600 border-amber-100';
          }

          return (
            <div
              key={act.id}
              className="flex items-start justify-between gap-3 p-2.5 rounded-xl hover:bg-white/60 transition-colors border border-transparent hover:border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 leading-snug">
                    {act.text}
                    {act.target && (
                      <span className="font-bold text-gray-900 ml-1 text-blue-600">
                        ({act.target})
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                {act.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
