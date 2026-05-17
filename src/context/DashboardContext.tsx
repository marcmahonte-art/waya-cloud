'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { uploadToWasabi } from '@/lib/wasabi';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';

export interface CloudFile {
  name: string;
  type: string;
  size: string;
  date: string;
  color: string;
  source: 'WhatsApp' | 'Manuel';
  category: 'Photos' | 'Vidéos' | 'Documents' | 'CNIB & Officiel' | 'Reçus Mobile Money';
  url?: string;
}

interface DashboardContextType {
  files: CloudFile[];
  activeFile: CloudFile | null;
  setActiveFile: (file: CloudFile | null) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isBackupInProgress: boolean;
  backupProgress: number;
  storageUsed: number;
  maxStorage: number;
  isUpgraded: boolean;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  backupDate: string;
  backupCount: number;
  startBackup: () => void;
  uploadFile: (file: File) => Promise<{ success: boolean; error?: string }>;
  upgradeStorage: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showMobilePreview: boolean;
  setShowMobilePreview: (show: boolean) => void;
  deleteFile: (fileName: string) => void;
  
  // Real-time Wasabi S3 Upload States
  isUploading: boolean;
  uploadProgress: number;
  showStorageFullModal: boolean;
  setShowStorageFullModal: (show: boolean) => void;
}

const initialFiles: CloudFile[] = [
  { name: 'Reçu_OM_0102.pdf', type: 'PDF', size: '1.2 Mo', date: 'Aujourd\'hui', color: 'text-red-500', source: 'WhatsApp', category: 'Reçus Mobile Money' },
  { name: 'Photo_Famille.jpg', type: 'IMG', size: '4.5 Mo', date: 'Hier', color: 'text-blue-500', source: 'Manuel', category: 'Photos' },
  { name: 'Video_Mariage.mp4', type: 'MP4', size: '128 Mo', date: 'Il y a 2 jours', color: 'text-purple-500', source: 'WhatsApp', category: 'Vidéos' },
  { name: 'CNIB_Recto.pdf', type: 'PDF', size: '0.8 Mo', date: 'Il y a 3 jours', color: 'text-red-500', source: 'Manuel', category: 'CNIB & Officiel' },
  { name: 'Contrat_Bail.pdf', type: 'PDF', size: '2.1 Mo', date: 'La semaine dernière', color: 'text-red-500', source: 'Manuel', category: 'Documents' },
];

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user, plan, storageUsed: userStorageUsed, storageLimit, upgradePlan } = useUser();

  const [files, setFiles] = useState<CloudFile[]>(initialFiles);
  const [activeFile, setActiveFileState] = useState<CloudFile | null>(initialFiles[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Mon Cloud');
  const [isBackupInProgress, setIsBackupInProgress] = useState<boolean>(false);
  const [backupProgress, setBackupProgress] = useState<number>(0);
  
  // Synchronize local states with UserContext
  const [storageUsed, setStorageUsed] = useState<number>(1.2);
  const [maxStorage, setMaxStorage] = useState<number>(2);
  const [isUpgraded, setIsUpgraded] = useState<boolean>(false);

  // Wasabi S3 specific upload states
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showStorageFullModal, setShowStorageFullModal] = useState<boolean>(false);

  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [backupDate, setBackupDate] = useState<string>('il y a 2 jours');
  const [backupCount, setBackupCount] = useState<number>(3247);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMobilePreview, setShowMobilePreview] = useState<boolean>(false);

  // Keep state in sync with UserContext
  useEffect(() => {
    setStorageUsed(userStorageUsed);
    setMaxStorage(storageLimit);
    setIsUpgraded(plan !== 'Gratuit');
  }, [userStorageUsed, storageLimit, plan]);

  // Load real files from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured && supabase && user) {
      supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            const mapped: CloudFile[] = data.map((f: any) => {
              const ext = f.name.split('.').pop()?.toUpperCase() || 'FILE';
              let color = 'text-gray-500';
              if (['JPG', 'JPEG', 'PNG', 'WEBP'].includes(ext)) color = 'text-blue-500';
              else if (['MP4', 'MOV'].includes(ext)) color = 'text-purple-500';
              else if (['PDF'].includes(ext)) color = 'text-red-500';

              return {
                name: f.name,
                type: ext,
                size: `${(f.size / (1024 * 1024)).toFixed(1)} Mo`,
                date: new Date(f.created_at).toLocaleDateString('fr-FR'),
                color,
                source: f.source || 'Manuel',
                category: f.category || 'Documents',
                url: f.url
              };
            });
            setFiles([...mapped, ...initialFiles]);
          }
        });
    }
  }, [user]);

  const setActiveFile = (file: CloudFile | null) => {
    setActiveFileState(file);
    if (file) {
      setShowMobilePreview(true);
    }
  };

  const startBackup = () => {
    if (isBackupInProgress) return;
    
    // Check space limit before starting backup (simulated backup size 150 Mo = 0.15 GB)
    const backupSizeGB = 0.15;
    if (storageUsed + backupSizeGB >= maxStorage) {
      setShowStorageFullModal(true);
      return;
    }

    setIsBackupInProgress(true);
    setBackupProgress(0);

    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackupInProgress(false);
          setBackupDate('À l\'instant');
          setBackupCount((c) => c + 142);
          
          const newStorageUsed = parseFloat((storageUsed + backupSizeGB).toFixed(2));
          setStorageUsed(newStorageUsed);

          // Add a new backed up file sample
          const newFile: CloudFile = {
            name: `Backup_WA_${Date.now().toString().slice(-4)}.zip`,
            type: 'ZIP',
            size: '150 Mo',
            date: 'À l\'instant',
            color: 'text-green-500',
            source: 'WhatsApp',
            category: 'Documents'
          };
          setFiles((prevFiles) => [newFile, ...prevFiles]);
          setActiveFile(newFile);

          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Real Upload to Wasabi S3 with Progress bar & Storage limit validations
  const uploadFile = async (file: File): Promise<{ success: boolean; error?: string }> => {
    const sizeInGB = file.size / (1024 * 1024 * 1024);
    
    // 1. Storage Limit Blocker Check
    if (storageUsed + sizeInGB >= maxStorage) {
      setShowStorageFullModal(true);
      return { success: false, error: "Espace plein ! Veuillez mettre à niveau votre forfait." };
    }

    // Initialize state
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 2. Perform Wasabi S3 direct upload
      const wasabiRes = await uploadToWasabi(file, (percent) => {
        setUploadProgress(percent);
      });

      if (!wasabiRes.success || !wasabiRes.url) {
        setIsUploading(false);
        return { success: false, error: wasabiRes.error || "Échec Wasabi S3." };
      }

      // Prepare UI Metadata
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      const sizeStr = `${sizeInMB} Mo`;
      const extension = file.name.split('.').pop()?.toUpperCase() || 'FILE';

      let category: CloudFile['category'] = 'Documents';
      let color = 'text-gray-500';

      if (['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF'].includes(extension)) {
        category = 'Photos';
        color = 'text-blue-500';
      } else if (['MP4', 'MOV', 'AVI', 'MKV'].includes(extension)) {
        category = 'Vidéos';
        color = 'text-purple-500';
      } else if (['PDF'].includes(extension)) {
        category = 'Documents';
        color = 'text-red-500';
      }

      const newFile: CloudFile = {
        name: file.name,
        type: extension,
        size: sizeStr,
        date: 'À l\'instant',
        color,
        source: 'Manuel',
        category,
        url: wasabiRes.url
      };

      // 3. Register in Supabase database if configured
      if (isSupabaseConfigured && supabase && user) {
        try {
          // Insert file metadata
          await supabase.from('files').insert({
            name: file.name,
            size: file.size,
            type: extension,
            url: wasabiRes.url,
            user_id: user.id,
            category,
            source: 'Manuel'
          });

          // Increment profile storage used
          const dbNewUsed = parseFloat((storageUsed + sizeInGB).toFixed(4));
          await supabase.from('profiles').update({
            storage_used: dbNewUsed
          }).eq('id', user.id);
        } catch (dbErr) {
          console.error("Database registration failed:", dbErr);
        }
      }

      // Update Local React States
      setFiles((prev) => [newFile, ...prev]);
      setActiveFile(newFile);
      setStorageUsed((s) => parseFloat((s + sizeInGB).toFixed(4)));

      setIsUploading(false);
      return { success: true };
    } catch (err: any) {
      setIsUploading(false);
      return { success: false, error: err.message || "Une erreur est survenue lors de l'upload." };
    }
  };

  const upgradeStorage = () => {
    upgradePlan(20);
    setMaxStorage(20);
    setIsUpgraded(true);
    setShowUpgradeModal(false);
    setShowStorageFullModal(false);
  };

  const deleteFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
    setActiveFileState((curr) => {
      if (curr?.name === fileName) {
        return null;
      }
      return curr;
    });

    if (isSupabaseConfigured && supabase && user) {
      supabase.from('files').delete().eq('name', fileName).eq('user_id', user.id);
    }
  };

  return (
    <DashboardContext.Provider value={{
      files,
      activeFile,
      setActiveFile,
      selectedCategory,
      setSelectedCategory,
      isBackupInProgress,
      backupProgress,
      storageUsed,
      maxStorage,
      isUpgraded,
      showUpgradeModal,
      setShowUpgradeModal,
      backupDate,
      backupCount,
      startBackup,
      uploadFile,
      upgradeStorage,
      searchQuery,
      setSearchQuery,
      showMobilePreview,
      setShowMobilePreview,
      deleteFile,
      
      // Upload Wasabi states
      isUploading,
      uploadProgress,
      showStorageFullModal,
      setShowStorageFullModal
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
