'use client';

import React, { useState } from 'react';
import { 
  ImageIcon, 
  Film, 
  FileText, 
  ShieldCheck, 
  MoreVertical, 
  TrendingUp, 
  Share2, 
  Download, 
  Trash2 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { useDashboard, CloudFile } from '@/context/DashboardContext';

const folderMetadata = [
  { name: 'Photos', countLabel: 'fichiers', icon: ImageIcon, color: 'bg-amber-100 text-amber-600' },
  { name: 'Vidéos', countLabel: 'fichiers', icon: Film, color: 'bg-blue-100 text-blue-600' },
  { name: 'Documents', countLabel: 'fichiers', icon: FileText, color: 'bg-purple-100 text-purple-600' },
  { name: 'CNIB & Officiel', countLabel: 'fichiers', icon: ShieldCheck, color: 'bg-green-100 text-green-600' },
];

export const FileGrid = () => {
  const { 
    files, 
    activeFile, 
    setActiveFile, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    deleteFile
  } = useDashboard();

  // Track which file's three-dots menu is currently open
  const [openMenuFileName, setOpenMenuFileName] = useState<string | null>(null);

  // Dynamic shared alert/toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  // Helper to count files in folders
  const getFileCount = (categoryName: string) => {
    return files.filter(f => f.category === categoryName).length;
  };

  // Filter files based on selected sidebar category + search query
  const filteredFiles = files.filter(file => {
    // 1. Sidebar Category filter
    let matchesCategory = true;
    if (selectedCategory === 'Photos WhatsApp') {
      matchesCategory = file.category === 'Photos' && file.source === 'WhatsApp';
    } else if (selectedCategory === 'Documents') {
      matchesCategory = file.category === 'Documents';
    } else if (selectedCategory === 'CNIB & Officiel') {
      matchesCategory = file.category === 'CNIB & Officiel';
    } else if (selectedCategory === 'Reçus Mobile Money') {
      matchesCategory = file.category === 'Reçus Mobile Money';
    } else if (selectedCategory === 'Corbeille') {
      matchesCategory = false; // Corbeille is empty in this prototype
    } else if (selectedCategory === 'Partagés') {
      matchesCategory = file.source === 'WhatsApp'; // WhatsApp backups count as shared
    } else if (selectedCategory !== 'Mon Cloud') {
      matchesCategory = file.category === selectedCategory;
    }

    // 2. Search query filter
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 text-textPrimary relative">
      {/* Smart folders grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-textPrimary">Dossiers intelligents</h2>
          {selectedCategory !== 'Mon Cloud' && (
            <button 
              onClick={() => setSelectedCategory('Mon Cloud')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Voir tout le cloud
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {folderMetadata.map((folder) => {
            const count = getFileCount(folder.name);
            const isFolderSelected = selectedCategory === folder.name;
            return (
              <Card 
                key={folder.name} 
                onClick={() => setSelectedCategory(folder.name)}
                className={`flex items-center gap-4 cursor-pointer border transition-all ${
                  isFolderSelected 
                    ? 'border-primary bg-primaryLight/20 ring-1 ring-primary' 
                    : 'border-gray-100 hover:border-primary/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${folder.color}`}>
                  <folder.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-sm text-textPrimary">{folder.name}</div>
                  <div className="text-xs text-textSecondary">{count} {folder.countLabel}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Files List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-textPrimary">
            {selectedCategory === 'Mon Cloud' ? 'Fichiers récents' : selectedCategory}
            <span className="text-sm font-normal text-textSecondary ml-2 font-medium">
              ({filteredFiles.length} fichier{filteredFiles.length > 1 ? 's' : ''})
            </span>
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {filteredFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-textSecondary uppercase tracking-wider">
                    <th className="px-6 py-4">Nom</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Taille</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredFiles.map((file, i) => {
                    const isSelected = activeFile?.name === file.name;
                    return (
                      <tr 
                        key={i} 
                        onClick={() => setActiveFile(file)}
                        className={`hover:bg-gray-50/50 cursor-pointer transition-colors group ${
                          isSelected ? 'bg-primaryLight/10 font-medium' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* File Icon / Image Thumbnail */}
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-gray-150 bg-gray-50/50 shadow-sm relative group-hover:border-primary/30 transition-all">
                              {file.category === 'Photos' ? (
                                <img
                                  src={file.url || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=60'}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className={`w-full h-full flex items-center justify-center font-black text-[9px] uppercase tracking-wider ${file.color}`}>
                                  {file.type}
                                </div>
                              )}
                            </div>
                            <span className={`text-sm ${isSelected ? 'text-primary font-semibold' : 'text-textPrimary font-medium'}`}>
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-textSecondary font-medium">{file.type}</td>
                        <td className="px-6 py-4 text-sm text-textSecondary font-medium">{file.size}</td>
                        <td className="px-6 py-4 text-sm text-textSecondary font-medium">{file.date}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                            file.source === 'WhatsApp' 
                              ? 'bg-green-50 text-green-700 border border-green-100' 
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {file.source}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenMenuFileName(openMenuFileName === file.name ? null : file.name);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 focus:outline-none transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* File Actions Dropdown Menu */}
                          {openMenuFileName === file.name && (
                            <>
                              {/* Invisible backdrop to dismiss menu */}
                              <div 
                                className="fixed inset-0 z-30" 
                                onClick={() => setOpenMenuFileName(null)}
                              />
                              <div className="absolute right-6 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-40 animate-slide-up text-left">
                                <button 
                                  onClick={() => {
                                    setOpenMenuFileName(null);
                                    triggerToast(`Téléchargement de ${file.name} démarré...`);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-textPrimary hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5 text-gray-400" />
                                  Télécharger
                                </button>
                                
                                <button 
                                  onClick={() => {
                                    setOpenMenuFileName(null);
                                    const mockLink = `https://waya.bf/share/s_${Math.random().toString(36).substring(2, 10)}`;
                                    navigator.clipboard.writeText(mockLink).then(() => {
                                      triggerToast("Lien de partage sécurisé copié !");
                                    });
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-textPrimary hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                                >
                                  <Share2 className="w-3.5 h-3.5 text-gray-400" />
                                  Partager
                                </button>

                                <div className="border-t border-gray-100 my-1"></div>

                                <button 
                                  onClick={() => {
                                    setOpenMenuFileName(null);
                                    deleteFile(file.name);
                                    triggerToast("Fichier supprimé avec succès !");
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  Supprimer
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-dashed border-gray-200">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-textPrimary">Aucun fichier trouvé</h3>
                <p className="text-sm text-textSecondary mt-1 max-w-xs mx-auto">
                  {searchQuery ? `Aucun fichier ne correspond à votre recherche "${searchQuery}".` : "Ce dossier ne contient aucun fichier pour le moment."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Shared Toast alerts */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-textPrimary text-white text-xs font-semibold px-4.5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-gray-800 animate-slide-up z-[9999]">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping shrink-0"></div>
          {toastMessage}
        </div>
      )}
    </div>
  );
};
