import React, { useState, useEffect } from 'react';
import { Compass, AlertCircle, Navigation } from 'lucide-react';
import CustomAlert from './CustomAlert';

export default function QiblaCompass ()
{
  const [ heading, setHeading ] = useState( 0 ); // اتجاه وجهة الهاتف
  const [ qiblaAngle, setQiblaAngle ] = useState( 0 ); // زاوية القبلة بالنسبة للمستخدم
  const [ permissionGranted, setPermissionGranted ] = useState( false );
  const [ alertConfig, setAlertConfig ] = useState( { isOpen: false, type: 'info', message: '', onConfirm: null } );

  // إحداثيات الكعبة المشرفة
  const KABAH_LAT = 21.4225;
  const KABAH_LNG = 39.8262;

  // حساب زاوية القبلة بناءً على موقع المستخدم الحالي (GPS)
  useEffect( () =>
  {
    if ( navigator.geolocation )
    {
      navigator.geolocation.getCurrentPosition(
        ( position ) =>
        {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          const lat1 = ( userLat * Math.PI ) / 180;
          const lon1 = ( userLng * Math.PI ) / 180;
          const lat2 = ( KABAH_LAT * Math.PI ) / 180;
          const lon2 = ( KABAH_LNG * Math.PI ) / 180;

          const y = Math.sin( lon2 - lon1 ) * Math.cos( lat2 );
          const x = Math.cos( lat1 ) * Math.sin( lat2 ) - Math.sin( lat1 ) * Math.cos( lat2 ) * Math.cos( lon2 - lon1 );
          let bearing = Math.atan2( y, x );
          bearing = ( bearing * 180 ) / Math.PI;
          bearing = ( bearing + 360 ) % 360;

          setQiblaAngle( bearing );
        },
        ( error ) =>
        {
          console.error( "تعذر تحديد الموقع لحساب اتجاه القبلة", error );
        }
      );
    }
  }, [] );

  // طلب صلاحية مستشعرات الاتجاه (مهمة لأجهزة آيفون الحديثة iOS 13+)
  const requestCompassPermission = () =>
  {
    if ( typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function' )
    {
      DeviceOrientationEvent.requestPermission()
        .then( response =>
        {
          if ( response === 'granted' )
          {
            setPermissionGranted( true );
            window.addEventListener( 'deviceorientation', handleOrientation, true );
          } else
          {
            setAlertConfig( {
              isOpen: true,
              type: 'warning',
              message: 'تم رفض إذن الوصول لمستشعر الحركة والاتجاه.',
              onConfirm: null
            } );
          }
        } )
        .catch( console.error );
    } else
    {
      setPermissionGranted( true );
      window.addEventListener( 'deviceorientation', handleOrientation, true );
    }
  };

  // استقبال بيانات دوران الهاتف
  const handleOrientation = ( event ) =>
  {
    let compass = event.webkitCompassHeading || event.alpha;
    if ( compass !== undefined )
    {
      setHeading( compass );
    }
  };

  useEffect( () =>
  {
    return () =>
    {
      window.removeEventListener( 'deviceorientation', handleOrientation, true );
    };
  }, [] );

  // حساب دوران سهم القبلة بالنسبة لحركة الهاتف
  const needleRotation = qiblaAngle - heading;

  return (
    <div className="w-full bg-linear-to-b from-[#101b3b] via-[#09132d] to-[#060c1e] border-2 border-amber-400/30 rounded-3xl p-6 sm:p-8 text-amber-300 shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden" dir="rtl">

      <CustomAlert
        isOpen={ alertConfig.isOpen }
        type={ alertConfig.type }
        message={ alertConfig.message }
        onConfirm={ alertConfig.onConfirm }
        onClose={ () => setAlertConfig( prev => ( { ...prev, isOpen: false } ) ) }
      />

      {/* عنوان القسم */ }
      <div className="flex items-center justify-between w-full border-b border-amber-300/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/20">
            <Compass className="w-6 h-6 text-amber-400 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300">بوصلة القبلة التفاعلية</h2>
            <span className="text-xs text-amber-300/60 font-light">تحديد اتجاه الكعبة المشرفة بدقة</span>
          </div>
        </div>
      </div>

      { !permissionGranted ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="text-xs sm:text-sm text-amber-300/80 max-w-sm">
            يتطلب تشغيل البوصلة السماح بالوصول إلى مستشعرات الاتجاه في هاتفك المحمول.
          </p>
          <button
            onClick={ requestCompassPermission }
            className="px-6 py-3 rounded-xl bg-amber-400 text-primary font-bold text-xs sm:text-sm hover:bg-amber-500 transition-all shadow-lg cursor-pointer"
          >
            تفعيل بوصلة القبلة
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 py-4">

          {/* تصميم البوصلة الدائرية */ }
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-amber-400/40 bg-[#081024] shadow-inner flex items-center justify-center">

            {/* اتجاهات فرعية */ }
            <span className="absolute top-3 text-xs font-bold text-amber-400">N (شمال)</span>
            <span className="absolute bottom-3 text-xs font-bold text-amber-300/50">S</span>
            <span className="absolute right-3 text-xs font-bold text-amber-300/50">E</span>
            <span className="absolute left-3 text-xs font-bold text-amber-300/50">W</span>

            {/* مؤشر القبلة المتحرك */ }
            <div
              className="absolute w-full h-full flex items-center justify-center transition-transform duration-150"
              style={ { transform: `rotate(${ needleRotation }deg)` } }
            >
              <div className="w-2 h-28 bg-linear-to-t from-transparent via-amber-400 to-emerald-400 rounded-full shadow-lg relative -top-12 flex flex-col items-center">
                <Navigation className="w-6 h-6 text-emerald-400 -top-3 absolute rotate-0 drop-shadow-md" />
              </div>
            </div>

            {/* مركز البوصلة */ }
            <div className="w-12 h-12 rounded-full bg-primary border-2 border-amber-400 z-10 flex items-center justify-center shadow-lg">
              <span className="text-[10px] font-bold text-amber-300">الكعبة</span>
            </div>

          </div>

          <p className="text-xs text-amber-300/70 font-medium text-center">
            قم بتوجيه هاتفك حتى يتطابق السهم للأعلى نحو مؤشر الكعبة المشرفة.
          </p>

        </div>
      ) }

    </div>
  );
}