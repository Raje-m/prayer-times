import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle ()
{
  const [ isOled, setIsOled ] = useState( () =>
  {
    return localStorage.getItem( 'oled_theme' ) === 'true';
  } );

  useEffect( () =>
  {
    localStorage.setItem( 'oled_theme', isOled );
    if ( isOled )
    {
      document.documentElement.classList.add( 'oled-theme' );
      document.body.classList.add( 'oled-theme' );
    } else
    {
      document.documentElement.classList.remove( 'oled-theme' );
      document.body.classList.remove( 'oled-theme' );
    }
  }, [ isOled ] );

  return (
    <button
      onClick={ () => setIsOled( !isOled ) }
      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400/20 transition-all text-xs sm:text-sm font-bold cursor-pointer"
      title="تبديل الوضع الليلي الصرف (OLED)"
    >
      { isOled ? (
        <>
          <Moon className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>وضع الداكن</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-amber-300/70" />
          <span>الوضع العادي</span>
        </>
      ) }
    </button>
  );
}