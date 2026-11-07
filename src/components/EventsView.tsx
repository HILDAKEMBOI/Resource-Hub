import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EventItem } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  User,
  Users,
  Search,
  Filter,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface EventsViewProps {
  events: EventItem[];
  loading: boolean;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  onToggleRSVP: (eventId: string) => void;
  onOpenNewEvent: () => void;
  onOpenAuth: () => void;
}

const CATEGORIES = [
  'All',
  'Workshop',
  'Study Group',
  'Hackathon',
  'Seminar',
  'Career Fair',
  'Social',
];

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  loading,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  timeframe,
  onTimeframeChange,
  onToggleRSVP,
  onOpenNewEvent,
  onOpenAuth,
}) => {
  const { user } = useAuth();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const getCategoryBadgeClass = (category: EventItem['category']) => {
    switch (category) {
      case 'Workshop':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Study Group':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Hackathon':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Seminar':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Career Fair':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Social':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold uppercase tracking-wider">
              Campus & Online Events
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Academic & Community Events
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Discover peer study sessions, hackathons, guest research lectures, and student club workshops. RSVP to sync with your schedule.
          </p>
        </div>

        <button
          onClick={() => {
            if (!user) onOpenAuth();
            else onOpenNewEvent();
          }}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Campus Event</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Timeframe Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search events by title, venue, or host organizer..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Timeline:</span>
          </div>
          <select
            value={timeframe}
            onChange={e => onTimeframeChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Dates</option>
            <option value="upcoming" className="bg-slate-900">Upcoming Only</option>
            <option value="today" className="bg-slate-900">Happening Today</option>
          </select>
        </div>
      </div>

      {/* Event Cards Chronological Feed */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p>Loading chronological event feed...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 space-y-3">
          <CalendarIcon className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
          <h3 className="text-base font-bold text-slate-200">No events matched your search</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try checking all dates or create an event to invite fellow classmates!
          </p>
          <button
            onClick={() => {
              onSelectCategory('All');
              onSearchChange('');
              onTimeframeChange('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Reset Event Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => {
            const dateObj = new Date(event.date + 'T00:00:00');
            const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' });
            const dayNum = dateObj.getDate();
            const yearStr = dateObj.getFullYear();

            return (
              <div
                key={event.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
              >
                {/* Left Date Block + Info */}
                <div className="flex items-start gap-4 sm:gap-5 min-w-0 flex-1">
                  {/* Prominent Date Calendar Block */}
                  <div className="w-16 h-20 sm:w-20 sm:h-22 rounded-2xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/60 border border-purple-700/40 shadow-inner flex flex-col items-center justify-center shrink-0 text-center p-2">
                    <span className="text-[11px] font-extrabold uppercase text-purple-300 tracking-wider">
                      {monthStr}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-white leading-none my-0.5">
                      {dayNum}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold truncate max-w-full">
                      {event.day_name.split(' ')[0]}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 min-w-0 flex-1">
                    {/* Category & Status tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadgeClass(
                          event.category
                        )}`}
                      >
                        {event.category}
                      </span>

                      {event.is_virtual && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          <Video className="w-3 h-3" />
                          <span>Virtual / Livestream</span>
                        </span>
                      )}

                      <span className="text-xs text-slate-400 font-medium">
                        {event.day_name}, {event.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition leading-snug">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                      {event.description}
                    </p>

                    {/* Scheduling Details */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium text-slate-300">
                        <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>
                          {event.start_time} - {event.end_time}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-medium text-slate-300 truncate max-w-xs">
                        <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-xs">
                        <User className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="truncate">Host: {event.organizer_name}</span>
                      </div>
                    </div>

                    {/* Virtual Link Button */}
                    {event.is_virtual && event.virtual_link && (
                      <div className="pt-1 flex items-center gap-2">
                        <a
                          href={event.virtual_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Virtual Stream</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => handleCopyLink(event.virtual_link!, event.id)}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                          title="Copy meeting link"
                        >
                          {copiedLink === event.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Attendees Count & RSVP Action */}
                <div className="w-full md:w-auto md:min-w-[160px] flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-white">
                      {event.attendees_count ?? event.attendees.length}
                    </span>
                    <span>/ {event.max_capacity || 100} attending</span>
                  </div>

                  <button
                    onClick={() => {
                      if (!user) onOpenAuth();
                      else onToggleRSVP(event.id);
                    }}
                    className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                      event.is_attending
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-emerald-500/10'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                    }`}
                  >
                    {event.is_attending ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Attending (RSVP&apos;d)</span>
                      </>
                    ) : (
                      <>
                        <span>RSVP for Event</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
