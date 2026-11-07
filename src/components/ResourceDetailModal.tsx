import React, { useState } from 'react';
import { Resource } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  X,
  ExternalLink,
  Download,
  Bookmark,
  Share2,
  Calendar,
  User,
  Eye,
  Star,
  Tag,
  FileText,
  Video,
  Code,
  BookOpen,
  Layers,
} from 'lucide-react';

interface ResourceDetailModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleBookmark: (resId: string) => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  isOpen,
  onClose,
  onToggleBookmark,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !resource) return null;

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'Video':
        return <Video className="w-5 h-5 text-amber-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-emerald-400" />;
      case 'Article':
        return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'Cheatsheet':
        return <Layers className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(resource.link);
    setCopied(true);
    showToast('Resource link copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedDate = new Date(resource.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 shadow">
              {getTypeIcon(resource.type)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                  {resource.category}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {resource.type}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white leading-snug">{resource.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Metadata bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <User className="w-4 h-4 text-slate-500" />
              <div className="truncate">
                <div className="text-[10px] text-slate-500 font-medium">Contributor</div>
                <div className="font-semibold text-slate-200 truncate">{resource.author_name}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-slate-500" />
              <div>
                <div className="text-[10px] text-slate-500 font-medium">Published</div>
                <div className="font-semibold text-slate-200">{formattedDate}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Eye className="w-4 h-4 text-slate-500" />
              <div>
                <div className="text-[10px] text-slate-500 font-medium">Views</div>
                <div className="font-semibold text-slate-200">{resource.views} views</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <div>
                <div className="text-[10px] text-slate-500 font-medium">Rating</div>
                <div className="font-semibold text-slate-200">{resource.rating.toFixed(1)} / 5.0</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description & Notes</h4>
            <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800/60 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {resource.description}
            </div>
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Study Tags & Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-medium"
                  >
                    <Tag className="w-3 h-3 text-slate-500" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(resource.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                resource.is_saved
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${resource.is_saved ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{resource.is_saved ? 'Saved in Profile' : 'Save Resource'}</span>
              <span className="text-[11px] opacity-70">({resource.saved_count})</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {resource.download_url && (
              <a
                href={resource.download_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition"
              >
                <Download className="w-4 h-4" />
                <span>Direct Download</span>
              </a>
            )}

            <a
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition"
            >
              <span>Visit External Resource</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
