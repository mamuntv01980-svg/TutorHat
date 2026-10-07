import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  text = 'TutorHat – Bangladesh Tuition Platform',
  url,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const targetUrl = url || window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: targetUrl
        });
        return;
      } catch (err) {
        // Fallback to copy link
      }
    }

    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-900 transition-colors inline-flex items-center gap-1.5 text-xs font-semibold ${className}`}
      title={copied ? 'Link Copied!' : 'Share'}
      aria-label="Share this link"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
      {copied && <span className="text-[11px] text-emerald-700">Copied!</span>}
    </button>
  );
};
