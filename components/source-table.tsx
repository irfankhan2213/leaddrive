'use client';

import { ArrowUpRight, Database, FileSpreadsheet, Globe, Users } from 'lucide-react';

interface SourceRow {
  source: string;
  prospects: string;
  demos: string;
  replies: string;
  convRate: string;
  icon: React.ElementType;
  iconBg: string;
}

const sources: SourceRow[] = [
  {
    source: 'Apollo Integration',
    prospects: '9,540',
    demos: '1,820',
    replies: '342',
    convRate: '5.2%',
    icon: Database,
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100'
  },
  {
    source: 'Manual CSV Upload',
    prospects: '4,120',
    demos: '960',
    replies: '130',
    convRate: '3.1%',
    icon: FileSpreadsheet,
    iconBg: 'bg-purple-50 text-purple-600 border-purple-100'
  },
  {
    source: 'Website Inbound',
    prospects: '2,850',
    demos: '520',
    replies: '104',
    convRate: '3.6%',
    icon: Globe,
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  },
  {
    source: 'Partner Referrals',
    prospects: '776',
    demos: '202',
    replies: '65',
    convRate: '8.4%',
    icon: Users,
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100'
  }
];

export function SourceTable() {
  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between pb-4 mb-2">
        <div>
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            Lead Source Performance
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Breakdown of qualified leads and conversion rates by channel
          </p>
        </div>
        <span className="text-xs font-bold text-gray-400">4 Active Channels</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left glass-table">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              <th className="pb-3 pl-2">Source</th>
              <th className="pb-3 text-right">Prospects</th>
              <th className="pb-3 text-right">Demos Built</th>
              <th className="pb-3 text-right">Replies</th>
              <th className="pb-3 text-right pr-2">Conv. Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/60 text-xs">
            {sources.map((row) => {
              const Icon = row.icon;
              return (
                <tr key={row.source} className="hover:bg-white/60">
                  <td className="py-3.5 pl-2 font-bold text-gray-900">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${row.iconBg}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{row.source}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-right font-semibold text-gray-700">
                    {row.prospects}
                  </td>
                  <td className="py-3.5 text-right font-semibold text-gray-700">
                    {row.demos}
                  </td>
                  <td className="py-3.5 text-right font-semibold text-gray-700">
                    {row.replies}
                  </td>
                  <td className="py-3.5 text-right pr-2 font-bold text-emerald-600">
                    <div className="flex items-center justify-end gap-1">
                      <span>{row.convRate}</span>
                      <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
