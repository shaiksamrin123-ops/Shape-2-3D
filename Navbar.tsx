import React, { useState } from 'react';
import { PageId } from '../types';
import { Box, Layers, History, Info, Sparkles, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageId | 'how-it-works'; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Box className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore', icon: <Layers className="w-4 h-4" /> },
    { id: 'how-it-works', label: 'How It Works', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'about', label: 'About Us', icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: PageId | 'how-it-works') => {
    setMobileMenuOpen(false);
    if (id === 'how-it-works') {
      if (currentPage !== 'home') {
        onNavigate('home');
        setTimeout(() => {
          const el = document.getElementById('how-it-works-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById('how-it-works-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isCurrentActive = (id: string) => {
    if (id === 'explore' && ['explore', 'sketch', 'upload', 'text', 'result'].includes(currentPage)) {
      return true;
    }
    return currentPage === id;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Box className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight">
              SKETCH2SHAPE <span className="text-indigo-600">AI</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
              Student 3D Prototype Tool
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = isCurrentActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? 'text-indigo-600 bg-indigo-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Quick Launch CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('explore')}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>Start Creating</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const active = isCurrentActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 ${
                  active
                    ? 'text-indigo-600 bg-indigo-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('explore')}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
