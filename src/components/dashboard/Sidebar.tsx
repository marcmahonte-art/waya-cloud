'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Cloud, 
  Image as ImageIcon, 
  FileText, 
  ShieldCheck, 
  Smartphone, 
  Users, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  X,
  SmartphoneIcon
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useDashboard } from '@/context/DashboardContext';
import { useUser } from '@/context/UserContext';

const navItems = [
  { icon: Cloud, label: 'Mon Cloud' },
  { icon: Smartphone, label: 'Photos WhatsApp' },
  { icon: FileText, label: 'Documents' },
  { icon: ShieldCheck, label: 'CNIB & Officiel', badge: 'BF' },
  { icon: TrendingUp, label: 'Reçus Mobile Money' },
  { icon: Users, label: 'Partagés' },
  { icon: Trash2, label: 'Corbeille' },
];

export const Sidebar = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    storageUsed, 
    maxStorage, 
    showUpgradeModal, 
    setShowUpgradeModal,
    upgradeStorage,
    isUpgraded
  } = useDashboard();

  const { user } = useUser();
  const isAdmin = user?.phone?.replace(/\s+/g, '') === '+22677777777' || user?.email === 'dg@waya.bf';

  // Orange Money Payment Simulation State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStep, setPaymentStep] = useState<'init' | 'pending' | 'success'>('init');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setPaymentStep('pending');
    
    // Simulate USSD push confirmation
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        upgradeStorage();
        setPaymentStep('init');
        setPhoneNumber('');
      }, 1500);
    }, 2000);
  };

  const percentage = Math.min(100, (storageUsed / maxStorage) * 100);

  return (
    <>
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 overflow-y-auto hidden md:flex">
        <div className="p-6 flex items-center gap-2">
          <Cloud className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-textPrimary tracking-tight">WAYA</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = selectedCategory === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setSelectedCategory(item.label)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group ${
                  isActive 
                    ? 'bg-primaryLight text-primary font-semibold' 
                    : 'text-textSecondary hover:bg-gray-50 hover:text-textPrimary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                  <span className="text-left">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Access Portal */}
        {isAdmin && (
          <div className="px-4 py-2 mt-2 border-t border-gray-100 animate-fade-in">
            <Link
              href="/admin"
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-gray-500 hover:text-primary hover:bg-primaryLight/40 transition-all border border-dashed border-gray-200 hover:border-primary/30"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0"></span>
                <span>Console Super Admin</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <div className="p-4 mt-auto">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-textSecondary">Stockage</span>
              <span className="text-xs font-bold text-textPrimary">{storageUsed} Go / {maxStorage} Go</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${percentage}%` }}></div>
            </div>
            {!isUpgraded ? (
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full text-xs py-2"
                onClick={() => setShowUpgradeModal(true)}
              >
                Passer à 20 Go — 1 500 F
              </Button>
            ) : (
              <div className="text-xs text-center text-primary font-semibold bg-primaryLight py-2 rounded-lg border border-primary/10">
                Abonnement Actif 🚀
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Upgrade Modal with simulated Orange Money payment */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-textPrimary rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <h3 className="text-xl font-bold text-textPrimary mb-2">Augmenter mon stockage</h3>
              <p className="text-sm text-textSecondary mb-6">
                Passez au forfait <span className="font-semibold text-primary">Sauve WhatsApp (20 Go)</span> pour seulement <span className="font-semibold text-primary">1 500 F CFA / an</span>.
              </p>

              {paymentStep === 'init' && (
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">
                      Numéro Orange Money
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-sm font-semibold text-gray-400">+226</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="76 XX XX XX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                        className="block w-full pl-14 pr-3 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="bg-[#FF6600]/10 border border-[#FF6600]/20 rounded-xl p-4 flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-[#FF6600] text-white flex items-center justify-center font-bold text-lg">
                      OM
                    </div>
                    <div className="text-xs text-textSecondary">
                      Un push de paiement sera envoyé sur votre téléphone. Composez le <span className="font-bold text-[#FF6600]">*144*4*6#</span> pour valider.
                    </div>
                  </div>

                  <Button type="submit" className="w-full py-3 mt-2 bg-[#FF6600] hover:bg-[#E05900] text-white shadow-lg shadow-[#FF6600]/20">
                    Payer 1 500 F CFA
                  </Button>
                </form>
              )}

              {paymentStep === 'pending' && (
                <div className="py-10 text-center space-y-4 flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-[#FF6600]/20 border-t-[#FF6600] rounded-full animate-spin"></div>
                  <h4 className="font-bold text-textPrimary text-lg">Attente de validation...</h4>
                  <p className="text-sm text-textSecondary max-w-xs mx-auto">
                    Nous avons envoyé une notification sur le numéro <span className="font-semibold text-textPrimary">+226 {phoneNumber}</span>. Veuillez confirmer la transaction sur votre mobile.
                  </p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="py-10 text-center space-y-4 flex flex-col items-center">
                  <div className="w-16 h-16 bg-primaryLight text-primary rounded-full flex items-center justify-center">
                    <Cloud className="w-8 h-8 animate-bounce" />
                  </div>
                  <h4 className="font-bold text-primary text-xl">Paiement Réussi !</h4>
                  <p className="text-sm text-textSecondary">
                    Votre espace de stockage a été mis à niveau vers <span className="font-bold text-textPrimary">20 Go</span>. Merci pour votre confiance !
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
