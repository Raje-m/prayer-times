import React, { useState, useEffect } from 'react';
import { Download, Share, X, Smartphone } from 'lucide-react';

export default function InstallPWAButton ()
{
  const [ deferredPrompt, setDeferredPrompt ] = useState( null );
  const [ isInstallable, setIsInstallable ] = useState( false );
  const [ isIOS, setIsIOS ] = useState( false );
  const [ showIOSGuide, setShowIOSGuide ] = useState( false );
  const [ isInstalled, setIsInstalled ] = useState( false );

  useEffect( () =>
  {
    const isStandalone =
      window.matchMedia( '(display-mode: standalone)' ).matches ||
      window.navigator.standalone === true;

    if ( isStandalone )
    {
      setIsInstalled( true );
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test( userAgent );
    if ( isIOSDevice )
    {
      setIsIOS( true );
      setIsInstallable( true );
    }

    const handleBeforeInstallPrompt = ( e ) =>
    {
      e.preventDefault();
      setDeferredPrompt( e );
      setIsInstallable( true );
    };

    const handleAppInstalled = () =>
    {
      setIsInstalled( true );
      setIsInstallable( false );
      setDeferredPrompt( null );
    };

    window.addEventListener( 'beforeinstallprompt', handleBeforeInstallPrompt );
    window.addEventListener( 'appinstalled', handleAppInstalled );

    return () =>
    {
      window.removeEventListener( 'beforeinstallprompt', handleBeforeInstallPrompt );
      window.removeEventListener( 'appinstalled', handleAppInstalled );
    };
  }, [] );

  const handleInstallClick = async () =>
  {
    if ( isIOS )
    {
      setShowIOSGuide( true );
      return;
    }

    if ( !deferredPrompt ) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if ( outcome === 'accepted' )
    {
      setIsInstallable( false );
    }
    setDeferredPrompt( null );
  };

  if ( isInstalled || !isInstallable ) return null;

  return (
    <>
      {/* زر تثبيت مصغر ومدمج بنفس مقاس أزرار شريط التنبيهات */ }
      <button
        onClick={ handleInstallClick }
        className="px-3 py-2 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 hover:bg-amber-400/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
        title="تثبيت التطبيق على الجهاز"
      >
        <Download className="w-3.5 h-3.5 text-amber-400" />
        <span>تثبيت التطبيق</span>
      </button>

      {/* نافذة إرشاد التثبيت لمستخدمي iPhone (Safari) */ }
      { showIOSGuide && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          dir="rtl"
          onClick={ () => setShowIOSGuide( false ) }
        >
          <div
            className="w-full max-w-md bg-[#0b1636] border border-amber-400/30 rounded-3xl p-6 text-amber-200 shadow-2xl space-y-4"
            onClick={ ( e ) => e.stopPropagation() }
          >
            <div className="flex items-center justify-between border-b border-amber-300/15 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <h4 className="font-black text-base text-amber-300">تثبيت التطبيق على الآيفون</h4>
              </div>
              <button
                onClick={ () => setShowIOSGuide( false ) }
                className="p-1.5 rounded-xl bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ol className="space-y-3 text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0">1</span>
                <span>
                  اضغط على أيقونة المشاركة <Share className="w-4 h-4 inline text-sky-400 mx-1" /> في أسفل متصفح Safari.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0">2</span>
                <span>
                  مرر للأسفل واختر <strong className="text-amber-300">"إضافة إلى الصفحة الرئيسية" (Add to Home Screen)</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0">3</span>
                <span>
                  اضغط على <strong className="text-amber-300">"إضافة" (Add)</strong> في الزاوية العلوية ليظهر التطبيق على شاشتك.
                </span>
              </li>
            </ol>
          </div>
        </div>
      ) }
    </>
  );
}