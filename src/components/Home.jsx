import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPrayerTimes } from '../redux/prayerSlice';
import Header from './Header';
import NextPrayerCard from './NextPrayerCard';
import PrayerTimesList from './PrayerTimesList';
import PrayerNotifications from './PrayerNotifications';
import { Sunrise, Compass, Sparkles, LayoutGrid, Calendar as CalendarIcon } from 'lucide-react';
import Footer from './Footer';

// الاستيراد الكسول (Lazy Loading) للمكونات الثقيلة التي تظهر عبر التبويبات
const MonthlyCalendar = lazy( () => import( './MonthlyCalendar' ) );
const QiblaDirection = lazy( () => import( './QiblaDirection' ) );
const AthkarSection = lazy( () => import( './AthkarSection' ) );
const DigitalTasbih = lazy( () => import( './DigitalTasbih' ) );
const HisnMuslim = lazy( () => import( './HisnMuslim' ) );

export default function Home ()
{
  const dispatch = useDispatch();
  const { selectedCity, timings, loading } = useSelector( ( state ) => state.prayer );

  const [ activeTab, setActiveTab ] = useState( 'home' );

  useEffect( () =>
  {
    if ( selectedCity && selectedCity.value !== 'gps' )
    {
      dispatch( fetchPrayerTimes( selectedCity ) );
    }
  }, [ dispatch, selectedCity ] );

  const rawPrayers = timings ? [
    { name: 'الفجر', time: timings.Fajr, period: 'صباحاً', icon: Sunrise },
    { name: 'الشروق', time: timings.Sunrise, period: 'صباحاً', icon: Sunrise },
    { name: 'الظهر', time: timings.Dhuhr, period: 'مساءً', icon: Sunrise },
    { name: 'العصر', time: timings.Asr, period: 'مساءً', icon: Sunrise },
    { name: 'المغرب', time: timings.Maghrib, period: 'مساءً', icon: Sunrise },
    { name: 'العشاء', time: timings.Isha, period: 'مساءً', icon: Sunrise },
  ] : [];

  const timeToMinutes = ( timeStr ) =>
  {
    if ( !timeStr ) return 0;
    const cleanTime = timeStr.split( ' ' )[ 0 ];
    const [ h, m ] = cleanTime.split( ':' ).map( Number );
    return h * 60 + m;
  };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let nextIndex = rawPrayers.findIndex( p => timeToMinutes( p.time ) > currentMinutes );
  if ( nextIndex === -1 && rawPrayers.length > 0 ) nextIndex = 0;

  const nextPrayer = rawPrayers[ nextIndex ] || { name: 'الفجر', time: '04:45' };

  return (
    <div className="min-h-screen w-full bg-primary text-amber-300 flex flex-col items-center justify-start py-4 px-4" dir="rtl">
      <div className="container mx-auto flex flex-col items-center justify-center gap-5 max-w-4xl">

        <Header />
        <PrayerNotifications />

        {/* شريط التبويبات */ }
        <div className="w-full grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-primary border border-amber-300/20 rounded-2xl shadow-md">
          <button
            onClick={ () => setActiveTab( 'home' ) }
            className={ `py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${ activeTab === 'home' ? 'bg-amber-300 text-primary shadow-lg' : 'text-amber-300/70 hover:text-amber-300 hover:bg-amber-300/10'
              }` }
          >
            <Sunrise className="w-4 h-4" />
            <span>المواقيت</span>
          </button>

          <button
            onClick={ () => setActiveTab( 'calendar' ) }
            className={ `py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${ activeTab === 'calendar' ? 'bg-amber-300 text-primary shadow-lg' : 'text-amber-300/70 hover:text-amber-300 hover:bg-amber-300/10'
              }` }
          >
            <CalendarIcon className="w-4 h-4" />
            <span>التقويم</span>
          </button>

          <button
            onClick={ () => setActiveTab( 'qibla-athkar' ) }
            className={ `py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${ activeTab === 'qibla-athkar' ? 'bg-amber-300 text-primary shadow-lg' : 'text-amber-300/70 hover:text-amber-300 hover:bg-amber-300/10'
              }` }
          >
            <Compass className="w-4 h-4" />
            <span>القبلة والأذكار</span>
          </button>

          <button
            onClick={ () => setActiveTab( 'tasbih' ) }
            className={ `py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${ activeTab === 'tasbih' ? 'bg-amber-300 text-primary shadow-lg' : 'text-amber-300/70 hover:text-amber-300 hover:bg-amber-300/10'
              }` }
          >
            <Sparkles className="w-4 h-4" />
            <span>المسبحة</span>
          </button>

          <button
            onClick={ () => setActiveTab( 'all' ) }
            className={ `py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${ activeTab === 'all' ? 'bg-amber-300 text-primary shadow-lg' : 'text-amber-300/70 hover:text-amber-300 hover:bg-amber-300/10'
              }` }
          >
            <LayoutGrid className="w-4 h-4" />
            <span>عرض الكل</span>
          </button>
        </div>

        {/* محتوى التبويبات مغلف بـ Suspense لتحميل المكونات عند الحاجة فقط */ }
        <div className="w-full flex flex-col gap-5">
          <Suspense fallback={
            <div className="w-full py-12 text-center text-amber-400 animate-pulse font-bold text-sm">
        الرجاء الانتظار ...
            </div>
          }>
            { activeTab === 'home' && (
              <>
                <NextPrayerCard nextPrayerName={ nextPrayer.name } nextPrayerTime={ nextPrayer.time } />
                <PrayerTimesList rawPrayers={ rawPrayers } nextPrayerIndex={ nextIndex } loading={ loading } city={ selectedCity.label || selectedCity.name } />
              </>
            ) }

            { activeTab === 'calendar' && <MonthlyCalendar /> }

            { activeTab === 'qibla-athkar' && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <QiblaDirection />
                <HisnMuslim />
              </div>
            ) }

            { activeTab === 'tasbih' && (
              <div className="w-full max-w-xl mx-auto">
                <DigitalTasbih />
              </div>
            ) }

            { activeTab === 'all' && (
              <div className="w-full flex flex-col gap-6">
                <NextPrayerCard nextPrayerName={ nextPrayer.name } nextPrayerTime={ nextPrayer.time } />
                <PrayerTimesList rawPrayers={ rawPrayers } nextPrayerIndex={ nextIndex } loading={ loading } city={ selectedCity.label || selectedCity.name } />
                <MonthlyCalendar />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <QiblaDirection />
                  <AthkarSection />
                </div>
                <div className="w-full max-w-xl mx-auto">
                  <DigitalTasbih />
                </div>
              </div>
            ) }
          </Suspense>
        </div>
      </div>
<Footer/>
    </div>
  );
}