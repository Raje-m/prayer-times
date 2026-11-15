import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function MonthlyCalendar ()
{
  const { selectedCity } = useSelector( ( state ) => state.prayer );
  const [ calendarData, setCalendarData ] = useState( [] );
  const [ loading, setLoading ] = useState( false );

  // تتبع الشهر والسنة الحاليين
  const currentDate = new Date();
  const [ month, setMonth ] = useState( currentDate.getMonth() + 1 );
  const [ year, setYear ] = useState( currentDate.getFullYear() );

  useEffect( () =>
  {
    const fetchMonthlyData = async () =>
    {
      setLoading( true );
      try
      {
        const cityName = selectedCity.value === 'gps' ? 'Riyadh' : selectedCity.value;
        const response = await axios.get( `https://api.aladhan.com/v1/calendarByCity/${ year }/${ month }`, {
          params: {
            city: cityName,
            country: selectedCity.country || 'Saudi Arabia',
            method: 4
          }
        } );
        setCalendarData( response.data.data );
      } catch ( error )
      {
        console.error( "خطأ في جلب التقويم الشهري:", error );
      } finally
      {
        setLoading( false );
      }
    };

    fetchMonthlyData();
  }, [ selectedCity, month, year ] );

  // التنقل بين الشهور
  const handlePrevMonth = () =>
  {
    if ( month === 1 )
    {
      setMonth( 12 );
      setYear( prev => prev - 1 );
    } else
    {
      setMonth( prev => prev - 1 );
    }
  };

  const handleNextMonth = () =>
  {
    if ( month === 12 )
    {
      setMonth( 1 );
      setYear( prev => prev + 1 );
    } else
    {
      setMonth( prev => prev + 1 );
    }
  };

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  return (
    <div className="w-full p-6 bg-primary rounded-2xl border border-amber-300/20 text-amber-300 shadow-xl flex flex-col items-center gap-5" dir="rtl">

      {/* عنوان التقويم والتحكم بالشهور */ }
      <div className="w-full flex items-center justify-between pb-3 border-b border-amber-300/10 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-amber-300" />
          <h2 className="text-lg font-bold">التقويم الشهري للأوقات</h2>
        </div>

        {/* أزرار التنقل بين الشهور */ }
        <div className="flex items-center gap-3 bg-[#091e57] px-4 py-1.5 rounded-xl border border-amber-300/20">
          <button
            onClick={ handlePrevMonth }
            className="hover:text-amber-100 transition-colors cursor-pointer"
            title="الشهر السابق"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <span className="text-sm font-bold min-w-27.5 text-center">
            { monthNames[ month - 1 ] } { year }
          </span>

          <button
            onClick={ handleNextMonth }
            className="hover:text-amber-100 transition-colors cursor-pointer"
            title="الشهر التالي"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* محتوى الجدول */ }
      { loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-300" />
          <span className="text-xs text-amber-300/70">جاري تحميل جدول الشهر...</span>
        </div>
      ) : (
        <div className="w-full overflow-x-auto custom-horizontal-scroll">
          <table className="w-full text-center border-collapse min-w-162.5">
            <thead>
              <tr className="border-b border-amber-300/20 text-xs sm:text-sm text-amber-300/80 bg-[#091e57]/50">
                <th className="py-3 px-2">التاريخ</th>
                <th className="py-3 px-2">الفجر</th>
                <th className="py-3 px-2">الشروق</th>
                <th className="py-3 px-2">الظهر</th>
                <th className="py-3 px-2">العصر</th>
                <th className="py-3 px-2">المغرب</th>
                <th className="py-3 px-2">العشاء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-300/10 text-xs sm:text-sm">
              { calendarData.map( ( day, index ) =>
              {
                const isToday = new Date().toDateString() === new Date( day.date.gregorian.date.split( '-' ).reverse().join( '-' ) ).toDateString();

                return (
                  <tr
                    key={ index }
                    className={ `transition-colors hover:bg-amber-300/5 ${ isToday ? 'bg-amber-300/15 font-bold' : '' }` }
                  >
                    <td className="py-3 px-2 font-medium">
                      <div className="text-amber-300">{ day.date.gregorian.day }</div>
                      <div className="text-[10px] text-gray-400 font-light">
                        { day.date.hijri.day } { day.date.hijri.month.ar }
                      </div>
                    </td>
                    <td className="py-3 px-2">{ day.timings.Fajr.split( ' ' )[ 0 ] }</td>
                    <td className="py-3 px-2">{ day.timings.Sunrise.split( ' ' )[ 0 ] }</td>
                    <td className="py-3 px-2">{ day.timings.Dhuhr.split( ' ' )[ 0 ] }</td>
                    <td className="py-3 px-2">{ day.timings.Asr.split( ' ' )[ 0 ] }</td>
                    <td className="py-3 px-2">{ day.timings.Maghrib.split( ' ' )[ 0 ] }</td>
                    <td className="py-3 px-2">{ day.timings.Isha.split( ' ' )[ 0 ] }</td>
                  </tr>
                );
              } ) }
            </tbody>
          </table>
        </div>
      ) }

    </div>
  );
}