import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

export default function AthkarSection ()
{
  const [ activeTab, setActiveTab ] = useState( 'morning' );

  // القيم الافتراضية للعدادات
  const defaultCounters = {
    morning_0: 3,
    morning_1: 1,
    morning_2: 10,
    evening_0: 3,
    evening_1: 1,
    salah_0: 33,
  };

  // قراءة العدادات من LocalStorage عند تحميل المكون لأول مرة
  const [ counters, setCounters ] = useState( () =>
  {
    const savedCounters = localStorage.getItem( 'athkar_counters' );
    if ( savedCounters )
    {
      try
      {
        return JSON.parse( savedCounters );
      } catch ( error )
      {
        console.error( "فشل في استرجاع العدادات من الذاكرة المحلية", error );
      }
    }
    return defaultCounters;
  } );

  // حفظ العدادات في LocalStorage تلقائياً كلما حدث تغيير عليها
  useEffect( () =>
  {
    localStorage.setItem( 'athkar_counters', JSON.stringify( counters ) );
  }, [ counters ] );

  // بيانات الأذكار مقسمة حسب التبويبات
  const athkarData = {
    morning: [
      { id: 'morning_0', text: "أَسْتَغْفِرُ اللهَ العَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هو الحَيُّ القَيُّومُ وَأَتُوبُ إِلَيْهِ.", count: 3, virtue: "غفرت ذنوبه وإن كان فاراً من الزحف" },
      { id: 'morning_1', text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ...", count: 1, virtue: "من قالها موقناً بها ومات دخل الجنة" },
      { id: 'morning_2', text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.", count: 10, virtue: "أجر عظيم يذكر بعد التسبيح العادي" },
    ],
    evening: [
      { id: 'evening_0', text: "أَمْسَيْنَا وَأَمْسَى المُلْكُ للهِ وَالحَمْدُ للهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ له...", count: 3, virtue: "حفظ فيها العبد حتى أصبح" },
      { id: 'evening_1', text: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ المَصِيرُ.", count: 1, virtue: "دعاء المساء الشامل بالتوكل" },
    ],
    salah: [
      { id: 'salah_0', text: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَاللَّهُ أَكْبَرُ (بعد كل صلاة)", count: 33, virtue: "غفرت خطاياه وإن كانت مثل زبد البحر" },
    ]
  };

  // دالة النقصان عند الضغط على العداد
  const handleDecrement = ( id, maxCount ) =>
  {
    setCounters( prev =>
    {
      const current = prev[ id ] !== undefined ? prev[ id ] : maxCount;
      if ( current > 0 )
      {
        return { ...prev, [ id ]: current - 1 };
      }
      return prev;
    } );
  };

  // دالة إعادة تعيين العداد للرقم الأصلي
  const handleReset = ( id, maxCount ) =>
  {
    setCounters( prev => ( { ...prev, [ id ]: maxCount } ) );
  };

  const currentList = athkarData[ activeTab ] || [];

  return (
    <div className="w-full p-6 bg-primary rounded-2xl border border-amber-300/20 text-amber-300 shadow-xl flex flex-col gap-5" dir="rtl">

      {/* عنوان القسم */ }
      <div className="flex items-center justify-between pb-3 border-b border-amber-300/10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-300" />
          <h2 className="text-lg font-bold">حصن المسلم - الأذكار اليومية</h2>
        </div>
        <Sparkles className="w-4 h-4 text-amber-300/60" />
      </div>

      {/* شريط التبويبات (Tabs) */ }
      <div className="flex gap-2 p-1 bg-[#091e57] rounded-xl border border-amber-300/20">
        <button
          onClick={ () => setActiveTab( 'morning' ) }
          className={ `flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${ activeTab === 'morning' ? 'bg-amber-300 text-[#0B1328] shadow' : 'text-amber-300/70 hover:text-amber-300'
            }` }
        >
          أذكار الصباح
        </button>
        <button
          onClick={ () => setActiveTab( 'evening' ) }
          className={ `flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${ activeTab === 'evening' ? 'bg-amber-300 text-[#0B1328] shadow' : 'text-amber-300/70 hover:text-amber-300'
            }` }
        >
          أذكار المساء
        </button>
        <button
          onClick={ () => setActiveTab( 'salah' ) }
          className={ `flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${ activeTab === 'salah' ? 'bg-amber-300 text-[#0B1328] shadow' : 'text-amber-300/70 hover:text-amber-300'
            }` }
        >
          بعد الصلاة
        </button>
      </div>

      {/* قائمة الأذكار مع Scroll عمودي */ }
      <div className="max-h-80 overflow-y-auto flex flex-col gap-3 pe-1 custom-scrollbar">
        { currentList.map( ( item ) =>
        {
          const currentCount = counters[ item.id ] !== undefined ? counters[ item.id ] : item.count;
          const isFinished = currentCount === 0;

          return (
            <div
              key={ item.id }
              className={ `p-4 rounded-xl border transition-all flex flex-col gap-3 ${ isFinished
                  ? 'bg-amber-300/5 border-amber-300/20 opacity-75'
                  : 'bg-[#091e57]/60 border-amber-300/20 hover:border-amber-300/50'
                }` }
            >
              {/* نص الذكر */ }
              <p className="text-sm leading-relaxed text-amber-100 font-medium">
                { item.text }
              </p>

              {/* الفضل والعداد */ }
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-amber-300/10 gap-2">
                <span className="text-amber-300/70 italic font-light truncate max-w-[200px] sm:max-w-xs">
                  { item.virtue }
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  {/* زر إعادة التعيين */ }
                  <button
                    onClick={ () => handleReset( item.id, item.count ) }
                    className="p-1.5 rounded-lg bg-amber-300/10 hover:bg-amber-300/20 text-amber-300 transition-colors cursor-pointer"
                    title="إعادة التعيين"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* زر العداد التفاعلي */ }
                  <button
                    onClick={ () => handleDecrement( item.id, item.count ) }
                    disabled={ isFinished }
                    className={ `px-4 py-1.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 ${ isFinished
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                        : 'bg-amber-300 text-[#0B1328] hover:bg-amber-400 active:scale-95 shadow cursor-pointer'
                      }` }
                  >
                    { isFinished ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم</span>
                      </>
                    ) : (
                      <span>{ currentCount }</span>
                    ) }
                  </button>
                </div>
              </div>
            </div>
          );
        } ) }
      </div>

    </div>
  );
}