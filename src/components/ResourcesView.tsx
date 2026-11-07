import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Resource } from '../types';
import {
  Search,
  BookOpen,
  Filter,
  Plus,
  FileText,
  Video,
  Code,
  Layers,
  Star,
  Eye,
  Bookmark,
  ExternalLink,
  Tag,
  ArrowUpDown,
  Sparkles,
  Download,
} from 'lucide-react';

interface ResourcesViewProps {
  resources: Resource[];
  loading: boolean;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onOpenResource: (resource: Resource) => void;
  onToggleBookmark: (resourceId: string) => void;
  onOpenNewResource: () => void;
  onOpenAuth: () => void;
}

const CATEGORIES = [
  'All',
  'Computer Science',
  'Mathematics',
  'Engineering',
  'Business & Economics',
  'Design & Arts',
  'Humanities',
];

const TYPES = ['All', 'PDF', 'Video', 'Code', 'Article', 'Cheatsheet'];

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources,
  loading,
  selectedCategory,
  onSelectCategory,
  selectedType,
  onSelectType,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onOpenResource,
  onToggleBookmark,
  onOpenNewResource,
  onOpenAuth,
}) => {
  const { user } = useAuth();

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'Video':
        return <Video className="w-4 h-4 text-amber-400" />;
      case 'Code':
        return <Code className="w-4 h-4 text-emerald-400" />;
      case 'Article':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'Cheatsheet':
        return <Layers className="w-4 h-4 text-cyan-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold uppercase tracking-wider">
              Learning Materials Repository
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Curated Student Resource Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Discover peer-reviewed lecture notes, open-source repositories, formulas, and video series. Save materials directly to your profile.
          </p>
        </div>

        <button
          onClick={() => {
            if (!user) onOpenAuth();
            else onOpenNewResource();
          }}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Course Resource</span>
        </button>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Secondary Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search learning materials by title, topic, or keyword..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

        {/* Format / Type Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Format:</span>
          </div>
          <select
            value={selectedType}
            onChange={e => onSelectType(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            {TYPES.map(t => (
              <option key={t} value={t} className="bg-slate-900">
                {t === 'All' ? 'All Formats' : t}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 ml-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="recent" className="bg-slate-900">Most Recent</option>
            <option value="rating" className="bg-slate-900">Highest Rated</option>
            <option value="saved" className="bg-slate-900">Most Saved</option>
            <option value="popular" className="bg-slate-900">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Grid of Resources */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p>Loading curated materials...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
          <h3 className="text-base font-bold text-slate-200">No resources matched your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or subject category, or be the first student to upload a study guide!
          </p>
          <button
            onClick={() => {
              onSelectCategory('All');
              onSelectType('All');
              onSearchChange('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map(res => (
            <div
              key={res.id}
              className="rounded-3xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition shadow-lg flex flex-col justify-between overflow-hidden group hover:translate-y-[-2px] duration-200"
            >
              {/* Card Header & Content */}
              <div className="p-5 space-y-3">
                {/* Meta Bar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center">
                      {getTypeIcon(res.type)}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                      {res.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) onOpenAuth();
                      else onToggleBookmark(res.id);
                    }}
                    className={`p-2 rounded-xl border transition cursor-pointer ${
                      res.is_saved
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                    title={res.is_saved ? 'Remove bookmark' : 'Save resource'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${res.is_saved ? 'fill-rose-400' : ''}`} />
                  </button>
                </div>

                {/* Title & Description */}
                <div>
                  <h3
                    onClick={() => onOpenResource(res)}
                    className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition cursor-pointer line-clamp-2 leading-snug"
                  >
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {res.tags?.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-400 border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                  {res.tags && res.tags.length > 3 && (
                    <span className="text-[10px] text-slate-500 self-center">
                      +{res.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {res.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    {res.views}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {res.saved_count} saves
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenResource(res)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition cursor-pointer"
                  >
                    Details
                  </button>
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition"
                    title="Open external link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
