'use client';

import { Calendar, Plus, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
  onNewCampaignClick?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export function Header({
  title,
  subtitle,
  onNewCampaignClick,
  searchQuery = '',
  setSearchQuery
}: HeaderProps) {
  return (
    <header className="panel topbar flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 leading-tight">
          {title}
        </h1>
        <p className="text-xs font-medium text-gray-500 mt-0.5">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search prospects, leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            className="field field-icon-left pr-3 text-xs bg-white/90 shadow-xs focus:bg-white"
          />
        </div>

        {/* Date Selector */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-white/80 text-xs font-semibold text-gray-700 shadow-sm cursor-pointer hover:bg-white">
          <Calendar className="w-3.5 h-3.5 text-gray-500" />
          <span>Last 30 Days</span>
        </div>

        {/* New Campaign Button */}
        <button
          onClick={onNewCampaignClick}
          className="btn text-xs px-4 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>
    </header>
  );
}
