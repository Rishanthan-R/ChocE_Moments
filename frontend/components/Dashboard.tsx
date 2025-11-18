import React from 'react';
// FIX: Imported the ShoppingBag icon.
import { FilterLines, Star, ArrowLeft, ArrowRight, ArrowUpRight, Tag, Heart, ShoppingBag } from './icons';

const CategoryNav: React.FC = () => {
  const categories = ["Table", "Sofa", "Bed", "Lamps", "Speakers", "Chairs"];
  return (
    <div className="flex items-center gap-3 text-sm">
      <button className="bg-neutral-700/50 backdrop-blur-sm p-3 rounded-full border border-white/10">
        <FilterLines className="w-5 h-5 text-white" />
      </button>
      {categories.map((cat, index) => (
        <button key={cat} className={`bg-neutral-700/50 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/10 ${index === 0 ? 'text-white' : 'text-neutral-400'}`}>
          {cat}
        </button>
      ))}
    </div>
  );
};

const ProductCard: React.FC = () => (
  <div className="col-span-4 row-span-6 bg-neutral-800/50 backdrop-blur-sm rounded-3xl p-6 flex flex-col justify-between border border-white/10 overflow-hidden relative">
      <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-70" alt="Armchair"/>
      <div className="relative z-10 flex justify-between items-start">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
              <div className="flex items-start">
                  <span className="text-xl font-medium mt-1">$</span>
                  <span className="text-5xl font-semibold">302</span>
              </div>
              <p className="text-neutral-300">Armchair</p>
          </div>
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor"/>
              <span className="font-semibold text-white">4.9</span>
          </div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-end gap-3 mb-4">
            <button className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/10"><Heart className="w-6 h-6 text-pink-400"/></button>
            <button className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/10"><ShoppingBag className="w-6 h-6"/></button>
        </div>
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/10">
            <button className="bg-neutral-800/50 p-2 rounded-full"><ArrowLeft className="w-6 h-6"/></button>
            <span className="text-sm font-medium tracking-wider">SLIDE LEFT AND RIGHT</span>
            <button className="bg-neutral-800/50 p-2 rounded-full"><ArrowRight className="w-6 h-6"/></button>
        </div>
      </div>
  </div>
);

const DealsCard: React.FC = () => (
    <div className="col-span-4 row-span-4 col-start-5 bg-neutral-800/50 backdrop-blur-sm rounded-3xl p-6 flex flex-col justify-between border border-white/10 overflow-hidden relative">
        <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop" 
             className="absolute right-0 bottom-0 h-4/5 w-auto object-contain z-0 opacity-80" alt="Fluffy Chair"/>
        <div className="relative z-10">
            <h2 className="text-3xl font-semibold text-white">Great Value Deals</h2>
            <p className="text-neutral-300">Find deals with 50%-60% off</p>
        </div>
        <div className="relative z-10 self-start">
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <Star className="w-5 h-5 text-yellow-400" fill="currentColor"/>
                <span className="font-semibold text-white">4.9</span>
            </div>
        </div>
    </div>
);

const TeamCard: React.FC = () => {
    const avatars = [1, 2, 3, 4, 5];
    return (
        <div className="col-span-2 row-span-2 col-start-9 bg-neutral-800/50 backdrop-blur-sm rounded-3xl p-4 flex flex-col justify-between border border-white/10">
            <div className="flex justify-between items-center">
                <div className="border border-white/20 rounded-full px-3 py-1 text-xs">OUR TEAM</div>
                <button className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10"><ArrowUpRight className="w-5 h-5"/></button>
            </div>
            <div>
                <p className="text-sm my-2">Our team designs minimalist modern furniture</p>
                <div className="flex -space-x-2">
                    {avatars.map(a => <img key={a} src={`https://i.pravatar.cc/150?img=${a+10}`} alt="team member" className="w-8 h-8 rounded-full border-2 border-neutral-800"/>)}
                </div>
            </div>
        </div>
    );
};

const JoinNowCard: React.FC = () => (
    <div className="col-span-2 row-span-2 col-start-9 row-start-3 bg-neutral-800/50 backdrop-blur-sm rounded-3xl p-4 flex flex-col justify-between border border-white/10">
        <div className="flex justify-between items-center">
            <div className="border border-white/20 rounded-full px-3 py-1 text-xs">JOIN NOW</div>
            <button className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10"><ArrowUpRight className="w-5 h-5"/></button>
        </div>
        <div>
            <label htmlFor="email" className="text-sm">Email</label>
            <input type="email" id="email" className="w-full bg-transparent border-b border-white/20 py-1 mt-1 outline-none"/>
            <button className="w-full bg-neutral-700/80 mt-3 py-2 rounded-full text-sm font-semibold border border-white/10">Subscribe</button>
        </div>
    </div>
);

const ExclusiveCard: React.FC = () => (
    <div className="col-span-4 row-span-2 col-start-5 row-start-5 bg-neutral-800/50 backdrop-blur-sm rounded-3xl p-6 flex items-center justify-between border border-white/10">
        <div className="w-1/2">
            <div className="border border-white/20 rounded-full px-3 py-1 text-xs inline-block mb-2">EXCLUSIVE</div>
            <h3 className="text-xl font-semibold text-white">Elegance Meets Simplicity</h3>
            <p className="text-sm text-neutral-300 mt-1">Upgrade your workspace with chairs that redefine modern simplicity.</p>
        </div>
        <div className="w-1/2 relative">
            <img src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=800&auto=format&fit=crop" className="rounded-2xl w-full h-auto object-cover" alt="Modern white chairs"/>
            <button className="absolute -top-3 -right-3 bg-white p-2.5 rounded-full shadow-lg"><Heart className="w-5 h-5 text-pink-500"/></button>
            <button className="absolute -bottom-3 right-4 bg-white text-black px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold shadow-lg">Open <ArrowUpRight className="w-4 h-4"/></button>
        </div>
    </div>
);

const ShopCard: React.FC = () => (
    <div className="col-span-2 row-span-2 col-start-9 row-start-5 bg-neutral-800/50 backdrop-blur-sm rounded-3xl p-4 flex flex-col justify-between border border-white/10 overflow-hidden">
        <div className="flex justify-between items-center">
            <div className="border border-white/20 rounded-full px-3 py-1 text-xs">OUR SHOP</div>
            <button className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10"><ArrowUpRight className="w-5 h-5"/></button>
        </div>
        <div>
            <p className="text-xs leading-relaxed">
                123 Harmony St, Greenview Plaza, New Delhi - 110001
            </p>
        </div>
        <div className="h-16 relative -mx-4 -mb-4">
             <img src="https://images.unsplash.com/photo-1617329249539-7cf8237365a1?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Shop interior detail"/>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <CategoryNav />
      <div className="flex-grow mt-4 grid grid-cols-10 grid-rows-6 gap-6">
        <ProductCard />
        <DealsCard />
        <TeamCard />
        <JoinNowCard />
        <ExclusiveCard />
        <ShopCard />
      </div>
    </div>
  );
};

export default Dashboard;