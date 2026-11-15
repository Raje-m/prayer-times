import React, { useState, useEffect } from 'react';
import { RotateCcw, Sparkles, Check, ChevronDown } from 'lucide-react';
import CustomAlert from './CustomAlert';

const TASBIH_LIST = [
  { id: 1, text: 'سُبْحَانَ اللَّهِ', target: 33 },
  { id: 2, text: 'الْحَمْدُ لِلَّهِ', target: 33 },
  { id: 3, text: 'اللَّهُ أَكْبَرُ', target: 33 },
  { id: 4, text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', target: 100 },
  { id: 5, text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', target: 100 },
  { id: 6, text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ', target: 10 },
];

const DigitalTasbih=React.memo (function DigitalTasbih ()
{
  const [ selectedTasbih, setSelectedTasbih ] = useState( TASBIH_LIST[ 0 ] );
  const [ count, setCount ] = useState( () =>
  {
    const saved = localStorage.getItem( `tasbih_${ TASBIH_LIST[ 0 ].id }` );
    return saved ? parseInt( saved, 10 ) : 0;
  } );
  const [ totalCount, setTotalCount ] = useState( () =>
  {
    const saved = localStorage.getItem( 'tasbih_total' );
    return saved ? parseInt( saved, 10 ) : 0;
  } );
  const [ isDropdownOpen, setIsDropdownOpen ] = useState( false );
  const [ animateButton, setAnimateButton ] = useState( false );
  const [ alertConfig, setAlertConfig ] = useState( { isOpen: false, type: 'warning', message: '', onConfirm: null } );
  console.log( "DigitalTasbih rendered!" );
  // حفظ العداد في الذاكرة المحلية عند تغييره
  useEffect( () =>
  {
    localStorage.setItem( `tasbih_${ selectedTasbih.id }`, count );
  }, [ count, selectedTasbih.id ] );

  useEffect( () =>
  {
    localStorage.setItem( 'tasbih_total', totalCount );
  }, [ totalCount ] );

  // عند تغيير الذكر، جلب عدده المحفوظ
  const handleSelectTasbih = ( item ) =>
  {
    setSelectedTasbih( item );
    const saved = localStorage.getItem( `tasbih_${ item.id }` );
    setCount( saved ? parseInt( saved, 10 ) : 0 );
    setIsDropdownOpen( false );
  };

  // زيادة العداد
  const handleIncrement = () =>
  {
    setCount( prev => prev + 1 );
    setTotalCount( prev => prev + 1 );
    setAnimateButton( true );
    setTimeout( () => setAnimateButton( false ), 150 );
  };

  // تصفير العداد الحالي
  const handleResetRequest = () =>
  {
    setAlertConfig( {
      isOpen: true,
      type: 'warning',
      message: `هل أنت متأكد من رغبتك في تصفير عداد "${ selectedTasbih.text }" والبدء من جديد؟`,
      onConfirm: () => setCount( 0 )
    } );
  };

  // نسبة التقدم نحو الهدف
  const progress = Math.min( Math.round( ( count / selectedTasbih.target ) * 100 ), 100 );

  return (
    <div className="w-full bg-linear-to-b from-[#101b3b] via-[#09132d] to-[#060c1e] border-2 border-amber-400/30 rounded-3xl p-6 sm:p-8 text-amber-300 shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden" dir="rtl">
      <CustomAlert
        isOpen={ alertConfig.isOpen }
        type={ alertConfig.type }
        message={ alertConfig.message }
        onConfirm={ alertConfig.onConfirm }
        onClose={ () => setAlertConfig( prev => ( { ...prev, isOpen: false } ) ) }
      />

      {/* خلفية جمالية */ }
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* الهيدر وقائمة اختيار الذكر */ }
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-amber-300/15 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <h3 className="text-lg font-bold">المسبحة الرقمية</h3>
        </div>

        {/* منيو اختيار الذكر */ }
        <div className="relative w-full sm:w-auto">
          <button
            onClick={ () => setIsDropdownOpen( !isDropdownOpen ) }
            className="w-full sm:w-64 flex items-center justify-between px-4 py-2.5 bg-[#081024] border border-amber-400/30 rounded-xl text-xs sm:text-sm font-medium hover:border-amber-400/60 transition-colors cursor-pointer"
          >
            <span className="truncate">{ selectedTasbih.text }</span>
            <ChevronDown className="w-4 h-4 text-amber-400 shrink-0" />
          </button>

          { isDropdownOpen && (
            <div className="absolute top-full mt-2 w-full bg-[#09132d] border border-amber-400/30 rounded-xl shadow-2xl z-20 overflow-hidden divide-y divide-amber-300/10">
              { TASBIH_LIST.map( ( item ) => (
                <button
                  key={ item.id }
                  onClick={ () => handleSelectTasbih( item ) }
                  className={ `w-full px-4 py-3 text-right text-xs sm:text-sm flex items-center justify-between hover:bg-amber-400/10 transition-colors cursor-pointer ${ selectedTasbih.id === item.id ? 'bg-amber-400/20 text-amber-200 font-bold' : 'text-amber-300/80'
                    }` }
                >
                  <span>{ item.text }</span>
                  { selectedTasbih.id === item.id && <Check className="w-4 h-4 text-amber-400" /> }
                </button>
              ) ) }
            </div>
          ) }
        </div>
      </div>

      {/* عرض الذكر الحالي والهدف */ }
      <div className="text-center flex flex-col items-center gap-1 my-1">
        <span className="text-xl sm:text-2xl font-black text-amber-200 tracking-wide">
          { selectedTasbih.text }
        </span>
        <span className="text-xs text-amber-300/60 font-light">
          الهدف المستهدف: { selectedTasbih.target } تسبيحة
        </span>
      </div>

      {/* زر التسبيح الرئيسي (الدوائر الكبيرة) */ }
      <div className="relative flex items-center justify-center my-2">
        <button
          onClick={ handleIncrement }
          className={ `w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-linear-to-br from-[#1b2a57] to-[#09132d] border-4 border-amber-400/40 shadow-[0_0_30px_rgba(245,156,11,0.2)] flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform duration-100 ${ animateButton ? 'scale-95 bg-amber-400/20 border-amber-400' : 'hover:scale-102 hover:border-amber-400/70'
            }` }
        >
          <span className="text-5xl sm:text-6xl font-black text-[#F59C0B] tracking-wider drop-shadow-md">
            { count }
          </span>
          <span className="text-xs text-amber-300/70 font-medium">اضغط للتسبيح</span>
        </button>
      </div>

      {/* شريط التقدم (Progress Bar) */ }
      <div className="w-full flex flex-col gap-1.5 px-2">
        <div className="flex justify-between text-xs text-amber-300/70">
          <span>التقدم نحو الهدف</span>
          <span>{ progress }%</span>
        </div>
        <div className="w-full h-2.5 bg-[#081024] rounded-full overflow-hidden border border-amber-400/20">
          <div
            className="h-full bg-linear-to-r from-amber-500 to-amber-300 transition-all duration-300 rounded-full"
            style={ { width: `${ progress }%` } }
          ></div>
        </div>
      </div>

      {/* الأزرار السفلية (تصفير والمجموع الإجمالي) */ }
      <div className="w-full flex items-center justify-between pt-3 border-t border-amber-300/10 text-xs">
        <div className="text-amber-300/70">
          الإجمالي الكلي: <span className="font-bold text-amber-300">{ totalCount }</span>
        </div>

        <button
          onClick={ handleResetRequest }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 hover:bg-amber-400/20 transition-colors cursor-pointer"
          title="إعادة ضبط العداد"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>تصفير</span>
        </button>
      </div>

    </div>
  );
} )
export default DigitalTasbih;