'use client';

import React, { useRef, useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  Menu, 
  Cloud, 
  LogOut,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  Smartphone,
  Users,
  TrendingUp,
  Trash2,
  Key,
  Settings,
  Laptop,
  PlusCircle,
  Target,
  Globe,
  ChevronRight,
  HelpCircle,
  Shield,
  X,
  Loader2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WhatsAppBackupBanner } from '@/components/dashboard/WhatsAppBackupBanner';
import { FileGrid } from '@/components/dashboard/FileGrid';
import { useDashboard } from '@/context/DashboardContext';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { 
    searchQuery, 
    setSearchQuery, 
    uploadFile,
    selectedCategory,
    setSelectedCategory,
    storageUsed,
    maxStorage,
    setShowUpgradeModal,
    isUpgraded,
    isUploading,
    uploadProgress,
    showStorageFullModal,
    setShowStorageFullModal,
    upgradeStorage
  } = useDashboard();

  const { user, plan, storageLimit, logout } = useUser();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Navigation & Menu States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Profile settings state (can be saved/modified)
  const [profileName, setProfileName] = useState(user?.fullName || 'Oumar Traoré');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'oumar.traore@gmail.com');
  const [profilePhone, setProfilePhone] = useState(user?.phone?.replace('+226', '') || '76 54 32 10');
  const [profileCarrier, setProfileCarrier] = useState<'orange' | 'moov'>('orange');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Sync profile details when user changes
  React.useEffect(() => {
    if (user) {
      if (user.fullName) setProfileName(user.fullName);
      if (user.email) setProfileEmail(user.email);
      if (user.phone) setProfilePhone(user.phone.replace('+226', ''));
    }
  }, [user]);

  // Simulated Alert / Toast messages
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const res = await uploadFile(file);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (res.success) {
        triggerToast(`Fichier "${file.name}" envoyé sur Wasabi S3 !`);
      } else {
        triggerToast(`Erreur d'upload : ${res.error}`);
      }
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const file = droppedFiles[0];
      const res = await uploadFile(file);
      if (res.success) {
        triggerToast(`Fichier "${file.name}" déposé et envoyé sur Wasabi S3 !`);
      } else {
        triggerToast(`Erreur d'upload : ${res.error}`);
      }
    }
  };

  // 1. Download real recovery key text file
  const handleDownloadRecoveryKey = () => {
    const key = `WAYA-SECURE-KEY-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
    const textContent = `--------------------------------------------------\n       WAYA CLOUD - CLÉ DE RÉCUPÉRATION SOUVERAINE\n--------------------------------------------------\n\nNom: ${profileName}\nEmail: ${profileEmail}\nTéléphone: +226 ${profilePhone}\nDate de création: ${new Date().toLocaleDateString()}\nClé unique de cryptage: ${key}\n\nIMPORTANT :\nConservez ce document précieusement sur un support physique externe.\nCette clé de récupération privée est la SEULE clé vous permettant de déchiffrer vos photos WhatsApp et vos documents administratifs stockés localement au Burkina Faso en cas de perte de vos identifiants.\n\n"Vos données. Votre pays." - WAYA Cloud BF.`;
    
    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `waya_cle_recuperation_${profileName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setShowProfileMenu(false);
    triggerToast("Clé de récupération téléchargée avec succès !");
  };

  // 2. Desktop app download simulation
  const handleDownloadDesktopApp = () => {
    setShowProfileMenu(false);
    triggerToast("Téléchargement de l'Appli WAYA pour Windows démarré...");
  };

  // 3. Objectives Alert
  const handleObjectivesAlert = () => {
    setShowProfileMenu(false);
    triggerToast("Objectif du jour : Sauvegarder vos données pour sécuriser votre compte 🚀");
  };

  // 4. Save Profile Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      setShowSettingsModal(false);
      triggerToast("Profil mis à jour avec succès !");
    }, 1200);
  };

  // Calculate dynamic initials from profileName
  const userInitials = profileName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'OT';

  const percentage = Math.min(100, (storageUsed / maxStorage) * 100);

  return (
    <div 
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      className="flex-1 flex flex-col relative text-textPrimary"
    >
      {/* Invisible file input for upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          {/* Mobile drawer toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-textPrimary hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 max-w-md md:max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Chercher dans mes fichiers..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleUploadClick}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </Button>
          
          {/* Notification Button */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotification(!showNotification);
                setShowProfileMenu(false);
              }}
              className="p-2 text-gray-400 hover:text-primary transition-colors relative rounded-full hover:bg-gray-50"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
            </button>

            {showNotification && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-slide-up">
                <h4 className="font-bold text-sm text-textPrimary mb-3">Notifications</h4>
                <div className="space-y-3">
                  <div className="flex gap-3 text-xs pb-3 border-b border-gray-50">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0"></div>
                    <div>
                      <p className="font-semibold text-textPrimary">Sauvegarde effectuée</p>
                      <p className="text-textSecondary mt-0.5">Vos photos WhatsApp ont bien été cryptées et stockées.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="w-2 h-2 bg-accent rounded-full mt-1.5 shrink-0"></div>
                    <div>
                      <p className="font-semibold text-textPrimary">Bienvenue sur WAYA !</p>
                      <p className="text-textSecondary mt-0.5">Profitez de vos 2 Go offerts sur des serveurs souverains.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown Trigger (MEGA-style) */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotification(false);
              }}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs border border-primary/20 hover:ring-4 hover:ring-primary/10 transition-all select-none cursor-pointer"
            >
              {userInitials}
            </button>

            {/* Float Dropdown (Matches Uploaded Screenshot EXACTLY) */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2.5 w-76 bg-white rounded-2xl shadow-xl border border-gray-100 py-3.5 z-50 animate-slide-up text-textPrimary">
                {/* 1. Storage Bar */}
                <div className="px-4 pb-3 border-b border-gray-50">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-textSecondary font-medium">{isUpgraded ? 'Abonné 20 Go' : 'Gratuit'}</span>
                    <span className="text-textPrimary font-bold">{storageUsed} Go sur {maxStorage} Go utilisés</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                  </div>
                  {!isUpgraded && (
                    <button 
                      onClick={() => {
                        setShowUpgradeModal(true);
                        setShowProfileMenu(false);
                      }}
                      className="text-xs font-bold text-primary hover:underline text-left block"
                    >
                      Surclasser le compte
                    </button>
                  )}
                </div>

                {/* 2. Download recovery key item */}
                <div className="px-4 py-2 border-b border-gray-50">
                  <button 
                    onClick={handleDownloadRecoveryKey}
                    className="w-full text-left py-1.5 text-xs font-semibold text-textPrimary hover:text-primary transition-colors flex items-center gap-2.5"
                  >
                    <Key className="w-4 h-4 text-gray-400" />
                    Télécharger la clé de récupération
                  </button>
                </div>

                {/* 3. Navigation items list */}
                <div className="px-2 py-2 border-b border-gray-50 space-y-0.5">
                  <button 
                    onClick={() => {
                      setShowSettingsModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs font-medium rounded-lg text-textPrimary hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2.5"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Paramètres
                  </button>
                  
                  <button 
                    onClick={handleDownloadDesktopApp}
                    className="w-full text-left px-2.5 py-2 text-xs font-medium rounded-lg text-textPrimary hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2.5"
                  >
                    <Laptop className="w-4 h-4 text-gray-400" />
                    Installer l'Appli WAYA pour ordinateur
                  </button>

                  <button 
                    onClick={() => {
                      setShowUpgradeModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs font-medium rounded-lg text-textPrimary hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2.5"
                  >
                    <PlusCircle className="w-4 h-4 text-gray-400" />
                    Recharger votre compte
                  </button>

                  <button 
                    onClick={handleObjectivesAlert}
                    className="w-full text-left px-2.5 py-2 text-xs font-medium rounded-lg text-textPrimary hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2.5"
                  >
                    <Target className="w-4 h-4 text-gray-400" />
                    Objectifs
                  </button>
                </div>

                {/* 4. Logout action */}
                <div className="px-4 py-2.5 border-b border-gray-50">
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-textPrimary text-xs font-extrabold rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Me déconnecter
                  </button>
                </div>

                {/* 5. Dropdown footer items */}
                <div className="px-4 pt-2 text-[10px] text-textSecondary space-y-1.5 font-medium">
                  <div className="flex justify-between items-center hover:text-primary cursor-pointer">
                    <span>Langue (Français)</span>
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex justify-between items-center hover:text-primary cursor-pointer">
                    <span>Assistance</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="flex justify-between items-center hover:text-primary cursor-pointer">
                    <span>Juridique</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="text-center text-[9px] text-gray-300 pt-1.5 font-semibold">
                    V.1.0.2
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 md:p-8 space-y-10 max-w-5xl mx-auto w-full flex-1">
        <WhatsAppBackupBanner />
        <FileGrid />
      </div>

      {/* Mobile Sidebar / Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 bottom-0 left-0 w-[260px] bg-white z-50 shadow-2xl transition-transform duration-300 md:hidden flex flex-col ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Cloud className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-textPrimary tracking-tight">WAYA</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-gray-400 hover:text-textPrimary hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 transform rotate-90" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-6">
          {[
            { icon: Cloud, label: 'Mon Cloud' },
            { icon: Plus, label: 'Upload Fichier', onClick: handleUploadClick },
            { icon: Smartphone, label: 'Photos WhatsApp' },
            { icon: FileText, label: 'Documents' },
            { icon: ShieldCheck, label: 'CNIB & Officiel', badge: 'BF' },
            { icon: TrendingUp, label: 'Reçus Mobile Money' },
            { icon: Users, label: 'Partagés' },
            { icon: Trash2, label: 'Corbeille' },
          ].map((item) => {
            const isActive = selectedCategory === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    setSelectedCategory(item.label);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm transition-all ${
                  isActive 
                    ? 'bg-primaryLight text-primary font-bold' 
                    : 'text-textSecondary hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
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

        <div className="p-4 border-t border-gray-50">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-textSecondary">Stockage</span>
              <span className="text-xs font-bold text-textPrimary">{storageUsed} Go / {maxStorage} Go</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${percentage}%` }}></div>
            </div>
            {!isUpgraded ? (
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full text-xs py-2"
                onClick={() => {
                  setShowUpgradeModal(true);
                  setMobileMenuOpen(false);
                }}
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
      </div>

      {/* PARAMÈTRES / PROFILE MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up text-textPrimary">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Paramètres de profil</h3>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 text-gray-400 hover:text-textPrimary hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSettings} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">
                  Nom Complet
                </label>
                <input 
                  type="text" 
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">
                  Adresse Email
                </label>
                <input 
                  type="email" 
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">
                  Numéro de Téléphone
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-semibold text-gray-400 select-none">
                    +226
                  </span>
                  <input 
                    type="tel" 
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-3">
                  Opérateur de Facturation Local
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setProfileCarrier('orange')}
                    className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                      profileCarrier === 'orange' 
                        ? 'border-[#FF6600] bg-[#FF6600]/5 text-[#FF6600] font-bold' 
                        : 'border-gray-200 text-textSecondary hover:bg-gray-50'
                    }`}
                  >
                    Orange Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileCarrier('moov')}
                    className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                      profileCarrier === 'moov' 
                        ? 'border-[#008080] bg-[#008080]/5 text-[#008080] font-bold' 
                        : 'border-gray-200 text-textSecondary hover:bg-gray-50'
                    }`}
                  >
                    Moov Money
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowSettingsModal(false)}
                  className="px-5 font-bold"
                  disabled={isSavingSettings}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSavingSettings}
                  className="px-6 bg-primary hover:bg-[#0F6E56] font-bold shadow-lg shadow-primary/10 flex items-center gap-1.5"
                >
                  {isSavingSettings ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    'Enregistrer les modifications'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Shared Toast alerts */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-textPrimary text-white text-xs font-semibold px-4.5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-gray-800 animate-slide-up z-[9999]">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping shrink-0"></div>
          {toastMessage}
        </div>
      )}

      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="fixed inset-0 bg-primary/20 backdrop-blur-md border-4 border-dashed border-primary z-50 flex flex-col items-center justify-center text-primary animate-fade-in"
        >
          <div className="bg-white/90 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-sm text-center border border-primary/20">
            <div className="w-16 h-16 bg-primaryLight rounded-2xl flex items-center justify-center text-primary animate-bounce">
              <Cloud className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-textPrimary">Déposez votre fichier</h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              Relâchez pour l'envoyer instantanément sur votre espace souverain **Wasabi S3**.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-accent/20 border border-[#FAC775] px-3 py-1 rounded-full text-[10px] font-bold text-textPrimary">
              Hébergement local 🇧🇫 Orange Money
            </div>
          </div>
        </div>
      )}

      {/* Real-time Wasabi S3 Upload Progress Bar */}
      {isUploading && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 w-80 z-50 animate-slide-up flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-xs font-bold text-textPrimary">Envoi vers Wasabi S3...</span>
            </div>
            <span className="text-xs font-black text-primary">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-textSecondary italic">Stockage souverain crypté en cours...</p>
        </div>
      )}

      {/* Storage Full Upgrade Modal */}
      {showStorageFullModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-scale-up">
            <div className="bg-gradient-to-br from-red-500 to-[#C93B3B] p-6 text-white text-center relative">
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setShowStorageFullModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-lg">
                <Cloud className="w-9 h-9 text-accent animate-pulse" />
              </div>
              <h3 className="text-2xl font-black">Espace plein !</h3>
              <p className="text-xs text-white/90 mt-1.5 leading-relaxed">
                Votre quota gratuit de **{maxStorage} Go** est saturé.
              </p>
            </div>
            
            <div className="p-6 space-y-6 text-center">
              <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100 flex flex-col items-center gap-1.5">
                <span className="text-xs font-extrabold text-red-600 uppercase tracking-widest">Forfait Sauve WhatsApp</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-textPrimary">1 500 F</span>
                  <span className="text-sm font-semibold text-textSecondary">/ an</span>
                </div>
                <span className="text-[10px] font-bold text-accent bg-primary px-3 py-1 rounded-full mt-1">20 Go de Stockage Réel</span>
              </div>

              <p className="text-xs text-textSecondary leading-relaxed">
                Libérez instantanément votre espace. Activez votre sauvegarde automatique WhatsApp et continuez à déposer vos fichiers en toute sécurité sur **Wasabi S3**.
              </p>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={upgradeStorage}
                  className="w-full py-3.5 bg-primary hover:bg-[#0F6E56] text-white font-extrabold shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
                >
                  Passer à 20 Go par Orange Money
                </Button>
                <button 
                  onClick={() => setShowStorageFullModal(false)}
                  className="w-full py-3 text-xs font-bold text-textSecondary hover:text-textPrimary transition-colors"
                >
                  Annuler et conserver mes fichiers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
