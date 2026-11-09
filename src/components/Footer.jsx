import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer ()
{
  return (
    <footer className="w-full text-center py-6 mt-8 border-t border-amber-300/10 text-xs text-amber-300/50 flex flex-col items-center gap-1">
      <p className="flex items-center gap-1">
        <span>صُنع بـ</span>
        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        <span>لخدمة المسلين</span>
      </p>
      <p className="text-[10px] text-amber-300/30"> لا توجد حقوق محفوظة © 2026</p>
    </footer>
  );
}