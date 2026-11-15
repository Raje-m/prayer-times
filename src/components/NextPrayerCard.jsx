import React, { useState, useEffect } from 'react';
import { Clock, BellRing, Sparkles } from 'lucide-react';

export default function NextPrayerCard ( { nextPrayerName, nextPrayerTime } )
{
  const [ timeLeft, setTimeLeft ] = useState( { hours: 0, minutes: 0, seconds: 0, isPassed: false } );

  useEffect( () =>
  {
    if ( !nextPrayerTime ) return;

    const calculateTimeLeft = () =>
    {
      const now = new Date();
      const cleanTime = nextPrayerTime.split( ' ' )[ 0 ];
      const [ prayerHours, prayerMinutes ] = cleanTime.split( ':' ).map( Number );

      const prayerDate = new Date();
      prayerDate.setHours( prayerHours, prayerMinutes, 0, 0 );

      let difference = prayerDate.getTime() - now.getTime();

      if ( difference <= 0 )
      {
        const elapsed = Math.abs( difference );
        const elapsedMinutes = Math.floor( elapsed / ( 1000 * 60 ) );
        const elapsedSeconds = Math.floor( ( elapsed % ( 1000 * 60 ) ) / 1000 );

        setTimeLeft( {
          isPassed: true,
          minutes: elapsedMinutes,
          seconds: elapsedSeconds
        } );
      } else
      {
        const hours = Math.floor( difference / ( 1000 * 60 * 60 ) );
        const minutes = Math.floor( ( difference % ( 1000 * 60 * 60 ) ) / ( 1000 * 60 ) );
        const seconds = Math.floor( ( difference % ( 1000 * 60 ) ) / 1000 );

        setTimeLeft( { hours, minutes, seconds, isPassed: false } );
      }
    };

    calculateTimeLeft();
    const timer = setInterval( calculateTimeLeft, 1000 );

    return () => clearInterval( timer );
  }, [ nextPrayerTime ] );

  return (
    <div className="relative w-full bg-linear-to-b from-[#101b3b] via-[#09132d] to-[#060c1e] border-2 border-amber-400/30 rounded-3xl p-6 sm:p-8 text-amber-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between gap-6 overflow-hidden" dir="rtl">

      {/* عناصر خلفية جمالية */ }
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* الجزء العلوي: شارة الصلاة القادمة ووقتها */ }
      <div className="w-full flex items-center justify-between border-b border-amber-300/15 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-amber-300/60 block font-light">الصلاة القادمة</span>
            <h3 className="text-2xl font-black text-amber-300">{ nextPrayerName || 'الفجر' }</h3>
          </div>
        </div>

        <div className="text-left">
          <span className="text-xs text-amber-300/60 block font-light">موعد الأذان</span>
          <span className="text-2xl font-black text-[#F59C0B] tracking-wider">
            { nextPrayerTime ? nextPrayerTime.split( ' ' )[ 0 ] : '--:--' }
          </span>
        </div>
      </div>

      {/* المنتصف: العداد الرقمي الفخم */ }
      { !timeLeft.isPassed ? (
        <div className="flex items-center justify-center gap-3 sm:gap-6 my-2">
          {/* الساعات */ }
          <div className="flex flex-col items-center">
            <div className="w-16 h-18 sm:w-20 sm:h-22 bg-[#081024] border border-amber-400/30 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-3xl sm:text-4xl font-black text-amber-300">
                { String( timeLeft.hours ).padStart( 2, '0' ) }
              </span>
            </div>
            <span className="text-[11px] text-amber-300/60 mt-1.5 font-medium">ساعة</span>
          </div>

          <span className="text-2xl font-bold text-amber-400/50 -mt-5">:</span>

          {/* الدقائق */ }
          <div className="flex flex-col items-center">
            <div className="w-16 h-18 sm:w-20 sm:h-22 bg-[#081024] border border-amber-400/30 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-3xl sm:text-4xl font-black text-amber-300">
                { String( timeLeft.minutes ).padStart( 2, '0' ) }
              </span>
            </div>
            <span className="text-[11px] text-amber-300/60 mt-1.5 font-medium">دقيقة</span>
          </div>

          <span className="text-2xl font-bold text-amber-400/50 -mt-5">:</span>

          {/* الثواني */ }
          <div className="flex flex-col items-center">
            <div className="w-16 h-18 sm:w-20 sm:h-22 bg-amber-400/10 border border-amber-400/50 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 animate-pulse">
                { String( timeLeft.seconds ).padStart( 2, '0' ) }
              </span>
            </div>
            <span className="text-[11px] text-amber-400 mt-1.5 font-bold">ثانية</span>
          </div>
        </div>
      ) : (
        /* عند دخول وقت الأذان */
        <div className="w-full my-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-3 text-emerald-400 animate-pulse">
          <BellRing className="w-6 h-6" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold">حان الآن وقت أذان { nextPrayerName }</span>
            <span className="text-xs opacity-80">
              مضى على الأذان { timeLeft.minutes } دقيقة و { timeLeft.seconds } ثانية
            </span>
          </div>
        </div>
      ) }

      {/* الشريط السفلي */ }
      <div className="w-full text-center text-xs text-amber-300/50 font-light border-t border-amber-300/10 pt-3">
        { timeLeft.isPassed ? 'تقبل الله صلاتكم وطاعاتكم' : 'يرجى الاستعداد للصلاة قبل الأذان بوقت كافٍ' }
      </div>

    </div>
  );
}