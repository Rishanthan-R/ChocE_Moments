import React from 'react';
// FIX: Imported the ShoppingBag icon.
import { FilterLines, Star, ArrowLeft, ArrowRight, ArrowUpRight, Tag, Heart, ShoppingBag } from './icons';

const ProductCard: React.FC = () => (
  <div className="sm:col-span-2 lg:col-span-4 lg:row-span-6 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative min-h-[300px] sm:min-h-[350px] lg:min-h-0" style={{backgroundColor: 'rgba(22, 48, 43, 0.6)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.2)'}}>
      <div className="flex justify-between items-start">
          <div className="backdrop-blur-md p-3 sm:p-4 rounded-xl text-center" style={{backgroundColor: 'rgba(57, 30, 16, 0.8)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)'}}>
              <div className="flex items-start" style={{color: '#FDFCE8'}}>
                  <span className="text-base sm:text-lg font-medium mt-1">$</span>
                  <span className="text-3xl sm:text-4xl font-semibold">45</span>
              </div>
              <p className="text-xs sm:text-sm mt-1" style={{color: '#E2CEB1'}}>Truffle Box</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full" style={{backgroundColor: 'rgba(57, 30, 16, 0.7)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
              <Star className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#C7A07A'}} fill="currentColor"/>
              <span className="font-semibold text-xs sm:text-sm" style={{color: '#FDFCE8'}}>4.9</span>
          </div>
      </div>
      <div>
        <div className="flex items-center justify-end gap-2 sm:gap-3 mb-3 sm:mb-4">
            <button className="backdrop-blur-md p-2 sm:p-2.5 md:p-3 rounded-full" style={{backgroundColor: 'rgba(164, 69, 41, 0.5)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(164, 69, 41, 0.6)'}}><Heart className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#A44529'}}/></button>
            <button className="backdrop-blur-md p-2 sm:p-2.5 md:p-3 rounded-full" style={{backgroundColor: 'rgba(57, 30, 16, 0.7)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)'}}><ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#C7A07A'}}/></button>
        </div>
        <div className="flex items-center justify-between backdrop-blur-md rounded-full p-1.5 sm:p-2" style={{backgroundColor: 'rgba(57, 30, 16, 0.7)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
            <button className="p-1.5 sm:p-2 rounded-full" style={{backgroundColor: 'rgba(22, 48, 43, 0.5)'}}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#E2CEB1'}}/></button>
            <span className="text-[10px] sm:text-xs font-medium tracking-wider" style={{color: '#E2CEB1'}}>SLIDE</span>
            <button className="p-1.5 sm:p-2 rounded-full" style={{backgroundColor: 'rgba(22, 48, 43, 0.5)'}}><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#E2CEB1'}}/></button>
        </div>
      </div>
  </div>
);

const DealsCard: React.FC = () => (
    <div className="sm:col-span-2 lg:col-span-4 lg:row-span-4 lg:col-start-5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative min-h-[250px] sm:min-h-[280px] lg:min-h-0" style={{backgroundColor: 'rgba(57, 5, 23, 0.6)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.2)'}}>
        <div>
            <h2 className="text-xl sm:text-2xl font-semibold" style={{color: '#FDFCE8'}}>Sweet Deals</h2>
            <p className="text-xs sm:text-sm mt-1" style={{color: '#E2CEB1'}}>Indulge with 40%-50% off</p>
        </div>
        <div className="self-start">
            <div className="flex items-center gap-1.5 sm:gap-2 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full" style={{backgroundColor: 'rgba(57, 30, 16, 0.7)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
                <Star className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#C7A07A'}} fill="currentColor"/>
                <span className="font-semibold text-xs sm:text-sm" style={{color: '#FDFCE8'}}>4.9</span>
            </div>
        </div>
    </div>
);

const TeamCard: React.FC = () => {
    const avatars = [1, 2, 3, 4, 5];
    return (
        <div className="lg:col-span-2 lg:row-span-2 lg:col-start-9 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-h-[180px] lg:min-h-0" style={{backgroundColor: 'rgba(115, 65, 40, 0.5)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.25)'}}>
            <div className="flex justify-between items-center">
                <div className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs" style={{borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)', color: '#E2CEB1'}}>OUR TEAM</div>
                <button className="backdrop-blur-md p-1.5 sm:p-2 rounded-full" style={{backgroundColor: 'rgba(57, 30, 16, 0.6)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}><ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" style={{color: '#C7A07A'}}/></button>
            </div>
            <div>
                <p className="text-[10px] sm:text-xs my-1.5 sm:my-2" style={{color: '#E2CEB1'}}>Our chocolatiers craft artisan chocolate experiences</p>
                <div className="flex -space-x-2">
                    {avatars.map(a => <div key={a} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center text-[10px] sm:text-xs font-semibold" style={{borderColor: '#16302B', backgroundColor: 'rgba(199, 160, 122, 0.3)', color: '#FDFCE8'}}>{a}</div>)}
                </div>
            </div>
        </div>
    );
};

const JoinNowCard: React.FC = () => (
    <div className="lg:col-span-2 lg:row-span-2 lg:col-start-9 lg:row-start-3 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-h-[180px] lg:min-h-0" style={{backgroundColor: 'rgba(57, 5, 23, 0.5)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.25)'}}>
        <div className="flex justify-between items-center">
            <div className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs" style={{borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)', color: '#E2CEB1'}}>JOIN NOW</div>
            <button className="backdrop-blur-md p-1.5 sm:p-2 rounded-full" style={{backgroundColor: 'rgba(57, 30, 16, 0.6)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}><ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" style={{color: '#C7A07A'}}/></button>
        </div>
        <div>
            <label htmlFor="email" className="text-[10px] sm:text-xs" style={{color: '#E2CEB1'}}>Email</label>
            <input type="email" id="email" className="w-full bg-transparent py-1.5 sm:py-2 mt-1 outline-none text-xs sm:text-sm" style={{borderBottom: '1px solid rgba(199, 160, 122, 0.4)', color: '#FDFCE8'}}/>
            <button className="w-full mt-2 sm:mt-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold" style={{backgroundColor: 'rgba(115, 65, 40, 0.8)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)', color: '#FDFCE8'}}>Subscribe</button>
        </div>
    </div>
);

const ExclusiveCard: React.FC = () => (
    <div className="sm:col-span-2 lg:col-span-4 lg:row-span-2 lg:col-start-5 lg:row-start-5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between min-h-[150px] lg:min-h-0" style={{backgroundColor: 'rgba(22, 48, 43, 0.6)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.25)'}}>
        <div className="w-full">
            <div className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs inline-block mb-1.5 sm:mb-2" style={{borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)', color: '#C7A07A'}}>EXCLUSIVE</div>
            <h3 className="text-base sm:text-lg font-semibold" style={{color: '#FDFCE8'}}>Luxury Chocolate Collection</h3>
            <p className="text-[10px] sm:text-xs mt-1" style={{color: '#E2CEB1'}}>Experience handcrafted chocolates with premium ingredients from around the world.</p>
        </div>
    </div>
);

const ShopCard: React.FC = () => (
    <div className="lg:col-span-2 lg:row-span-2 lg:col-start-9 lg:row-start-5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-h-[150px] lg:min-h-0" style={{backgroundColor: 'rgba(163, 133, 96, 0.3)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
        <div className="flex justify-between items-center">
            <div className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs" style={{borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.5)', color: '#16302B'}}>OUR SHOP</div>
            <button className="backdrop-blur-md p-1.5 sm:p-2 rounded-full" style={{backgroundColor: 'rgba(115, 65, 40, 0.6)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)'}}><ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" style={{color: '#FDFCE8'}}/></button>
        </div>
        <div>
            <p className="text-[10px] sm:text-xs leading-relaxed" style={{color: '#16302B'}}>
                456 Sweet Avenue, Cocoa District, New York - 10001
            </p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-3 sm:gap-3.5 md:gap-4 auto-rows-fr">
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