import { Locate, Loader2 } from "lucide-react";
import SearchCity from "./SearchCity";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCity, fetchPrayerTimes, fetchPrayerTimesByCoords } from "../redux/prayerSlice";
import CustomAlert from "./CustomAlert";
import { CITIES_LIST } from '../data/citiesData'
import ThemeToggle from "./ThemeToggle";

export default function Header ()
{
  const dispatch = useDispatch();
  const { selectedCity, loading } = useSelector( ( state ) => state.prayer );
  const [ time, setTime ] = useState( new Date() );
  const [ isLocating, setIsLocating ] = useState( false );
  const [ alertConfig, setAlertConfig ] = useState( { isOpen: false, type: 'info', message: '', onConfirm: null } );

  const hijriDate = new Intl.DateTimeFormat( 'ar-SA-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  } ).format( new Date() );

  const formatter = new Intl.DateTimeFormat( 'ar-SA', {
    calendar: 'gregory',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  } );

  const formattedDate = formatter.format( new Date() );

  useEffect( () =>
  {
    const timer = setInterval( () =>
    {
      setTime( new Date() );
    }, 1000 );

    return () => clearInterval( timer );
  }, [] );

  const formattedTime = new Intl.DateTimeFormat( 'en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  } ).format( time );

  // دالة تحديد الموقع عبر الـ GPS عند النقر على أيقونة Locate
  const handleGetLocation = () =>
  {
    if ( !navigator.geolocation )
    {
      setAlertConfig( {
        isOpen: true,
        type: 'warning',
        message: 'خاصية تحديد الموقع غير مدعومة في متصفحك الحالي.',
        onConfirm: null
      } );
      return;
    }

    setIsLocating( true );

    navigator.geolocation.getCurrentPosition(
      ( position ) =>
      {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        dispatch( fetchPrayerTimesByCoords( { latitude, longitude } ) );
        dispatch( setSelectedCity( { label: 'الموقع الحالي (GPS)', value: 'gps' } ) );
        setIsLocating( false );
      },
      ( error ) =>
      {
        console.error( error );
        setIsLocating( false );
        setAlertConfig( {
          isOpen: true,
          type: 'warning',
          message: 'تعذر الحصول على موقعك الجغرافي. يرجى التأكد من السماح بصلاحية الموقع في المتصفح.',
          onConfirm: null
        } );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCityChange = ( cityValue ) =>
  {
    const cityObj = CITIES_LIST.find( ( c ) => c.value === cityValue );
    if ( cityObj )
    {
      dispatch( setSelectedCity( cityObj ) );
      dispatch( fetchPrayerTimes( cityObj ) );
    }
  };

  return (
    <div className='flex justify-center sm:justify-between items-center flex-wrap mt-4 p-4 gap-3 w-full border border-gray-500 rounded-lg shadow-md text-amber-400 bg-primary' dir="rtl">
      <div className="flex items-center gap-3">
        <CustomAlert
          isOpen={ alertConfig.isOpen }
          type={ alertConfig.type }
          message={ alertConfig.message }
          onConfirm={ alertConfig.onConfirm }
          onClose={ () => setAlertConfig( prev => ( { ...prev, isOpen: false } ) ) }
        />
        {/* زر تحديد الموقع الحالي */ }
        <button
          type="button"
          onClick={ handleGetLocation }
          disabled={ isLocating || loading }
          className='p-2 border border-amber-400 rounded-lg hover:bg-amber-300/20 hover:cursor-pointer transition-colors disabled:opacity-50'
          title="تحديد الموقع الحالي تلقائياً عبر GPS"
        >
          { isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
          ) : (
            <Locate className="w-5 h-5" />
          ) }
        </button>
        <SearchCity
          options={ CITIES_LIST }
          selectedValue={ selectedCity.value }
          onSelect={ handleCityChange }
          placeholder="ابحث واختر مدينة..."
        />
      </div>

      <div className="flex items-center justify-center flex-col gap-1 text-amber-300/80 text-sm font-semibold">
        <div className="text-amber-300/80 font-extrabold text-sm">{ hijriDate }</div>
        <div className="text-amber-200/80 font-light text-xs">{ formattedDate }</div>
      </div>

      <div className="flex items-center justify-center flex-col gap-1 text-amber-300/80 text-sm">
        <div className="text-amber-300 font-extrabold text-xl">
          { formattedTime }
        </div>
        <span className="text-xs">التوقيت المحلي</span>
      </div>
      <ThemeToggle/>
    </div>
  );
}