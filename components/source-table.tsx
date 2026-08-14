'use client';

import { useMemo } from 'react';
import { ArrowUpRight, Database, FileSpreadsheet, Globe, Instagram, MapPin, Sparkles, Users } from 'lucide-react';
import type { Lead, LeadSource } from '@/lib/types';

interface SourceTableProps {
  leads: Lead[];
}

interface SourceRow {
  sourceKey: LeadSource;
  sourceName: string;
  prospects: number;
  demos: number;
  replies: number;
  convRate: string;
  icon: React.ElementType;
  iconBg: string;
}

const sourceMeta: Record<LeadSource, { name: string; icon: React.ElementType; iconBg: string }> = {
  instagram: { name: 'Instagram (Apify)', icon: Instagram, iconBg: 'bg-pink-50 text-pink-600 border-pink-100' },
  url_list: { name: 'URL List Scraping', icon: Globe, iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  google_maps: { name: 'Google Maps Search', icon: MapPin, iconBg: 'bg-rose-50 text-rose-600 border-rose-100' },
  linkedin: { name: 'LinkedIn Sales Nav', icon: Users, iconBg: 'bg-blue-50 text-blue-600 border-blue-100' },
  product_hunt: { name: 'Product Hunt Launch', icon: Sparkles, iconBg: 'bg-amber-50 text-amber-600 border-amber-100' },
  apollo: { name: 'Apollo Database', icon: Database, iconBg: 'bg-purple-50 text-purple-600 border-purple-100' },
  csv: { name: 'Manual CSV Upload', icon: FileSpreadsheet, iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
};

export function SourceTable({ leads }: SourceTableProps) {
  const rows = useMemo(() => {
    const grouped = new Map<LeadSource, Lead[]>();
    for (const lead of leads) {
      const list = grouped.get(lead.source) || [];
      list.push(lead);
      grouped.set(lead.source, list);
    }

    const result: SourceRow[] = [];
    for (const [sourceKey, sourceLeads] of grouped.entries()) {
      const meta = sourceMeta[sourceKey] || {
        name: sourceKey,
        icon: Globe,
        iconBg: 'bg-gray-50 text-gray-600 border-gray-100'
      };

      const prospects = sourceLeads.length;
      const demos = sourceLeads.filter((l) => ['demo_ready', 'outreach_sent', 'replied', 'converted'].includes(l.status)).length;
      const replies = sourceLeads.filter((l) => ['replied', 'converted'].includes(l.status)).length;
      const rateNum = prospects > 0 ? (replies / prospects) * 100 : 0;

      result.push({
        sourceKey,
        sourceName: meta.name,
        prospects,
        demos,
        replies,
        convRate: `${rateNum.toFixed(1)}%`,
        icon: meta.icon,
        iconBg: meta.iconBg
      });
    }

    return result.sort((a, b) => b.prospects - a.prospects);
  }, [leads]);

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between pb-4 mb-2">
        <div>
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            Lead Source Performance
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Breakdown of qualified leads and conversion rates by active channel
          </p>
        </div>
        <span className="text-xs font-bold text-gray-400">
          {rows.length} Active {rows.length === 1 ? 'Source' : 'Sources'}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="py-8 text-center text-xs font-semibold text-gray-400">
          No lead sources active yet. Launch a campaign to start gathering data.
        </div>
      ) : (
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
              {rows.map((row) => {
                const Icon = row.icon;
                return (
                  <tr key={row.sourceKey} className="hover:bg-white/60">
                    <td className="py-3.5 pl-2 font-bold text-gray-900">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${row.iconBg}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span>{row.sourceName}</span>
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
      )}
    </div>
  );
}
