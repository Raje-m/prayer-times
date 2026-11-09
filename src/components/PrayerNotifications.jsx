import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell, BellOff, CheckCircle, Volume2 } from 'lucide-react';
import CustomAlert from './CustomAlert';

export default function PrayerNotifications ()
{
  const { timings } = useSelector( ( state ) => state.prayer );
  const [ notificationsEnabled, setNotificationsEnabled ] = useState( false );
  const [ alertConfig, setAlertConfig ] = useState( { isOpen: false, type: 'info', message: '', onConfirm: null } );

  // كائن الصوت
  const [ adhanAudio ] = useState( () => new Audio( '/adhan.mp3' ) );

  useEffect( () =>
  {
    if ( 'Notification' in window )
    {
      if ( Notification.permission === 'granted' )
      {
        setNotificationsEnabled( true );
      }
    }
  }, [] );

  // دالة اختبار صوت الأذان يدوياً
  const handleTestAdhan = () =>
  {
    adhanAudio.currentTime = 0; // إرجاع الصوت للبداية
    adhanAudio.play()
      .then( () =>
      {
        setAlertConfig( {
          isOpen: true,
          type: 'success',
          message: 'جاري تشغيل صوت الأذان التجريبي بنجاح.',
          onConfirm: null
        } );
      } )
      .catch( ( error ) =>
      {
        console.error( "خطأ في تشغيل الصوت:", error );
        setAlertConfig( {
          isOpen: true,
          type: 'warning',
          message: 'تعذر تشغيل الصوت. تأكد من وجود ملف adhan.mp3 في مجلد public.',
          onConfirm: null
        } );
      } );
  };

  const requestNotificationPermission = async () =>
  {
    if ( !( 'Notification' in window ) )
    {
      setAlertConfig( {
        isOpen: true,
        type: 'warning',
        message: 'متصفحك الحالي لا يدعم إشعارات سطح المكتب.',
        onConfirm: null
      } );
      return;
    }

    const permission = await Notification.requestPermission();
    if ( permission === 'granted' )
    {
      setNotificationsEnabled( true );
      setAlertConfig( {
        isOpen: true,
        type: 'success',
        message: 'تم تفعيل إشعارات الأذان بنجاح، سيتم إعلامك وتشغيل الصوت عند أوقات الصلاة.',
        onConfirm: null
      } );
    } else
    {
      setNotificationsEnabled( false );
      setAlertConfig( {
        isOpen: true,
        type: 'warning',
        message: 'تم رفض إذن الإشعارات. يمكنك تفعيلها يدويًا من إعدادات المتصفح.',
        onConfirm: null
      } );
    }
  };

  // مراقبة أوقات الصلاة وتشغيل الصوت والإشعار
  useEffect( () =>
  {
    if ( !timings ) return;

    const checkPrayerTimes = () =>
    {
      const now = new Date();
      const currentHours = String( now.getHours() ).padStart( 2, '0' );
      const currentMinutes = String( now.getMinutes() ).padStart( 2, '0' );
      const currentTimeStr = `${ currentHours }:${ currentMinutes }`;

      const prayersToCheck = [
        { name: 'الفجر', time: timings.Fajr?.split( ' ' )[ 0 ] },
        { name: 'الظهر', time: timings.Dhuhr?.split( ' ' )[ 0 ] },
        { name: 'العصر', time: timings.Asr?.split( ' ' )[ 0 ] },
        { name: 'المغرب', time: timings.Maghrib?.split( ' ' )[ 0 ] },
        { name: 'العشاء', time: timings.Isha?.split( ' ' )[ 0 ] },
      ];

      prayersToCheck.forEach( ( prayer ) =>
      {
        if ( prayer.time === currentTimeStr && now.getSeconds() === 0 )
        {

          // تشغيل الصوت دائماً عند وقت الصلاة
          adhanAudio.play().catch( err => console.log( err ) );

          // إرسال إشعار سطح المكتب إذا كانت مفعمة
          if ( notificationsEnabled && Notification.permission === 'granted' )
          {
            new Notification( `حان الآن وقت صلاة ${ prayer.name }`, {
              body: `اللهم رب هذه الدعوة التامة والصلاة القائمة...`,
              icon: '/favicon.ico'
            } );
          }
        }
      } );
    };

    const interval = setInterval( checkPrayerTimes, 1000 );
    return () => clearInterval( interval );
  }, [ notificationsEnabled, timings, adhanAudio ] );

  return (
    <>
      <CustomAlert
        isOpen={ alertConfig.isOpen }
        type={ alertConfig.type }
        message={ alertConfig.message }
        onConfirm={ alertConfig.onConfirm }
        onClose={ () => setAlertConfig( prev => ( { ...prev, isOpen: false } ) ) }
      />

      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#091e57] border border-amber-300/20 rounded-2xl shadow-md text-amber-300">
        <div className="flex items-center gap-3">
          { notificationsEnabled ? (
            <Bell className="w-5 h-5 text-emerald-400 animate-pulse" />
          ) : (
            <BellOff className="w-5 h-5 text-amber-300/60" />
          ) }
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold">تنبيهات وصوت الأذان</span>
            <span className="text-[11px] text-amber-300/70">
              { notificationsEnabled ? 'الإشعارات والصوت مفعلان بالكامل' : 'فعّل الإشعارات أو جرب الصوت يدوياً' }
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* زر اختبار الصوت */ }
          <button
            onClick={ handleTestAdhan }
            className="px-3 py-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400/20 transition-all text-xs font-bold cursor-pointer flex items-center gap-1.5"
            title="اختبار صوت الأذان"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>تجربة الصوت</span>
          </button>

          {/* زر تفعيل الإشعارات */ }
          <button
            onClick={ requestNotificationPermission }
            className={ `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${ notificationsEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-300 text-primary hover:bg-amber-400 shadow'
              }` }
          >
            { notificationsEnabled ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>مفعلة</span>
              </>
            ) : (
              <span>تفعيل التنبيهات</span>
            ) }
          </button>
        </div>
      </div>
    </>
  );
}