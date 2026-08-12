'use client';

import {
  BarChart3,
  Bot,
  HelpCircle,
  Kanban,
  LayoutDashboard,
  Settings,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';

export type NavTab = 'dashboard' | 'prospecting' | 'demos' | 'pipeline' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems: Array<{ id: NavTab; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'prospecting', label: 'Prospecting Hub', icon: Target, badge: 'High Craft' },
    { id: 'demos', label: 'AI Demo Lab', icon: Sparkles, badge: 'AI' },
    { id: 'pipeline', label: 'Outreach Pipeline', icon: Kanban },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar flex flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="brand-mark flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight leading-none text-gray-900">
              LeadDrive
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-gray-500">v2.4 Engine Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${isActive ? 'active bg-white/80 shadow-sm text-blue-600 font-bold border-white/80' : 'hover:bg-white/50 text-gray-600'}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / User Badge */}
      <div className="pt-4 border-t border-gray-200/60 space-y-2">
        <button className="nav-item hover:bg-white/50 text-gray-500 text-xs">
          <HelpCircle className="w-4 h-4 text-gray-400" />
          <span>Help & Documentation</span>
        </button>

        <div className="p-3 rounded-2xl bg-white/60 border border-white/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
            IK
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-xs font-bold text-gray-900 truncate">Irfan Khan</div>
            <div className="text-[10px] text-gray-500 truncate">Pro Workspace</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
        </div>
      </div>
    </aside>
  );
}
