/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Gamepad2, 
  Maximize2, 
  Minimize2, 
  X, 
  TrendingUp, 
  Clock, 
  Star,
  ChevronRight,
  LayoutGrid,
  Info
} from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [recentGameIds, setRecentGameIds] = useState(() => {
    const saved = localStorage.getItem('recentGames');
    return saved ? JSON.parse(saved) : [];
  });

  const recentGames = useMemo(() => {
    return recentGameIds
      .map(id => gamesData.find(g => g.id === id))
      .filter((g) => !!g);
  }, [recentGameIds]);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setRecentGameIds(prev => {
      const filtered = prev.filter(id => id !== game.id);
      const updated = [game.id, ...filtered].slice(0, 4);
      localStorage.setItem('recentGames', JSON.stringify(updated));
      return updated;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setSelectedGame(null);
              setActiveCategory('All');
              setSearchQuery('');
            }}
          >
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
              <Gamepad2 className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Nova Games
            </h1>
          </div>

          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <section className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 md:p-12">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-medium mb-4">
                    <TrendingUp className="w-3 h-3" /> Trending Now
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    Level up your <br />
                    <span className="text-brand-400">gaming experience.</span>
                  </h2>
                  <p className="text-slate-400 text-lg mb-8">
                    Access hundreds of unblocked web games instantly. No downloads, no lag, just pure fun.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => handleSelectGame(gamesData[0])}
                      className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-brand-500/25 flex items-center gap-2"
                    >
                      Play Featured <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Recent Games */}
              {recentGames.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-400" /> Recently Played
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recentGames.map(game => (
                      <div 
                        key={`recent-${game.id}`}
                        onClick={() => handleSelectGame(game)}
                        className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer border border-slate-800 hover:border-brand-500/50 transition-all"
                      >
                        <img 
                          src={game.thumbnail} 
                          alt={game.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold uppercase tracking-widest">Play</span>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-slate-950 to-transparent">
                          <p className="text-xs font-bold truncate">{game.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat 
                        ? 'bg-white text-slate-950 shadow-lg' 
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Games Grid */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-brand-400" />
                    {activeCategory === 'All' ? 'All Games' : `${activeCategory} Games`}
                  </h3>
                  <span className="text-sm text-slate-500">{filteredGames.length} games found</span>
                </div>

                {filteredGames.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredGames.map((game, index) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -8 }}
                        className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-500/50 transition-all"
                        onClick={() => handleSelectGame(game)}
                      >
                        <div className="aspect-video relative overflow-hidden">
                          <img 
                            src={game.thumbnail} 
                            alt={game.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span className="text-white font-semibold flex items-center gap-1">
                              Play Now <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                          <div className="absolute top-3 right-3 px-2 py-1 bg-slate-950/60 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-brand-400 border border-white/10">
                            {game.category}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-lg mb-1 group-hover:text-brand-400 transition-colors">{game.title}</h4>
                          <p className="text-slate-500 text-sm line-clamp-2">{game.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
                    <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <h4 className="text-xl font-medium text-slate-400">No games found</h4>
                    <p className="text-slate-600">Try adjusting your search or category filter</p>
                  </div>
                )}
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex flex-col gap-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-slate-950 p-0' : ''}`}
            >
              <div className={`flex items-center justify-between ${isFullScreen ? 'p-4 bg-slate-900 border-b border-slate-800' : ''}`}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold">{selectedGame.title}</h2>
                    {!isFullScreen && <p className="text-sm text-slate-500">{selectedGame.category}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleFullScreen}
                    className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white flex items-center gap-2"
                  >
                    {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    <span className="hidden sm:inline text-sm font-medium">
                      {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </span>
                  </button>
                </div>
              </div>

              <div className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex-1 ${isFullScreen ? 'rounded-none border-none' : 'aspect-video'}`}>
                <iframe 
                  src={selectedGame.url} 
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allowFullScreen
                />
              </div>

              {!isFullScreen && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-brand-400" /> About this game
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {selectedGame.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" /> Stats
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">Rating</span>
                          <span className="font-mono text-brand-400">4.8/5.0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">Plays</span>
                          <span className="font-mono text-brand-400">12.4k</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">Last Updated</span>
                          <span className="font-mono text-brand-400">2 days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <Gamepad2 className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Nova Games</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-6">
              The ultimate destination for unblocked web games. Play your favorites anytime, anywhere, for free.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-brand-500 transition-colors cursor-pointer">
                <span className="text-xs font-bold">TW</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-brand-500 transition-colors cursor-pointer">
                <span className="text-xs font-bold">DC</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-brand-500 transition-colors cursor-pointer">
                <span className="text-xs font-bold">GH</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Categories</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Action</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Puzzle</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Strategy</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Arcade</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Contact Us</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Submit a Game</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-900 text-center text-slate-600 text-xs">
          © {new Date().getFullYear()} Nova Games. All rights reserved. Built for gamers.
        </div>
      </footer>
    </div>
  );
}
