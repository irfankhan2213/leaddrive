'use client';

import {
  HelpCircle,
  Kanban,
  LayoutDashboard,
  Settings,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';

export type NavTab = 'dashboard' | 'prospecting' | 'demos' | 'pipeline' | 'settings' | 'help';

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
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="sidebar flex flex-col justify-between p-4">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-1 py-2 mb-5">
          <div className="brand-mark flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-base tracking-tight leading-none text-gray-900 truncate">
              LeadDrive
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="text-[10px] font-semibold text-gray-500 truncate">v2.4 Engine Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-2 pb-2 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item flex items-center gap-2 px-2.5 py-2 w-full text-xs font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'active bg-white/90 shadow-sm text-blue-600 font-bold border border-white'
                    : 'hover:bg-white/50 text-gray-600'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider whitespace-nowrap flex-shrink-0 ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>
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
        <button
          onClick={() => setActiveTab('help')}
          className={`nav-item flex items-center gap-2 px-2.5 py-2 w-full text-xs transition-all ${
            activeTab === 'help'
              ? 'active bg-white/90 shadow-sm text-blue-600 font-bold border border-white'
              : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <HelpCircle className={`w-4 h-4 flex-shrink-0 ${activeTab === 'help' ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className="truncate">Help & Documentation</span>
        </button>

        <div className="p-2.5 rounded-xl bg-white/70 border border-white/80 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-[11px] shadow-sm flex-shrink-0">
            LD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-gray-900 truncate">LeadDrive User</div>
            <div className="text-[10px] text-gray-500 truncate">Pro Workspace</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" title="Online" />
        </div>
      </div>
    </aside>
  );
}
