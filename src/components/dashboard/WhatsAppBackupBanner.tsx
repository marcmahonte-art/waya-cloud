'use client';

import React from 'react';
import { Smartphone, RefreshCcw, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDashboard } from '@/context/DashboardContext';

export const WhatsAppBackupBanner = () => {
  const { 
    isBackupInProgress, 
    backupProgress, 
    backupDate, 
    backupCount, 
    startBackup 
  } = useDashboard();

  return (
    <div className="bg-primaryLight/50 border border-primary/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      {/* Background backup indicator */}
      {isBackupInProgress && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-300"
          style={{ width: `${backupProgress}%` }}
        />
      )}

      <div className="flex items-center gap-5 text-center md:text-left z-10 w-full md:w-auto">
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary shrink-0 relative">
          {isBackupInProgress ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Smartphone className="w-8 h-8" />
          )}
          {isBackupInProgress && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-textPrimary">Sauvegarde WhatsApp</h3>
          <p className="text-sm text-textSecondary mt-0.5">
            {isBackupInProgress ? (
              <span>Sauvegarde en cours... <span className="font-bold text-primary">{backupProgress}%</span></span>
            ) : (
              <span>Dernière sauvegarde : <span className="font-semibold text-primary">{backupDate}</span> • {backupCount.toLocaleString('fr-FR')} fichiers protégés</span>
            )}
          </p>
        </div>
      </div>
      
      <Button 
        variant="primary" 
        onClick={startBackup}
        disabled={isBackupInProgress}
        className={`${!isBackupInProgress ? 'btn-pulse' : ''} gap-2 whitespace-nowrap shadow-lg shadow-primary/20 z-10 w-full md:w-auto`}
      >
        {isBackupInProgress ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sauvegarde...
          </>
        ) : (
          <>
            <RefreshCcw className="w-4 h-4" />
            Sauvegarder maintenant
          </>
        )}
      </Button>
    </div>
  );
};
