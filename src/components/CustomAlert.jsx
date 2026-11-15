import React from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export default function CustomAlert ( { isOpen, type = 'info', message, onConfirm, onClose } )
{
  if ( !isOpen ) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn" dir="rtl">
      <div className="w-full max-w-sm bg-[#0a1532] border-2 border-amber-400/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-4 relative overflow-hidden">

        {/* زر الإغلاق */ }
        <button
          onClick={ onClose }
          className="absolute top-4 left-4 text-amber-300/60 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* الأيقونة حسب النوع */ }
        <div className={ `p-3 rounded-2xl border ${ type === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
            type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
              'bg-sky-500/10 border-sky-500/30 text-sky-400'
          }` }>
          { type === 'warning' && <AlertTriangle className="w-8 h-8 animate-bounce" /> }
          { type === 'success' && <CheckCircle className="w-8 h-8" /> }
          { type === 'info' && <Info className="w-8 h-8" /> }
        </div>

        {/* النص */ }
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-bold text-amber-300">
            { type === 'warning' ? 'تنبيه هام' : 'إشعار النظام' }
          </h4>
          <p className="text-xs sm:text-sm text-amber-300/80 font-light leading-relaxed">
            { message }
          </p>
        </div>

        {/* الأزرار */ }
        <div className="flex items-center gap-3 w-full pt-2">
          { onConfirm && (
            <button
              onClick={ () => { onConfirm(); onClose(); } }
              className="flex-1 py-2.5 rounded-xl bg-amber-400 text-[#0B1328] font-bold text-xs sm:text-sm hover:bg-amber-500 transition-colors cursor-pointer shadow-lg"
            >
              تأكيد
            </button>
          ) }
          <button
            onClick={ onClose }
            className="flex-1 py-2.5 rounded-xl bg-[#081024] border border-amber-400/30 text-amber-300 font-medium text-xs sm:text-sm hover:bg-amber-400/10 transition-colors cursor-pointer"
          >
            { onConfirm ? 'إلغاء' : 'حسناً' }
          </button>
        </div>

      </div>
    </div>
  );
}