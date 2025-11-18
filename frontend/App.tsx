import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="h-screen overflow-hidden font-sans" style={{backgroundColor: '#03110D'}}>
      <div className="backdrop-blur-xl border rounded-xl md:rounded-2xl lg:rounded-3xl h-full flex flex-col" style={{backgroundColor: 'rgba(57, 5, 23, 0.75)', borderColor: 'rgba(199, 160, 122, 0.15)', margin: '8px', height: 'calc(100vh - 16px)'}}>
        <Header />
        <main className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default App;