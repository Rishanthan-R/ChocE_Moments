import React from 'react';
import { Star, ArrowUpRight, Heart, ShoppingBag } from './icons';
import SplitText from './SplitText';
import Balatro from './Balatro';

interface DashboardProps {
  searchQuery: string;
  selectedCategory: string;
  favorites: string[];
  toggleFavorite: (item: string) => void;
  cart: string[];
  toggleCart: (item: string) => void;
}

// ===== 1. HERO SECTION =====
const HeroSection: React.FC = () => (
  <section className="relative rounded-2xl overflow-hidden mb-6" style={{minHeight: '500px', backgroundColor: 'rgba(22, 48, 43, 0.4)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
    <Balatro
      isRotate={false}
      mouseInteraction={true}
      pixelFilter={700}
    />
    <div className="absolute inset-0 backdrop-blur-sm" style={{background: 'linear-gradient(135deg, rgba(57, 30, 16, 0.7) 0%, rgba(22, 48, 43, 0.7) 100%)', zIndex: 1}}>
    </div>
    <div className="relative flex flex-col items-center justify-center h-full text-center px-8 py-20" style={{zIndex: 2}}>
      <div className="inline-block px-4 py-2 rounded-full mb-6" style={{backgroundColor: 'rgba(199, 160, 122, 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)'}}>
        <span className="text-sm font-semibold tracking-wider" style={{color: '#C7A07A'}}>PREMIUM ARTISAN CHOCOLATES</span>
      </div>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{color: '#FDFCE8', fontFamily: 'Georgia, serif', textShadow: '0 2px 10px rgba(0,0,0,0.3)'}}>
        <SplitText 
          text="Luxury Chocolate Collection"
          delay={300}
          charDelay={0.05}
        />
      </h1>
      <p className="text-lg md:text-xl mb-10 max-w-2xl" style={{color: '#E2CEB1'}}>
        Experience handcrafted chocolates with premium ingredients from around the world
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button className="px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105 shadow-lg" style={{backgroundColor: '#C7A07A', color: '#16302B', borderWidth: '2px', borderStyle: 'solid', borderColor: '#C7A07A'}}>
          Shop the Collection
        </button>
        <button className="px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105" style={{backgroundColor: 'rgba(199, 160, 122, 0.2)', color: '#FDFCE8', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.6)'}}>
          Discover Luxury
        </button>
      </div>
      <div className="flex items-center gap-8 mt-12">
        <div className="text-center">
          <div className="text-3xl font-bold" style={{color: '#C7A07A'}}>500+</div>
          <div className="text-sm" style={{color: '#E2CEB1'}}>Artisan Products</div>
        </div>
        <div className="w-px h-12" style={{backgroundColor: 'rgba(199, 160, 122, 0.3)'}}></div>
        <div className="text-center">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6" style={{color: '#C7A07A'}} fill="currentColor"/>
            <span className="text-3xl font-bold" style={{color: '#C7A07A'}}>4.9</span>
          </div>
          <div className="text-sm" style={{color: '#E2CEB1'}}>Customer Rating</div>
        </div>
        <div className="w-px h-12" style={{backgroundColor: 'rgba(199, 160, 122, 0.3)'}}></div>
        <div className="text-center">
          <div className="text-3xl font-bold" style={{color: '#C7A07A'}}>10K+</div>
          <div className="text-sm" style={{color: '#E2CEB1'}}>Happy Customers</div>
        </div>
      </div>
    </div>
  </section>
);

// ===== 2. PROMOTIONAL BANNER SECTION =====
/*const PromoBanner: React.FC = () => (
  <section className="rounded-2xl overflow-hidden mb-6 backdrop-blur-sm" style={{backgroundColor: 'rgba(164, 69, 41, 0.3)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
    <div className="px-8 py-12 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Star className="w-8 h-8" style={{color: '#C7A07A'}} fill="currentColor"/>
        <h2 className="text-3xl md:text-4xl font-bold" style={{color: '#FDFCE8', fontFamily: 'Georgia, serif'}}>Sweet Deals</h2>
        <Star className="w-8 h-8" style={{color: '#C7A07A'}} fill="currentColor"/>
      </div>
      <p className="text-xl mb-6" style={{color: '#E2CEB1'}}>Indulge with 40% - 50% Off Premium Selection</p>
      <button className="px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg" style={{backgroundColor: '#C7A07A', color: '#16302B'}}>
        Shop the Sale
      </button>
    </div>
  </section>
);*/

// ===== 3. FEATURED PRODUCTS SECTION =====
interface ProductCardProps {
  isFavorite: boolean;
  isInCart: boolean;
  onToggleFavorite: () => void;
  onToggleCart: () => void;
  name: string;
  price: number;
  description: string;
  rating: number;
  image: string;
}

const FeaturedProductCard: React.FC<ProductCardProps> = ({ isFavorite, isInCart, onToggleFavorite, onToggleCart, name, price, description, rating, image }) => (
  <div className="rounded-xl overflow-hidden backdrop-blur-sm transition-all hover:scale-105" style={{backgroundColor: 'rgba(57, 30, 16, 0.5)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
    <div className="relative h-64" style={{backgroundColor: 'rgba(22, 48, 43, 0.5)'}}>
      <img src={image} alt={name} className="w-full h-full object-cover" />
      <div className="absolute top-3 right-3 flex gap-2">
        <button 
          onClick={onToggleFavorite}
          className="backdrop-blur-md p-2.5 rounded-full transition-all hover:scale-110 shadow-lg" 
          style={{
            backgroundColor: isFavorite ? 'rgba(164, 69, 41, 0.9)' : 'rgba(57, 30, 16, 0.8)', 
            borderWidth: '1px', 
            borderStyle: 'solid', 
            borderColor: 'rgba(199, 160, 122, 0.4)'
          }}
        >
          <Heart className="w-5 h-5" style={{color: isFavorite ? '#FDFCE8' : '#C7A07A'}} fill={isFavorite ? "currentColor" : "none"}/>
        </button>
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold" style={{color: '#FDFCE8', fontFamily: 'Georgia, serif'}}>{name}</h3>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" style={{color: '#C7A07A'}} fill="currentColor"/>
          <span className="text-sm font-semibold" style={{color: '#C7A07A'}}>{rating}</span>
        </div>
      </div>
      <p className="text-sm mb-4" style={{color: '#E2CEB1'}}>{description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-sm" style={{color: '#C7A07A'}}>$</span>
          <span className="text-3xl font-bold" style={{color: '#FDFCE8'}}>{price}</span>
        </div>
        <button 
          onClick={onToggleCart}
          className="px-6 py-2.5 rounded-full font-semibold transition-all hover:scale-105 flex items-center gap-2 shadow-lg"
          style={{
            backgroundColor: isInCart ? 'rgba(115, 65, 40, 0.9)' : '#C7A07A',
            color: isInCart ? '#FDFCE8' : '#16302B',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgba(199, 160, 122, 0.5)'
          }}
        >
          <ShoppingBag className="w-4 h-4"/>
          <span>{isInCart ? 'In Cart' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  </div>
);

const FeaturedProducts: React.FC<{favorites: string[], cart: string[], toggleFavorite: (id: string) => void, toggleCart: (id: string) => void}> = ({ favorites, cart, toggleFavorite, toggleCart }) => {
  const products = [
    { id: 'luxury-truffle-box', name: 'Luxury Truffle Box', price: 65, description: 'Assorted Premium Truffles Collection', rating: 4.9, image: '../Media/11.png' },
    { id: 'dark-elegance', name: 'Dark Elegance', price: 52, description: 'Belgian Dark Chocolate Selection', rating: 4.8, image: '../Media/12.png' },
    { id: 'golden-praline', name: 'Golden Praline', price: 58, description: 'Handcrafted Praline Assortment', rating: 4.9, image: '../Media/13.png' },
    { id: 'artisan-collection', name: 'Artisan Collection', price: 72, description: 'Exclusive Chocolate Gift Set', rating: 5.0, image: '../Media/14.png' }
  ];

  return (
    <section className="mb-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-3" style={{color: '#FDFCE8', fontFamily: 'Georgia, serif'}}>Featured Collection</h2>
        <p className="text-lg" style={{color: '#E2CEB1'}}>Handpicked selection of our finest artisan chocolates</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <FeaturedProductCard 
            key={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            rating={product.rating}
            image={product.image}
            isFavorite={favorites.includes(product.id)}
            isInCart={cart.includes(product.id)}
            onToggleFavorite={() => toggleFavorite(product.id)}
            onToggleCart={() => toggleCart(product.id)}
          />
        ))}
      </div>
    </section>
  );
};

// ===== 4. BRAND STORY SECTION =====
const BrandStory: React.FC = () => (
  <section className="rounded-2xl overflow-hidden mb-6 backdrop-blur-sm" style={{backgroundColor: 'rgba(115, 65, 40, 0.4)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
    <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
      <div className="flex flex-col justify-center">
        <div className="inline-block px-4 py-2 rounded-full mb-4 self-start" style={{backgroundColor: 'rgba(199, 160, 122, 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)'}}>
          <span className="text-sm font-semibold tracking-wider" style={{color: '#C7A07A'}}>THE ARTISAN'S TOUCH</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#FDFCE8', fontFamily: 'Georgia, serif'}}>
          Crafted with Passion & Precision
        </h2>
        <p className="text-base mb-4" style={{color: '#E2CEB1', lineHeight: '1.8'}}>
          Our master chocolatiers craft each artisan chocolate experience with dedication and expertise. Using only the finest premium ingredients sourced from around the world, we create confections that delight the senses and elevate every moment.
        </p>
        <p className="text-base mb-6" style={{color: '#E2CEB1', lineHeight: '1.8'}}>
          From single-origin cocoa beans to hand-selected toppings, every element is carefully chosen to ensure an unforgettable taste experience that embodies luxury and craftsmanship.
        </p>
        <button className="px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 self-start shadow-lg flex items-center gap-2" style={{backgroundColor: 'rgba(199, 160, 122, 0.3)', color: '#FDFCE8', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.6)'}}>
          <span>Our Story</span>
          <ArrowUpRight className="w-5 h-5"/>
        </button>
      </div>
      <div className="relative rounded-xl overflow-hidden" style={{minHeight: '300px', backgroundColor: 'rgba(22, 48, 43, 0.5)'}}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">ðŸ«</div>
          <p className="text-sm" style={{color: '#E2CEB1'}}>Artisan Chocolatier at Work</p>
          <p className="text-xs mt-2" style={{color: '#C7A07A'}}>(High-quality image placeholder)</p>
        </div>
      </div>
    </div>
  </section>
);

// ===== 5. EMAIL NEWSLETTER SECTION =====
const NewsletterSection: React.FC = () => {
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
    <section className="rounded-2xl overflow-hidden mb-6 backdrop-blur-sm" style={{backgroundColor: 'rgba(57, 5, 23, 0.5)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
      <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
        <div>
          <div className="inline-block px-4 py-2 rounded-full mb-4" style={{backgroundColor: 'rgba(199, 160, 122, 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)'}}>
            <span className="text-sm font-semibold tracking-wider" style={{color: '#C7A07A'}}>JOIN OUR COMMUNITY</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#FDFCE8', fontFamily: 'Georgia, serif'}}>
            Exclusive Offers & Early Access
          </h2>
          <p className="text-base mb-2" style={{color: '#E2CEB1'}}>
            Be the first to know about new collections and receive <span style={{color: '#C7A07A', fontWeight: 'bold'}}>15% off</span> your first order.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#C7A07A'}}></div>
              <span className="text-sm" style={{color: '#E2CEB1'}}>Early access to limited editions</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#C7A07A'}}></div>
              <span className="text-sm" style={{color: '#E2CEB1'}}>Exclusive member-only deals</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#C7A07A'}}></div>
              <span className="text-sm" style={{color: '#E2CEB1'}}>Seasonal collection previews</span>
            </li>
          </ul>
        </div>
        <div className="backdrop-blur-md rounded-xl p-6" style={{backgroundColor: 'rgba(57, 30, 16, 0.6)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)'}}>
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">âœ“</div>
              <p className="text-xl font-semibold mb-2" style={{color: '#C7A07A'}}>Successfully Subscribed!</p>
              <p className="text-sm" style={{color: '#E2CEB1'}}>Check your email for your welcome offer</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe}>
              <label htmlFor="newsletter-email" className="block text-sm font-semibold mb-2" style={{color: '#FDFCE8'}}>Email Address</label>
              <input 
                type="email" 
                id="newsletter-email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg mb-4 outline-none text-sm" 
                style={{backgroundColor: 'rgba(22, 48, 43, 0.5)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.3)', color: '#FDFCE8'}}
              />
              <button 
                type="submit"
                className="w-full py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg" 
                style={{backgroundColor: '#C7A07A', color: '#16302B'}}
              >
                Subscribe Now
              </button>
              <p className="text-xs text-center mt-3" style={{color: '#E2CEB1'}}>We respect your privacy. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// ===== 6. FOOTER SECTION =====
const Footer: React.FC = () => (
  <footer className="rounded-2xl overflow-hidden backdrop-blur-sm mt-8" style={{backgroundColor: 'rgba(57, 30, 16, 0.9)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)'}}>
    <div className="p-8 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src="../Media/OW-Logo.png" alt="ChocE Moments" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl" style={{color: '#FDFCE8', fontFamily: 'Georgia, serif'}}>ChocE Moments</span>
          </div>
          <p className="text-sm mb-4" style={{color: '#E2CEB1'}}>Luxury artisan chocolates crafted with passion and premium ingredients.</p>
          <div className="space-y-2">
            <a href="tel:0706878899" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#C7A07A'}}>
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              <span>0706878899</span>
            </a>
            <a href="mailto:chocemoments@gmail.com" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#C7A07A'}}>
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <span>chocemoments@gmail.com</span>
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4" style={{color: '#FDFCE8'}}>Shop</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>All Chocolates</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Gift Boxes</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Seasonal Collections</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Corporate Gifts</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Best Sellers</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4" style={{color: '#FDFCE8'}}>Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Shipping Info</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Returns & Exchanges</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>FAQ</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Contact Us</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Track Order</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4" style={{color: '#FDFCE8'}}>About</h3>
          <ul className="space-y-2 mb-4">
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Our Story</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Blog</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Sustainability</a></li>
            <li><a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Careers</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/chocemoments?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:scale-110 transition-all" style={{backgroundColor: 'rgba(199, 160, 122, 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)', color: '#C7A07A'}} title="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61582694976286" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:scale-110 transition-all" style={{backgroundColor: 'rgba(199, 160, 122, 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)', color: '#C7A07A'}} title="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://wa.me/94706878899" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:scale-110 transition-all" style={{backgroundColor: 'rgba(199, 160, 122, 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(199, 160, 122, 0.4)', color: '#C7A07A'}} title="WhatsApp">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="pt-6" style={{borderTop: '1px solid rgba(199, 160, 122, 0.2)'}}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm" style={{color: '#E2CEB1'}}>Â© 2025 ChocE Moments. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Privacy Policy</a>
            <a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Terms of Service</a>
            <a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{color: '#E2CEB1'}}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// ===== MAIN DASHBOARD COMPONENT =====
const Dashboard: React.FC<DashboardProps> = ({ 
  searchQuery, 
  selectedCategory, 
  favorites, 
  toggleFavorite, 
  cart, 
  toggleCart 
}) => {
  return (
    <div className="flex flex-col px-4 py-6">
      <HeroSection />
      <FeaturedProducts favorites={favorites} cart={cart} toggleFavorite={toggleFavorite} toggleCart={toggleCart} />
      <BrandStory />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Dashboard;
