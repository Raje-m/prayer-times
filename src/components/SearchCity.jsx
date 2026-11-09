import React, { useState } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

export default function SearchCity ( {
  options = [],
  selectedValue,
  onSelect,
  placeholder = "اختر مدينة"
} )
{
  const [ isOpen, setIsOpen ] = useState( false );
  const [ searchTerm, setSearchTerm ] = useState( "" );

  // تصفية الخيارات
  const filteredOptions = options.filter( ( option ) =>
    option.label.toLowerCase().includes( searchTerm.toLowerCase() )
  );

  const selectedOption = options.find( ( opt ) => opt.value === selectedValue );

  return (
    <div className="relative w-full min-w-40 max-w-lg text-start" dir="rtl">

      {/* زر فتح القائمة */ }
      <button
        type="button"
        onClick={ () => setIsOpen( !isOpen ) }
        className="w-full   flex items-center justify-between px-4 py-3 bg-primary text-amber-300  transition-all focus:outline-none focus:ring-2 focus:ring-amber-300/50 hover:bg-primary/40 hover:text-amber-300/90  hover:cursor-pointer "
      >
        <span className={ selectedOption ? "font-semibold" : "text-amber-300/60" }>
          { selectedOption ? selectedOption.label : placeholder }
        </span>
        <ChevronDown className={ `w-5 h-5 transition-transform duration-300 ${ isOpen ? "rotate-180" : "" }` } />
      </button>

      {/* القائمة المنسدلة */ }
      { isOpen && (
        <>
          {/* طبقة شفافة للإغلاق عند النقر خارج القائمة */ }
          <div className="fixed inset-0 z-40 bg-black/20" onClick={ () => setIsOpen( false ) } />

          {/* صندوق الخيارات (متجاوب مع الهواتف والشاشات) */ }
          <div className="absolute z-50 w-full mt-2 bg-primary border border-amber-300/20 rounded-xl shadow-2xl overflow-hidden">

            {/* حقل البحث */ }
            <div className="p-2.5 border-b border-amber-300/10 flex items-center gap-2 bg-amber-300/5">
              <Search className="w-4 h-4 text-amber-300/60 ms-1 shrink-0" />
              <input
                type="text"
                className="w-full bg-transparent text-sm text-amber-300 focus:outline-none placeholder-amber-300/40"
                placeholder="ابحث عن مدينة..."
                value={ searchTerm }
                onChange={ ( e ) => setSearchTerm( e.target.value ) }
                autoFocus
              />
              { searchTerm && (
                <button type="button" onClick={ () => setSearchTerm( "" ) } className="text-amber-300/60 hover:text-amber-300">
                  <X className="w-4 h-4" />
                </button>
              ) }
            </div>

            {/* قائمة الخيارات */ }
            <ul className="custom-scrollbar max-h-56 overflow-y-auto p-1 text-sm  ">
              { filteredOptions.length > 0 ? (
                filteredOptions.map( ( option ) =>
                {
                  const isSelected = selectedValue === option.value;
                  return (
                    <li
                      key={ option.value }
                      onClick={ () =>
                      {
                        onSelect( option.value );
                        setIsOpen( false );
                        setSearchTerm( "" );
                      } }
                      className={ `flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${ isSelected
                          ? "bg-amber-300/20 text-amber-300 font-bold"
                          : "text-amber-300/80 hover:bg-amber-300/10 hover:text-amber-300"
                        }` }
                    >
                      <span>{ option.label }</span>
                      { isSelected && <Check className="w-4 h-4 text-amber-300" /> }
                    </li>
                  );
                } )
              ) : (
                <li className="px-4 py-4 text-center text-amber-300/50 text-sm">
                  لا توجد نتائج مطابقة
                </li>
              ) }
            </ul>
          </div>
        </>
      ) }
    </div>
  );
}