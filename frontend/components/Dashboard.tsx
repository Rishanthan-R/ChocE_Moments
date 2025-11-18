import React from 'react';
// FIX: Imported the ShoppingBag icon.
import { FilterLines, Star, ArrowLeft, ArrowRight, ArrowUpRight, Tag, Heart, ShoppingBag } from './icons';

interface DashboardProps {
  searchQuery: string;
  selectedCategory: string;
  favorites: string[];
  toggleFavorite: (item: string) => void;
  cart: string[];
  toggleCart: (item: string) => void;
}

interface ProductCardProps {
  isFavorite: boolean;
  isInCart: boolean;
  onToggleFavorite: () => void;
  onToggleCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ isFavorite, isInCart, onToggleFavorite, onToggleCart }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slides = [
    { id: 1, image: '/Media/1.png', name: 'Dark Truffle', price: 45 },
    { id: 2, image: '/Media/2.png', name: 'Milk Chocolate', price: 38 },
    { id: 3, image: '/Media/3.png', name: 'White Delight', price: 42 }
  ];
  const totalSlides = slides.length;

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <div className="sm:col-span-2 lg:col-span-4 lg:row-span-6 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden relative min-h-[300px] sm:min-h-[350px] lg:min-h-0" style={{backgroundColor: 'rgba(22, 48, 43, 0.6)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.2)'}}>
      <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-5 flex justify-between items-start z-10">
          <div className="backdrop-blur-md p-3 sm:p-4 rounded-xl text-center" style={{backgroundColor: 'rgba(57, 30, 16, 0.8)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)'}}>
              <div className="flex items-start" style={{color: '#FDFCE8'}}>
                  <span className="text-base sm:text-lg font-medium mt-1">$</span>
                  <span className="text-3xl sm:text-4xl font-semibold">{slides[currentSlide].price}</span>
              </div>
              <p className="text-xs sm:text-sm mt-1" style={{color: '#E2CEB1'}}>{slides[currentSlide].name}</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full" style={{backgroundColor: 'rgba(57, 30, 16, 0.7)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
              <Star className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#C7A07A'}} fill="currentColor"/>
              <span className="font-semibold text-xs sm:text-sm" style={{color: '#FDFCE8'}}>4.9</span>
          </div>
      </div>
      <div className="absolute inset-0">
        <img 
          src={slides[currentSlide].image} 
          alt={slides[currentSlide].name}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>
      <div className="absolute bottom-16 left-0 right-0 text-center z-10 sm:bottom-20">
        <div className="text-xs sm:text-sm font-medium backdrop-blur-sm inline-block px-3 py-1 rounded-full" style={{color: '#E2CEB1', backgroundColor: 'rgba(57, 30, 16, 0.7)'}}>
          Slide {currentSlide + 1} of {totalSlides}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 z-10">
        <div className="flex items-center justify-end gap-2 sm:gap-3 mb-3 sm:mb-4">
            <button 
              onClick={onToggleFavorite}
              className="backdrop-blur-md p-2 sm:p-2.5 md:p-3 rounded-full transition-all hover:scale-110" 
              style={{
                backgroundColor: isFavorite ? 'rgba(164, 69, 41, 0.8)' : 'rgba(164, 69, 41, 0.5)', 
                borderWidth: '1px', 
                borderStyle: 'solid', 
                borderColor: 'rgba(164, 69, 41, 0.6)'
              }}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#A44529'}} fill={isFavorite ? "currentColor" : "none"}/>
            </button>
            <button 
              onClick={onToggleCart}
              className="backdrop-blur-md p-2 sm:p-2.5 md:p-3 rounded-full transition-all hover:scale-110" 
              style={{
                backgroundColor: isInCart ? 'rgba(57, 30, 16, 0.9)' : 'rgba(57, 30, 16, 0.7)', 
                borderWidth: '1px', 
                borderStyle: 'solid', 
                borderColor: 'rgba(199, 160, 122, 0.4)'
              }}
              title={isInCart ? "Remove from cart" : "Add to cart"}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" style={{color: isInCart ? '#FDFCE8' : '#C7A07A'}}/>
            </button>
        </div>
        <div className="flex items-center justify-between backdrop-blur-md rounded-full p-1.5 sm:p-2" style={{backgroundColor: 'rgba(57, 30, 16, 0.7)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
            <button 
              onClick={handlePrevSlide}
              className="p-1.5 sm:p-2 rounded-full transition-all hover:scale-110" 
              style={{backgroundColor: 'rgba(22, 48, 43, 0.5)'}}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#E2CEB1'}}/>
            </button>
            <span className="text-[10px] sm:text-xs font-medium tracking-wider" style={{color: '#E2CEB1'}}>SLIDE</span>
            <button 
              onClick={handleNextSlide}
              className="p-1.5 sm:p-2 rounded-full transition-all hover:scale-110" 
              style={{backgroundColor: 'rgba(22, 48, 43, 0.5)'}}
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#E2CEB1'}}/>
            </button>
        </div>
      </div>
  </div>
);
};

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

const JoinNowCard: React.FC = () => {
    const [email, setEmail] = React.useState("");
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && email.includes('@')) {
            setIsSubmitted(true);
            setTimeout(() => {
                setEmail("");
                setIsSubmitted(false);
            }, 3000);
        }
    };

    return (
        <div className="lg:col-span-2 lg:row-span-2 lg:col-start-9 lg:row-start-3 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-h-[180px] lg:min-h-0" style={{backgroundColor: 'rgba(57, 5, 23, 0.5)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.25)'}}>
            <div className="flex justify-between items-center">
                <div className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs" style={{borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)', color: '#E2CEB1'}}>JOIN NOW</div>
                <button className="backdrop-blur-md p-1.5 sm:p-2 rounded-full" style={{backgroundColor: 'rgba(57, 30, 16, 0.6)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}><ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" style={{color: '#C7A07A'}}/></button>
            </div>
            {isSubmitted ? (
                <div className="text-center">
                    <p className="text-xs sm:text-sm font-semibold" style={{color: '#C7A07A'}}>✓ Successfully subscribed!</p>
                </div>
            ) : (
                <form onSubmit={handleSubscribe}>
                    <label htmlFor="email" className="text-[10px] sm:text-xs" style={{color: '#E2CEB1'}}>Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full bg-transparent py-1.5 sm:py-2 mt-1 outline-none text-xs sm:text-sm placeholder:text-[10px] sm:placeholder:text-xs" 
                        style={{borderBottom: '1px solid rgba(199, 160, 122, 0.4)', color: '#FDFCE8', caretColor: '#C7A07A'}}
                    />
                    <button 
                        type="submit"
                        className="w-full mt-2 sm:mt-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-105" 
                        style={{backgroundColor: 'rgba(115, 65, 40, 0.8)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)', color: '#FDFCE8'}}
                    >
                        Subscribe
                    </button>
                </form>
            )}
        </div>
    );
};

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
    <div className="lg:col-span-2 lg:row-span-2 lg:col-start-9 lg:row-start-5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-h-[150px] lg:min-h-0" style={{backgroundColor: 'rgba(57, 30, 16, 0.8)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)'}}>
        <div className="flex justify-between items-center">
            <div className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold" style={{borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.6)', color: '#FDFCE8'}}>CONTACT US</div>
        </div>
        <div className="space-y-1.5 sm:space-y-2">
            <a href="tel:0706878899" className="flex items-center gap-1.5 text-[10px] sm:text-xs hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20" style={{color: '#C7A07A'}}>
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span className="font-medium">0706878899</span>
            </a>
            <a href="mailto:chocemoments@gmail.com" className="flex items-center gap-1.5 text-[10px] sm:text-xs hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20" style={{color: '#C7A07A'}}>
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <span className="font-medium truncate">chocemoments@gmail.com</span>
            </a>
            <div className="flex items-center gap-2 pt-1">
                <a href="https://www.instagram.com/chocemoments?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="backdrop-blur-sm p-1.5 rounded-full hover:scale-110 transition-all" style={{backgroundColor: 'rgba(199, 160, 122, 0.3)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.6)', color: '#C7A07A'}} title="Instagram">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61582694976286" target="_blank" rel="noopener noreferrer" className="backdrop-blur-sm p-1.5 rounded-full hover:scale-110 transition-all" style={{backgroundColor: 'rgba(199, 160, 122, 0.3)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.6)', color: '#C7A07A'}} title="Facebook">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                </a>
                <a href="https://wa.me/94706878899" target="_blank" rel="noopener noreferrer" className="backdrop-blur-sm p-1.5 rounded-full hover:scale-110 transition-all" style={{backgroundColor: 'rgba(199, 160, 122, 0.3)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.6)', color: '#C7A07A'}} title="WhatsApp">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ 
  searchQuery, 
  selectedCategory, 
  favorites, 
  toggleFavorite, 
  cart, 
  toggleCart 
}) => {
  const productId = "truffle-box-1";
  const isFavorite = favorites.includes(productId);
  const isInCart = cart.includes(productId);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-3 sm:gap-3.5 md:gap-4 auto-rows-fr">
        <ProductCard 
          isFavorite={isFavorite}
          isInCart={isInCart}
          onToggleFavorite={() => toggleFavorite(productId)}
          onToggleCart={() => toggleCart(productId)}
        />
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