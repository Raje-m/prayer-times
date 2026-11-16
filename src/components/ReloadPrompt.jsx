import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export default function ReloadPrompt ()
{
  const {
    needRefresh: [ needRefresh, setNeedRefresh ],
    updateServiceWorker,
  } = useRegisterSW( {
    onRegistered ( registration )
    {
      // التحقق من وجود تحديثات كل ساعة تلقائياً أثناء بقاء التطبيق مفتوحاً
      if ( registration )
      {
        setInterval( () =>
        {
          registration.update();
        }, 60 * 60 * 1000 );
      }
    },
    onRegisterError ( error )
    {
      console.error( 'خطأ في تسجيل Service Worker:', error );
    },
  } );

  const close = () =>
  {
    setNeedRefresh( false );
  };

  if ( !needRefresh ) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#0b1636] border-2 border-amber-400/40 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-amber-200 flex items-center justify-between gap-3 animate-fade-in"
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-amber-400/15 text-amber-400 shrink-0">
          <RefreshCw className="w-5 h-5 animate-spin" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-black text-amber-300">
            يتوفر تحديث جديد للتطبيق!
          </span>
          <span className="text-[11px] text-amber-200/75">
            اضغط تحديث للحصول على أحدث التحسينات.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={ () => updateServiceWorker( true ) }
          className="px-3 py-1.5 rounded-xl bg-amber-400 text-[#09132d] font-black text-xs hover:bg-amber-300 transition-colors cursor-pointer"
        >
          تحديث
        </button>
        <button
          onClick={ close }
          className="p-1.5 rounded-xl bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 transition-colors cursor-pointer"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}