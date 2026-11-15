import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import PrayerTimeCard from './PrayerTimeCard';

export default function PrayerTimesList ( { rawPrayers, nextPrayerIndex, loading, city } )
{
  return (
    <div className="w-full p-6 bg-primary rounded-2xl border border-amber-300/20 text-amber-300 shadow-xl flex flex-col gap-4">

      <div className="flex items-center justify-between pb-3 border-b border-amber-300/10">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-300" />
          <h2 className="text-lg font-bold">مواقيت الصلاة - { city }</h2>
        </div>
      </div>

      { loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-7 h-7 text-amber-300 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          { rawPrayers.map( ( prayer, index ) => (
            <PrayerTimeCard
              key={ index }
              name={ prayer.name }
              time={ prayer.time }
              period={ prayer.period }
              icon={ prayer.icon }
              isNext={ index === nextPrayerIndex }
            />
          ) ) }
        </div>
      ) }
    </div>
  );
}