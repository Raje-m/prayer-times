import React from 'react';

export default function PrayerTimeCard ( { name, time, period, icon: Icon, isNext } )
{
  return (
    <div
      className={ `relative group flex flex-col items-center justify-center gap-1.5 p-5 rounded-2xl border transition-all duration-300 shadow-lg ${ isNext
          ? "bg-amber-300/15 border-amber-300 shadow-amber-300/20 ring-2 ring-amber-300/50 scale-105"
          : "border-amber-300/30 bg-linear-to-br from-[#091e57] via-[#0e1629] to-[#121d3a] hover:shadow-amber-300/10 hover:border-amber-300/60"
        }` }
      dir="rtl"
    >

      {/* شارة صغيرة توضح أن هذه هي الصلاة القادمة */ }
      { isNext && (
        <span className="absolute -top-3 bg-amber-300 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow animate-bounce ">
          الصلاة القادمة
        </span>
      ) }

      {/* أيقونة الصلاة */ }
      <div className={ `absolute top-4 inset-s-3 transition-colors ${ isNext ? "text-amber-300" : "text-amber-300/40 group-hover:text-amber-300" }` }>
        <Icon className="w-5 h-5" />
      </div>

      {/* اسم الصلاة */ }
      <span className={ `text-sm font-medium tracking-wide ${ isNext ? "text-amber-300 font-bold" : "text-amber-300/80" }` }>
        { name }
      </span>

      {/* وقت الصلاة */ }
      <span className="text-2xl font-bold tracking-wider text-[#F59C0B]">
        { time }
      </span>

      <span className="text-xs text-gray-400 font-light">{ period }</span>

    </div>
  );
}