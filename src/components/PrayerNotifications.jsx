import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Bell, BellOff, CheckCircle, Volume2, Square } from 'lucide-react';
import CustomAlert from './CustomAlert';
import InstallPWAButton from './InstallPWAButton';

export default function PrayerNotifications ()
{
  const { timings } = useSelector( ( state ) => state.prayer );
  const [ notificationsEnabled, setNotificationsEnabled ] = useState( false );
  const [ isPlaying, setIsPlaying ] = useState( false );
  const [ alertConfig, setAlertConfig ] = useState( {
    isOpen: false,
    type: 'info',
    message: '',
    onConfirm: null,
  } );

  const [ adhanAudio ] = useState( () =>
  {
    const audio = new Audio( '/adhan.mp3' );
    audio.preload = 'auto';
    return audio;
  } );

  // لتجنب تكرار الأذان في نفس الدقيقة دون الاعتماد على الثانية === 0
  const lastTriggeredPrayerRef = useRef( '' );

  useEffect( () =>
  {
    if ( 'Notification' in window && Notification.permission === 'granted' )
    {
      setNotificationsEnabled( true );
    }

    const handleEnded = () => setIsPlaying( false );
    adhanAudio.addEventListener( 'ended', handleEnded );
    return () => adhanAudio.removeEventListener( 'ended', handleEnded );
  }, [ adhanAudio ] );

  // دالة فك قفل الصوت في المتصفح (لضمان عمل التشغيل التلقائي لاحقاً)
  const unlockAudio = () =>
  {
    adhanAudio.muted = true;
    adhanAudio
      .play()
      .then( () =>
      {
        adhanAudio.pause();
        adhanAudio.currentTime = 0;
        adhanAudio.muted = false;
      } )
      .catch( () =>
      {
        adhanAudio.muted = false;
      } );
  };

  // دالة إيقاف الصوت يدوياً
  const handleStopAdhan = () =>
  {
    adhanAudio.pause();
    adhanAudio.currentTime = 0;
    setIsPlaying( false );
  };

  // دالة اختبار صوت الأذان يدوياً
  const handleTestAdhan = () =>
  {
    if ( isPlaying )
    {
      handleStopAdhan();
      return;
    }

    adhanAudio.muted = false;
    adhanAudio.currentTime = 0;
    adhanAudio
      .play()
      .then( () =>
      {
        setIsPlaying( true );
        setAlertConfig( {
          isOpen: true,
          type: 'success',
          message: 'جاري تشغيل صوت الأذان التجريبي بنجاح.',
          onConfirm: null,
        } );
      } )
      .catch( ( error ) =>
      {
        console.error( 'خطأ في تشغيل الصوت:', error );
        setAlertConfig( {
          isOpen: true,
          type: 'warning',
          message: 'تعذر تشغيل الصوت. تأكد من وجود ملف adhan.mp3 في مجلد public.',
          onConfirm: null,
        } );
      } );
  };

  // دالة موحدة لإرسال الإشعار تعمل على الكمبيوتر والهواتف (PWA)
  const sendPrayerNotification = async ( prayerName ) =>
  {
    if ( !notificationsEnabled || Notification.permission !== 'granted' ) return;

    const title = `حان الآن وقت صلاة ${ prayerName }`;
    const options = {
      body: 'اللهم رب هذه الدعوة التامة والصلاة القائمة...',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [ 200, 100, 200 ],
      tag: `prayer-${ prayerName }`,
    };

    try
    {
      if ( 'serviceWorker' in navigator )
      {
        const registration = await navigator.serviceWorker.ready;
        if ( registration && registration.showNotification )
        {
          await registration.showNotification( title, options );
          return;
        }
      }
      new Notification( title, options );
    } catch ( err )
    {
      console.error( 'فشل إرسال الإشعار:', err );
    }
  };

  const requestNotificationPermission = async () =>
  {
    // فك قفل الصوت بمجرد نقر المستخدم على الزر
    unlockAudio();

    if ( !( 'Notification' in window ) )
    {
      setAlertConfig( {
        isOpen: true,
        type: 'warning',
        message: 'متصفحك الحالي لا يدعم إشعارات النظام، لكن تم تفعيل الصوت داخل الصفحة.',
        onConfirm: null,
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
        message: 'تم تفعيل إشعارات وصوت الأذان بنجاح.',
        onConfirm: null,
      } );
    } else
    {
      setNotificationsEnabled( false );
      setAlertConfig( {
        isOpen: true,
        type: 'warning',
        message: 'تم رفض إذن الإشعارات. يمكنك تفعيلها يدوياً من إعدادات المتصفح.',
        onConfirm: null,
      } );
    }
  };

  // مراقبة أوقات الصلاة
  useEffect( () =>
  {
    if ( !timings ) return;

    const checkPrayerTimes = () =>
    {
      const now = new Date();
      const todayStr = now.toDateString();
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
        const triggerKey = `${ todayStr }-${ prayer.name }-${ prayer.time }`;

        // التحقق من تطابق الساعة والدقيقة فقط + عدم تشغيلها مسبقاً في نفس اليوم
        if ( prayer.time === currentTimeStr && lastTriggeredPrayerRef.current !== triggerKey )
        {
          lastTriggeredPrayerRef.current = triggerKey;

          // تشغيل الصوت
          adhanAudio.muted = false;
          adhanAudio.currentTime = 0;
          adhanAudio
            .play()
            .then( () => setIsPlaying( true ) )
            .catch( ( err ) => console.warn( 'المتصفح حظر التشغيل التلقائي لعدم وجود تفاعل مسبق:', err ) );

          // إرسال الإشعار
          sendPrayerNotification( prayer.name );
        }
      } );
    };

    checkPrayerTimes();
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
        onClose={ () => setAlertConfig( ( prev ) => ( { ...prev, isOpen: false } ) ) }
      />

      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#091e57] border border-amber-300/20 rounded-2xl shadow-md text-amber-300">
        {/* القسم الأيمن: الأيقونة والعنوان */ }
        <div className="flex items-center gap-3 w-full sm:w-auto">
          { notificationsEnabled ? (
            <Bell className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
          ) : (
            <BellOff className="w-5 h-5 text-amber-300/60 shrink-0" />
          ) }
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold">تنبيهات وصوت الأذان</span>
            <span className="text-[11px] text-amber-300/70">
              { notificationsEnabled ? 'الإشعارات والصوت مفعلان بالكامل' : 'فعّل الإشعارات أو جرب الصوت يدوياً' }
            </span>
          </div>
        </div>

        {/* القسم الأيسر: جميع الأزرار مجمّعة معاً */ }
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* زر تثبيت التطبيق المصغر */ }
          <InstallPWAButton />

          {/* زر اختبار أو إيقاف الصوت */ }
          <button
            onClick={ handleTestAdhan }
            className={ `px-3 py-2 rounded-xl border transition-all text-xs font-bold cursor-pointer flex items-center gap-1.5 ${ isPlaying
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                : 'bg-amber-400/10 border-amber-400/30 text-amber-300 hover:bg-amber-400/20'
              }` }
            title={ isPlaying ? 'إيقاف الأذان' : 'اختبار صوت الأذان' }
          >
            { isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>إيقاف الأذان</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>تجربة الصوت</span>
              </>
            ) }
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