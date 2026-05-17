'use client';

import React, { useState } from 'react';
import { Download, Share2, Info, FileText, ImageIcon, Film, ShieldCheck, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDashboard } from '@/context/DashboardContext';

export const PreviewPanel = () => {
  const { 
    activeFile, 
    files, 
    storageUsed, 
    maxStorage, 
    showMobilePreview, 
    setShowMobilePreview 
  } = useDashboard();
  
  // Simulated Toast/Notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleDownload = () => {
    if (!activeFile) return;
    triggerToast(`Téléchargement de ${activeFile.name} démarré...`);
  };

  const handleShare = () => {
    if (!activeFile) return;
    // Generate a beautiful temporary link
    const mockLink = `https://waya.bf/share/s_${Math.random().toString(36).substring(2, 10)}`;
    navigator.clipboard.writeText(mockLink).then(() => {
      triggerToast('Lien de partage temporaire (7j) copié !');
    }).catch(() => {
      triggerToast('Lien généré pour 7 jours.');
    });
  };

  // Dynamically calculate categorised storage stats based on files
  const photosCount = files.filter(f => f.category === 'Photos').length;
  const videosCount = files.filter(f => f.category === 'Vidéos').length;
  const docsCount = files.filter(f => f.category === 'Documents').length;
  const officialsCount = files.filter(f => f.category === 'CNIB & Officiel').length;
  const mobileMoneyCount = files.filter(f => f.category === 'Reçus Mobile Money').length;

  const totalFiles = files.length || 1;
  const photosPercentage = Math.round((photosCount / totalFiles) * 100);
  const videosPercentage = Math.round((videosCount / totalFiles) * 100);
  const docsPercentage = Math.round(((docsCount + officialsCount + mobileMoneyCount) / totalFiles) * 100);

  // SVG Donut calculation
  const strokeDashArrayPhotos = `${photosPercentage}, 100`;
  const strokeDashOffsetPhotos = '0';
  const strokeDashArrayDocs = `${docsPercentage}, 100`;
  const strokeDashOffsetDocs = `-${photosPercentage}`;
  const strokeDashArrayVideos = `${videosPercentage}, 100`;
  const strokeDashOffsetVideos = `-${photosPercentage + docsPercentage}`;

  return (
    <>
      {/* Desktop Sidebar Panel */}
      <aside className="w-[300px] flex-shrink-0 bg-white border-l border-gray-100 p-6 flex flex-col h-screen sticky top-0 overflow-y-auto hidden lg:flex">
        <h2 className="text-lg font-bold text-textPrimary mb-6">Aperçu du fichier</h2>
        
        {activeFile ? (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Visual File Preview Box */}
              <div className={`aspect-[4/3] rounded-2xl flex flex-col items-center justify-center border border-gray-100 relative overflow-hidden group shadow-sm ${
                activeFile.category === 'Photos' ? 'bg-amber-50/50 text-amber-600' :
                activeFile.category === 'Vidéos' ? 'bg-blue-50/50 text-blue-600' :
                activeFile.category === 'CNIB & Officiel' ? 'bg-green-50/50 text-green-600' :
                'bg-purple-50/50 text-purple-600'
              }`}>
                {activeFile.category === 'Photos' && <ImageIcon className="w-12 h-12" />}
                {activeFile.category === 'Vidéos' && <Film className="w-12 h-12" />}
                {activeFile.category === 'CNIB & Officiel' && <ShieldCheck className="w-12 h-12" />}
                {activeFile.category !== 'Photos' && activeFile.category !== 'Vidéos' && activeFile.category !== 'CNIB & Officiel' && <FileText className="w-12 h-12" />}
                
                <span className="text-[10px] mt-2 font-bold px-2 py-0.5 rounded-full bg-white/80 border border-gray-100 uppercase shadow-sm">
                  {activeFile.type}
                </span>
              </div>

              {/* Information List */}
              <div>
                <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-4">Informations</h3>
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-textSecondary">Nom</span>
                    <span className="font-semibold text-textPrimary max-w-[150px] truncate text-right" title={activeFile.name}>
                      {activeFile.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-textSecondary">Type</span>
                    <span className="font-medium text-textPrimary">{activeFile.type}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-textSecondary">Taille</span>
                    <span className="font-medium text-textPrimary">{activeFile.size}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-textSecondary">Date d'ajout</span>
                    <span className="font-medium text-textPrimary">{activeFile.date}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-textSecondary">Source</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      activeFile.source === 'WhatsApp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {activeFile.source}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 text-xs py-2 bg-white">
                <Download className="w-4 h-4 text-primary" />
                Télécharger
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 text-xs py-2 bg-white">
                <Share2 className="w-4 h-4 text-primary" />
                Partager
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-gray-400">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-textPrimary">Aucun fichier sélectionné</p>
            <p className="text-xs text-textSecondary mt-1 max-w-[180px]">Cliquez sur un fichier dans la liste pour voir ses détails.</p>
          </div>
        )}

        {/* Storage used donut chart section */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-4">Stockage utilisé</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-100" strokeWidth="4"></circle>
                {/* Photos */}
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-amber-400" strokeWidth="4" strokeDasharray={strokeDashArrayPhotos} strokeDashoffset={strokeDashOffsetPhotos}></circle>
                {/* Docs */}
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeWidth="4" strokeDasharray={strokeDashArrayDocs} strokeDashoffset={strokeDashOffsetDocs}></circle>
                {/* Vidéos */}
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-purple-400" strokeWidth="4" strokeDasharray={strokeDashArrayVideos} strokeDashoffset={strokeDashOffsetVideos}></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-textSecondary">Total</span>
                <span className="text-xs font-bold text-textPrimary leading-none">{storageUsed} Go</span>
              </div>
            </div>
            <div className="space-y-2 text-[10px] flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <span className="text-textSecondary">Photos</span>
                </div>
                <span className="font-bold text-textPrimary">{photosPercentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-textSecondary">Docs & Off.</span>
                </div>
                <span className="font-bold text-textPrimary">{docsPercentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="text-textSecondary">Vidéos</span>
                </div>
                <span className="font-bold text-textPrimary">{videosPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer (Bottom Sheet) */}
      {showMobilePreview && activeFile && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden flex items-end justify-center" 
          onClick={() => setShowMobilePreview(false)}
        >
          <div 
            className="w-full bg-white rounded-t-[2rem] max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-textPrimary">Détails du fichier</h2>
              <button 
                onClick={() => setShowMobilePreview(false)}
                className="p-1.5 text-gray-400 hover:text-textPrimary hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual File Preview Box */}
            <div className={`aspect-[4/3] max-w-xs mx-auto rounded-2xl flex flex-col items-center justify-center border border-gray-150 relative overflow-hidden group shadow-sm mb-6 ${
              activeFile.category === 'Photos' ? 'bg-amber-50/50 text-amber-600' :
              activeFile.category === 'Vidéos' ? 'bg-blue-50/50 text-blue-600' :
              activeFile.category === 'CNIB & Officiel' ? 'bg-green-50/50 text-green-600' :
              'bg-purple-50/50 text-purple-600'
            }`}>
              {activeFile.category === 'Photos' && <ImageIcon className="w-12 h-12" />}
              {activeFile.category === 'Vidéos' && <Film className="w-12 h-12" />}
              {activeFile.category === 'CNIB & Officiel' && <ShieldCheck className="w-12 h-12" />}
              {activeFile.category !== 'Photos' && activeFile.category !== 'Vidéos' && activeFile.category !== 'CNIB & Officiel' && <FileText className="w-12 h-12" />}
              
              <span className="text-[10px] mt-2 font-bold px-2 py-0.5 rounded-full bg-white/80 border border-gray-100 uppercase shadow-sm">
                {activeFile.type}
              </span>
            </div>

            {/* Information List */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 max-w-xs mx-auto space-y-3">
              <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-textSecondary">Nom</span>
                <span className="font-semibold text-textPrimary max-w-[180px] truncate text-right">{activeFile.name}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-textSecondary">Type</span>
                <span className="font-medium text-textPrimary">{activeFile.type}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-textSecondary">Taille</span>
                <span className="font-medium text-textPrimary">{activeFile.size}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-textSecondary">Date d'ajout</span>
                <span className="font-medium text-textPrimary">{activeFile.date}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-textSecondary">Source</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeFile.source === 'WhatsApp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>{activeFile.source}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
              <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 text-xs py-3 bg-white">
                <Download className="w-4 h-4 text-primary" />
                Télécharger
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 text-xs py-3 bg-white">
                <Share2 className="w-4 h-4 text-primary" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-[320px] md:translate-x-0 bg-textPrimary text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-up border border-gray-800 z-[999]">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
          {toastMessage}
        </div>
      )}
    </>
  );
};
