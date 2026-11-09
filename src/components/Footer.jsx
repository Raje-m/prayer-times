import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer ()
{
  return (
    <footer className="w-full max-w-4xl mx-auto mt-10 py-6 px-4 border-t border-amber-300/10 text-center flex flex-col items-center gap-2 text-xs sm:text-sm text-amber-300/60">

      <div className="flex items-center gap-1.5 font-medium">
        <span>صُنع بـ</span>
        <Heart className="w-4 h-4 text-red-500 fill-red-500 inline-block animate-pulse" />
        <span>لخدمة المسلمين والذكر اليومي</span>
      </div>

      <div className="flex items-center gap-2 text-amber-300/40">
        <span>مواقيت دقيقة • واجهة OLED ذكية</span>
        <span>•</span>
        <span>v1.0.0</span>
      </div>

    </footer>
  );
}