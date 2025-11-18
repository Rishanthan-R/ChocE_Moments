import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-cover bg-center text-neutral-200 font-sans p-0 rounded-3xl overflow-hidden" style={{backgroundImage: "url('https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=2787&auto=format&fit=crop')"}}>
      <div className="bg-black/20 backdrop-blur-xl border border-white/5 p-4 lg:p-6 min-h-screen">
        <Header />
        <main className="mt-6 h-[calc(100%-70px)]">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default App;