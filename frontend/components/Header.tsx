import React from 'react';
import { ModeraLogo, Search, AppGrid, Heart, ShoppingBag } from './icons';

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const categories = ["Truffles", "Dark Chocolate", "Milk Chocolate", "Gift Boxes", "Bars", "Seasonal"];
  
  return (
    <header className="flex items-center justify-between text-neutral-300 px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3" style={{flexShrink: 0}}>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2" style={{backgroundColor: 'rgba(57, 30, 16, 0.8)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
          <img src="/Media/OW-Logo.png" alt="ChocE Moments" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain" />
          <span className="font-semibold text-xs sm:text-sm" style={{color: '#FDFCE8'}}>ChocE Moments</span>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 backdrop-blur-md rounded-full px-3 py-1.5 md:px-4 md:py-2 font-semibold text-xs sm:text-sm shadow-lg transition-all hover:scale-105" 
            style={{backgroundColor: 'rgba(199, 160, 122, 0.95)', borderWidth: '2px', borderStyle: 'solid', borderColor: '#C7A07A', color: '#16302B'}}
          >
            <span>Truffles</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-50 min-w-[200px]" style={{backgroundColor: 'rgba(57, 30, 16, 0.95)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.5)'}}>
              {categories.map((cat, index) => (
                <button 
                  key={cat}
                  className="w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: index === 0 ? 'rgba(199, 160, 122, 0.3)' : 'transparent',
                    color: '#FDFCE8',
                    borderBottom: index < categories.length - 1 ? '1px solid rgba(199, 160, 122, 0.2)' : 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(199, 160, 122, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index === 0 ? 'rgba(199, 160, 122, 0.3)' : 'transparent'}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
        </div>
      </div>
      <div className="hidden sm:flex flex-1 mx-2 sm:mx-3 md:mx-4 lg:mx-6">
        <div className="relative max-w-xs sm:max-w-sm md:max-w-md mx-auto w-full">
          <Search className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{color: '#C7A07A'}} />
          <div className="backdrop-blur-sm rounded-full w-full h-8 sm:h-9 md:h-10" style={{backgroundColor: 'rgba(115, 65, 40, 0.4)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.25)'}}></div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
        <button className="backdrop-blur-sm p-1.5 sm:p-2 md:p-2.5 rounded-full" style={{backgroundColor: 'rgba(115, 65, 40, 0.5)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.25)'}}>
          <AppGrid className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#E2CEB1'}} />
        </button>
        <button className="backdrop-blur-sm p-1.5 sm:p-2 md:p-2.5 rounded-full" style={{backgroundColor: 'rgba(164, 69, 41, 0.4)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(164, 69, 41, 0.5)'}}>
          <Heart className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#A44529'}} fill="currentColor" />
        </button>
        <button className="hidden sm:block backdrop-blur-sm p-1.5 sm:p-2 md:p-2.5 rounded-full" style={{backgroundColor: 'rgba(115, 65, 40, 0.5)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.25)'}}>
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#C7A07A'}} />
        </button>
        <div className="hidden md:flex items-center gap-2 sm:gap-2.5 backdrop-blur-sm rounded-full pl-2 sm:pl-3 md:pl-4 pr-1 sm:pr-1.5 md:pr-2 py-1 sm:py-1.5 md:py-2" style={{backgroundColor: 'rgba(57, 30, 16, 0.7)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
          <span className="text-xs sm:text-sm font-medium" style={{color: '#FDFCE8'}}>Olivia Smith</span>
          <img src="https://i.pravatar.cc/150?u=olivia" alt="Olivia Smith" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;