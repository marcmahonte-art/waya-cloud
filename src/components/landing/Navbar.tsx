'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Cloud, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Cloud className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-textPrimary tracking-tight">WAYA</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-textSecondary hover:text-primary transition-colors">Fonctionnalités</Link>
            <Link href="#pricing" className="text-textSecondary hover:text-primary transition-colors">Tarifs</Link>
            <Link href="#about" className="text-textSecondary hover:text-primary transition-colors">À propos</Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-textSecondary hover:text-primary transition-colors font-semibold text-sm">
              Se connecter
            </Link>
            <Link href="/register">
              <Button variant="primary">Commencer</Button>
            </Link>
          </div>

          {/* Hamburger Menu Icon */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-textPrimary hover:bg-gray-150 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg animate-slide-down">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <Link 
              href="#features" 
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-textSecondary hover:text-primary hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link 
              href="#pricing" 
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-textSecondary hover:text-primary hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors"
            >
              Tarifs
            </Link>
            <Link 
              href="#about" 
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-textSecondary hover:text-primary hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors"
            >
              À propos
            </Link>
            
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="block text-center text-base font-bold text-textPrimary hover:text-primary py-2 rounded-xl transition-colors"
              >
                Se connecter
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button variant="primary" className="w-full py-3">
                  Commencer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
