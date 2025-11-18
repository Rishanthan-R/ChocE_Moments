import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ClickSpark from './components/ClickSpark';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("Truffles");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [cart, setCart] = React.useState<string[]>([]);

  const toggleFavorite = (item: string) => {
    setFavorites(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleCart = (item: string) => {
    setCart(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <>
      <ClickSpark color="#C7A07A" particleCount={10} sparkSize={6} minSpeed={60} maxSpeed={180} />
      <div className="h-screen overflow-hidden font-sans" style={{backgroundColor: '#03110D'}}>
        <div className="backdrop-blur-xl border rounded-xl md:rounded-2xl lg:rounded-3xl h-full flex flex-col" style={{backgroundColor: 'rgba(57, 5, 23, 0.75)', borderColor: 'rgba(199, 160, 122, 0.15)', margin: '8px', height: 'calc(100vh - 16px)'}}>
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          favoritesCount={favorites.length}
          cartCount={cart.length}
        />
        <main className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
          <Dashboard 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            cart={cart}
            toggleCart={toggleCart}
          />
        </main>
      </div>
      </div>
    </>
  );
};

export default App;