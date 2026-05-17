import React from 'react';
import { Cloud, Facebook, X, Instagram } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-textPrimary text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Cloud className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold tracking-tight">WAYA</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              La souveraineté numérique du Burkina Faso commence par vos données.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6">Produit</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#features" className="hover:text-primary transition-colors">Fonctionnalités</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Tarifs</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Légal</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-primary transition-colors">Confidentialité</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">CGU</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Mentions légales</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Suivez-nous</h4>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <X className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© 2026 WAYA — Fait avec ❤️ au Burkina Faso</p>
        </div>
      </div>
    </footer>
  );
};
