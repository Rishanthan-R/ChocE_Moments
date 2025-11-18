import React from 'react';
import { ModeraLogo, Search, AppGrid, Heart, ShoppingBag } from './icons';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between text-neutral-300">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-neutral-700/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
          <ModeraLogo className="w-5 h-5" />
          <span className="font-semibold text-white">MODERA</span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-neutral-700/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
          <span>Armchairs</span>
        </div>
      </div>
      <div className="flex-1 mx-4 lg:mx-8">
        <div className="relative max-w-xs mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <div className="bg-neutral-700/50 backdrop-blur-sm rounded-full w-full h-10 border border-white/10"></div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="bg-neutral-700/50 backdrop-blur-sm p-2.5 rounded-full border border-white/10">
          <AppGrid className="w-5 h-5 text-white" />
        </button>
        <button className="bg-pink-500/20 backdrop-blur-sm p-2.5 rounded-full border border-pink-500/30">
          <Heart className="w-5 h-5 text-pink-400" fill="currentColor" />
        </button>
        <button className="bg-neutral-700/50 backdrop-blur-sm p-2.5 rounded-full border border-white/10">
          <ShoppingBag className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-3 bg-neutral-700/50 backdrop-blur-sm rounded-full pl-4 pr-2 py-1.5 border border-white/10">
          <span className="text-sm font-medium text-white">Olivia Smith</span>
          <img src="https://i.pravatar.cc/150?u=olivia" alt="Olivia Smith" className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;