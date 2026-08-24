'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  MousePointerClick,
  RefreshCw,
  Search,
  Sparkles,
  Zap
} from 'lucide-react';
import type { Lead } from '@/lib/types';

interface ActivityFeedProps {
  leads: Lead[];
}

interface ActivityItem {
  id: string;
  type: 'opened' | 'clicked' | 'demo' | 'outreach' | 'qualified' | 'search' | 'new';
  text: string;
  target?: string;
  timestamp: string;
}

export function ActivityFeed({ leads }: ActivityFeedProps) {
  const [dbEvents, setDbEvents] = useState<Array<{
    id: string;
    event_type: string;
    created_at: string;
    leads?: { company_name?: string; contact_name?: string } | null;
  }>>([]);
  const [loading, setLoading] = useState(false);

  async function fetchDbEvents() {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.events && Array.isArray(data.events)) {
        setDbEvents(data.events);
      }
    } catch {
      // Fallback to local events
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDbEvents();
    const interval = setInterval(fetchDbEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  const activities: ActivityItem[] = [];

  // Add real DB events if available
  for (const dbEv of dbEvents) {
    const target = dbEv.leads?.company_name || 'Prospect';
    let type: ActivityItem['type'] = 'new';
    let text = `Event recorded for ${target}`;

    if (dbEv.event_type === 'opened') {
      type = 'opened';
      text = `Email open detected`;
    } else if (dbEv.event_type === 'clicked') {
      type = 'clicked';
      text = `Demo link clicked`;
    } else if (dbEv.event_type === 'sent') {
      type = 'outreach';
      text = `Cold outreach message sent`;
    } else if (dbEv.event_type === 'replied') {
      type = 'qualified';
      text = `Prospect replied to outreach`;
    }

    activities.push({
      id: `db_${dbEv.id}`,
      type,
      text,
      target,
      timestamp: dbEv.created_at
    });
  }

  // Derive activities from leads array — engagement first, then grouped
  // discovery lines so a 25-lead campaign doesn't produce 25 near-identical rows.
  for (const lead of leads) {
    if (lead.replies > 0) {
      activities.push({
        id: `reply_${lead.id}`,
        type: 'qualified',
        text: `Prospect replied — hot lead`,
        target: lead.company_name,
        timestamp: lead.created_at
      });
    }

    if (lead.opens > 0) {
      activities.push({
        id: `open_${lead.id}`,
        type: 'opened',
        text: `${lead.opens} email open${lead.opens > 1 ? 's' : ''} recorded`,
        target: lead.company_name,
        timestamp: lead.created_at
      });
    }

    if (lead.clicks > 0) {
      activities.push({
        id: `click_${lead.id}`,
        type: 'clicked',
        text: `${lead.clicks} demo click${lead.clicks > 1 ? 's' : ''} recorded`,
        target: lead.company_name,
        timestamp: lead.created_at
      });
    }

    if (lead.demo_url && lead.demo_url.startsWith('http')) {
      activities.push({
        id: `demo_${lead.id}`,
        type: 'demo',
        text: 'AI demo generated & preview ready',
        target: lead.company_name,
        timestamp: lead.created_at
      });
    }

    if (lead.status === 'outreach_sent') {
      activities.push({
        id: `sent_${lead.id}`,
        type: 'outreach',
        text: 'Outreach dispatched with live demo',
        target: lead.company_name,
        timestamp: lead.created_at
      });
    }
  }

  // Group discovery by keyword: "8 leads found via <query>" instead of 8 rows.
  const discoveryByKeyword = new Map<string, { count: number; ts: string }>();
  for (const lead of leads) {
    if (!lead.matched_keyword) continue;
    const key = lead.matched_keyword;
    const existing = discoveryByKeyword.get(key);
    if (existing) {
      existing.count += 1;
      if (lead.created_at > existing.ts) existing.ts = lead.created_at;
    } else {
      discoveryByKeyword.set(key, { count: 1, ts: lead.created_at });
    }
  }
  for (const [keyword, info] of discoveryByKeyword) {
    activities.push({
      id: `search_${keyword}`,
      type: 'search',
      text: `${info.count} lead${info.count > 1 ? 's' : ''} discovered via "${keyword}"`,
      timestamp: info.ts
    });
  }

  // Deduplicate, sort newest-first, limit
  const uniqueMap = new Map<string, ActivityItem>();
  for (const item of activities) {
    if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
  }
  const displayActivities = Array.from(uniqueMap.values())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

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
        <button
          onClick={fetchDbEvents}
          disabled={loading}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 p-1 rounded-lg hover:bg-blue-50 transition-colors"
          title="Refresh activity logs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Activity List */}
      <div className="mt-4 space-y-3.5 overflow-y-auto max-h-[220px] pr-1">
        {displayActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs font-semibold text-gray-400">No activity logged yet</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Launch a campaign to record live events</p>
          </div>
        ) : (
          displayActivities.map((act) => {
            let Icon = Zap;
            let iconBg = 'bg-gray-50 text-gray-600 border-gray-100';

            if (act.type === 'clicked' || act.type === 'opened') {
              Icon = MousePointerClick;
              iconBg = 'bg-blue-50 text-blue-600 border-blue-100';
            } else if (act.type === 'outreach') {
              Icon = Sparkles;
              iconBg = 'bg-purple-50 text-purple-600 border-purple-100';
            } else if (act.type === 'demo') {
              Icon = Bot;
              iconBg = 'bg-amber-50 text-amber-600 border-amber-100';
            } else if (act.type === 'qualified') {
              Icon = CheckCircle2;
              iconBg = 'bg-emerald-50 text-emerald-600 border-emerald-100';
            } else if (act.type === 'search') {
              Icon = Search;
              iconBg = 'bg-indigo-50 text-indigo-600 border-indigo-100';
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
                        <span className="font-bold text-blue-600 ml-1">
                          ({act.target})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                  {formatRelativeTime(act.timestamp)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recent';
  }
}
