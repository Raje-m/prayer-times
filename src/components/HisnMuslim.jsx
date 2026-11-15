import React, { useState, useEffect } from 'react';
import { HISN_AL_MUSLIM_DATA } from '../data/AdhkarData';
import { BookOpen, CheckCircle2, RotateCcw, Sparkles, ChevronLeft } from 'lucide-react';

export default function HisnMuslim ()
{
  const [ selectedCategory, setSelectedCategory ] = useState( HISN_AL_MUSLIM_DATA[ 0 ] );
  const [ progressState, setProgressState ] = useState( () =>
  {
    const saved = localStorage.getItem( 'hisn_muslim_progress' );
    return saved ? JSON.parse( saved ) : {};
  } );

  // حفظ حالة التقدم في الذاكرة المحلية
  useEffect( () =>
  {
    localStorage.setItem( 'hisn_muslim_progress', JSON.stringify( progressState ) );
  }, [ progressState ] );

  // تحديث عداد الذكر (نقصان أو زيادة حتى الوصول للهدف)
  const handleCountClick = ( itemId, maxCount ) =>
  {
    setProgressState( prev =>
    {
      const current = prev[ itemId ] || 0;
      const nextCount = current + 1;
      // إذا تجاوز العدد المطلوب، يمكن إعادة تعليقه أو تصفيره
      return {
        ...prev,
        [ itemId ]: nextCount > maxCount ? 0 : nextCount
      };
    } );
  };

  // تصفير قسم معين
  const handleResetCategory = () =>
  {
    setProgressState( prev =>
    {
      const newState = { ...prev };
      selectedCategory.items.forEach( item =>
      {
        delete newState[ item.id ];
      } );
      return newState;
    } );
  };

  return (
    <div className="w-full bg-linear-to-b from-[#101b3b] via-[#09132d] to-[#060c1e] border-2 border-amber-400/30 rounded-3xl p-6 sm:p-8 text-amber-300 shadow-2xl flex flex-col gap-6 relative overflow-hidden" dir="rtl">

      {/* خلفية جمالية */ }
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* الهيدر العنوان */ }
      <div className="flex items-center justify-between border-b border-amber-300/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/20">
            <BookOpen className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300">حصن المسلم والورد اليومي</h2>
            <span className="text-xs text-amber-300/60 font-light">أذكار وأدعية صحيحة لتحصين اليوم وليلة</span>
          </div>
        </div>

        <button
          onClick={ handleResetCategory }
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 hover:bg-amber-400/20 transition-colors text-xs font-bold cursor-pointer"
          title="إعادة ضبط عدادات القسم الحالي"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>تصفير القسم</span>
        </button>
      </div>

      {/* شريط تصفح الأقسام (Tabs) */ }
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        { HISN_AL_MUSLIM_DATA.map( ( cat ) =>
        {
          const isSelected = selectedCategory.id === cat.id;
          return (
            <button
              key={ cat.id }
              onClick={ () => setSelectedCategory( cat ) }
              className={ `px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${ isSelected
                  ? 'bg-amber-400 text-[#0B1328] shadow-lg border border-amber-300'
                  : 'bg-[#081024] text-amber-300/80 border border-amber-400/20 hover:border-amber-400/50'
                }` }
            >
              <span>{ cat.category }</span>
            </button>
          );
        } ) }
      </div>

      {/* وصف القسم الحالي */ }
      <div className="px-4 py-2 bg-amber-400/5 border border-amber-400/15 rounded-xl flex items-center justify-between text-xs sm:text-sm">
        <span className="text-amber-300/80 font-medium">{ selectedCategory.description }</span>
        <span className="text-amber-400 font-bold">{ selectedCategory.items.length } أذكار</span>
      </div>

      {/* قائمة الأذكار داخل القسم */ }
      <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pe-1 custom-scrollbar">
        { selectedCategory.items.map( ( item, index ) =>
        {
          const currentCount = progressState[ item.id ] || 0;
          const isCompleted = currentCount >= item.count;

          return (
            <div
              key={ item.id }
              className={ `p-5 rounded-2xl border transition-all flex flex-col gap-3 relative ${ isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/30 shadow-md'
                  : 'bg-[#081024] border-amber-400/20 hover:border-amber-400/40'
                }` }
            >
              {/* رقم الذكر والفضل */ }
              <div className="flex items-center justify-between text-xs border-b border-amber-300/10 pb-2.5">
                <span className="font-bold text-amber-400/80">الذكر #{ index + 1 }</span>
                { item.virtue && (
                  <span className="text-amber-300/60 italic font-light truncate max-w-[220px] sm:max-w-md">
                    الفضل: { item.virtue }
                  </span>
                ) }
              </div>

              {/* نص الذكر */ }
              <p className="text-sm sm:text-base text-amber-100 font-medium leading-relaxed text-right">
                { item.text }
              </p>

              {/* أزرار التفاعل والعداد */ }
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-amber-300/60 font-light">
                  عدد التكرار المطلوب: <strong className="text-amber-300">{ item.count }</strong> مرات
                </span>

                <button
                  onClick={ () => handleCountClick( item.id, item.count ) }
                  className={ `px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${ isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-400 text-[#0B1328] hover:bg-amber-500 shadow-md'
                    }` }
                >
                  { isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>تم ( { currentCount } / { item.count } )</span>
                    </>
                  ) : (
                    <span>تكرار ( { currentCount } / { item.count } )</span>
                  ) }
                </button>
              </div>
            </div>
          );
        } ) }
      </div>

    </div>
  );
}