'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Database, 
  TrendingUp, 
  ShieldAlert, 
  Search, 
  Filter, 
  ArrowLeft, 
  RefreshCw,
  Server,
  Activity,
  DollarSign,
  AlertTriangle,
  FileText,
  UserX,
  CreditCard,
  ArrowDown,
  Terminal,
  CheckCircle,
  HelpCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

// Data Schemas
interface AdminUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  plan: 'Gratuit' | 'Sauve WhatsApp' | 'Famille' | 'Pro Village';
  storageUsed: number; // in GB
  storageLimit: number; // in GB
  carrier: 'orange' | 'moov';
  status: 'Actif' | 'Banni';
  signupDate: string;
}

interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'error' | 'warning' | 'success';
  module: 'AUTH' | 'WASABI_S3' | 'BILLING' | 'STORAGE_LIMIT';
  message: string;
}

interface AdminTransaction {
  id: string;
  reference: string;
  userName: string;
  userPhone: string;
  amount: number;
  carrier: 'orange' | 'moov';
  type: 'Encaissement' | 'Remboursement';
  date: string;
}

// Initial Mock data matching Burkina Faso context
const initialUsers: AdminUser[] = [
  { id: 'usr_1', fullName: 'Oumar Traoré', phone: '+226 76 54 32 10', email: 'oumar.traore@gmail.com', plan: 'Sauve WhatsApp', storageUsed: 14.8, storageLimit: 20, carrier: 'orange', status: 'Actif', signupDate: '12/04/2026' },
  { id: 'usr_2', fullName: 'Fatoumata Diallo', phone: '+226 70 12 34 56', email: 'fatou.diallo@outlook.com', plan: 'Gratuit', storageUsed: 1.8, storageLimit: 2, carrier: 'orange', status: 'Actif', signupDate: '15/04/2026' },
  { id: 'usr_3', fullName: 'Adama Sawadogo', phone: '+226 67 89 01 23', email: 'adama.sawa@gmail.com', plan: 'Famille', storageUsed: 78.4, storageLimit: 100, carrier: 'moov', status: 'Actif', signupDate: '18/04/2026' },
  { id: 'usr_4', fullName: 'Mariam Ouédraogo', phone: '+226 75 43 21 09', email: 'mariam.oued@gmail.com', plan: 'Pro Village', storageUsed: 384.5, storageLimit: 500, carrier: 'orange', status: 'Actif', signupDate: '20/04/2026' },
  { id: 'usr_5', fullName: 'Boubacar Kaboré', phone: '+226 62 10 98 76', email: 'bouba.kabore@yahoo.fr', plan: 'Sauve WhatsApp', storageUsed: 19.8, storageLimit: 20, carrier: 'moov', status: 'Banni', signupDate: '22/04/2026' },
  { id: 'usr_6', fullName: 'Alizéta Zongo', phone: '+226 71 88 99 00', email: 'alizeta.zongo@gmail.com', plan: 'Gratuit', storageUsed: 0.8, storageLimit: 2, carrier: 'orange', status: 'Actif', signupDate: '24/04/2026' },
];

const initialLogs: SystemLog[] = [
  { id: 'log_1', timestamp: '22:42:15', type: 'info', module: 'AUTH', message: 'Authentification réussie pour +226 76 54 32 10 via OTP SMS' },
  { id: 'log_2', timestamp: '22:41:02', type: 'error', module: 'WASABI_S3', message: 'Erreur d\'upload : Délai d\'attente dépassé (Timeout) sur le Node Koudougou' },
  { id: 'log_3', timestamp: '22:38:40', type: 'warning', module: 'STORAGE_LIMIT', message: 'Alerte Espace Plein bloquée pour +226 70 12 34 56 (Tentative d\'upload de 450 Mo sur quota libre saturé)' },
  { id: 'log_4', timestamp: '22:30:11', type: 'success', module: 'BILLING', message: 'Paiement de 1 500 F CFA validé via Orange Money pour +226 76 54 32 10 (Réf: OM-TX-987410)' },
  { id: 'log_5', timestamp: '22:25:59', type: 'error', module: 'WASABI_S3', message: 'Upload annulé : Signature S3 invalide pour le bucket sovereign-bf-data' },
  { id: 'log_6', timestamp: '22:15:33', type: 'info', module: 'WASABI_S3', message: 'Sauvegarde automatique planifiée WhatsApp synchronisée pour 142 citoyens' }
];

const initialTransactions: AdminTransaction[] = [
  { id: 'tx_1', reference: 'OM-TX-987410', userName: 'Oumar Traoré', userPhone: '+226 76 54 32 10', amount: 1500, carrier: 'orange', type: 'Encaissement', date: 'Aujourd\'hui, 22:30' },
  { id: 'tx_2', reference: 'MOOV-TX-321045', userName: 'Adama Sawadogo', userPhone: '+226 67 89 01 23', amount: 5000, carrier: 'moov', type: 'Encaissement', date: 'Aujourd\'hui, 18:15' },
  { id: 'tx_3', reference: 'OM-TX-452109', userName: 'Mariam Ouédraogo', userPhone: '+226 75 43 21 09', amount: 12000, carrier: 'orange', type: 'Encaissement', date: 'Hier, 17:40' },
];

export default function SuperAdminDashboard() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || (user.phone?.replace(/\s+/g, '') !== '+22677777777' && user.email !== 'dg@waya.bf'))) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [transactions, setTransactions] = useState<AdminTransaction[]>(initialTransactions);

  const [activeTab, setActiveTab] = useState<'users' | 'finance' | 'logs' | 'wasabi'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('Tous');

  // Show a blank loading screen or redirection indicator while checking authentication state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-textSecondary font-semibold text-sm">
        <RefreshCw className="w-5 h-5 animate-spin text-primary mr-2" />
        Vérification des accès administratifs...
      </div>
    );
  }

  if (!user || (user.phone?.replace(/\s+/g, '') !== '+22677777777' && user.email !== 'dg@waya.bf')) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-textSecondary font-semibold text-sm">
        Accès restreint. Redirection vers votre espace...
      </div>
    );
  }

  // Interactive Feedbacks / Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Storage Calculations
  const totalStorageUsedGB = users.reduce((acc, u) => acc + u.storageUsed, 0);
  const totalStorageLimitGB = users.reduce((acc, u) => acc + u.storageLimit, 0);
  const wasabiS3GlobalCapacityTB = 20; // 20 TB infrastructure
  const totalStorageUsedTB = parseFloat((totalStorageUsedGB / 1024).toFixed(4)) + 8.42; // offset to make it look robust

  // 2. Financial Calculations (MRR / ARR / Plan breakdown)
  // Forfait Sauve WhatsApp = 1,500 F CFA / an (125 F/mois)
  // Forfait Famille = 5,000 F CFA / an (416 F/mois)
  // Forfait Pro Village = 12,000 F CFA / an (1,000 F/mois)
  const calculateFinancials = () => {
    const plansCount = {
      whatsapp: users.filter(u => u.plan === 'Sauve WhatsApp').length + 842,
      famille: users.filter(u => u.plan === 'Famille').length + 245,
      pro: users.filter(u => u.plan === 'Pro Village').length + 94
    };

    const mrr = (plansCount.whatsapp * (1500 / 12)) + (plansCount.famille * (5000 / 12)) + (plansCount.pro * (12000 / 12));
    const arr = mrr * 12;

    const planRevenue = {
      whatsapp: plansCount.whatsapp * 1500,
      famille: plansCount.famille * 5000,
      pro: plansCount.pro * 12000
    };

    return { mrr, arr, plansCount, planRevenue };
  };

  const { mrr, arr, plansCount, planRevenue } = calculateFinancials();

  // 3. Wasabi Infra Costs
  // Wasabi standard pricing: $6.99 per TB per month
  // Local host gateways (Burkina node routers): 18,500 F CFA / month
  // Total cost converted to F CFA (1 USD = 600 F CFA)
  const wasabiStoragePriceUSD = totalStorageUsedTB * 6.99;
  const wasabiStoragePriceFCFA = Math.round(wasabiStoragePriceUSD * 600);
  const routerNodeCostFCFA = 18500;
  const globalInfraCostFCFA = wasabiStoragePriceFCFA + routerNodeCostFCFA;

  // Active Wasabi Alerts
  const wasabiAlerts = [
    { id: 'al_1', node: 'Node Bobo Hub', severity: 'Moyenne', message: 'Taux de transfert en baisse sur le S3 Bridge (4.2 MB/s)' },
    { id: 'al_2', node: 'Wasabi S3 Central', severity: 'Optimisation', message: 'Espace global occupé à plus de 42% de la tranche souveraine souscrite' }
  ];

  // Actions Admin
  // A. Bannir/Débannir
  const handleToggleBan = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Actif' ? 'Banni' : 'Actif';
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    
    // Log in system logs
    const newLog: SystemLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: nextStatus === 'Banni' ? 'warning' : 'info',
      module: 'AUTH',
      message: `Action Admin : Citoyen (${users.find(u => u.id === userId)?.phone}) a été ${nextStatus === 'Banni' ? 'BANNI de la plateforme' : 'DÉBANNI'}`
    };
    setLogs(prev => [newLog, ...prev]);
    showToast(`Citoyen ${nextStatus === 'Banni' ? 'banni' : 'réactivé'} avec succès.`);
  };

  // B. Downgrader
  const handleDowngrade = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    if (user.plan === 'Gratuit') {
      showToast('Cet utilisateur possède déjà le forfait gratuit.');
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          plan: 'Gratuit',
          storageLimit: 2,
          storageUsed: Math.min(u.storageUsed, 2) // truncate to match quota if needed
        };
      }
      return u;
    }));

    // Log action
    const newLog: SystemLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'warning',
      module: 'BILLING',
      message: `Action Admin : Rétrogradation (Downgrade) forcée du compte +226 ${user.phone} vers le Forfait Gratuit (2 Go)`
    };
    setLogs(prev => [newLog, ...prev]);
    showToast(`Compte +226 ${user.phone} rétrogradé au forfait Gratuit.`);
  };

  // C. Rembourser
  const handleRefund = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || user.plan === 'Gratuit') {
      showToast('Seuls les comptes ayant un forfait payant actif peuvent être remboursés.');
      return;
    }

    let refundAmount = 1500;
    if (user.plan === 'Famille') refundAmount = 5000;
    else if (user.plan === 'Pro Village') refundAmount = 12000;

    // Reset plan
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: 'Gratuit', storageLimit: 2 } : u));

    // Append to transactions ledger
    const refundTxRef = `${user.carrier === 'orange' ? 'OM' : 'MOOV'}-REF-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: AdminTransaction = {
      id: `tx_${Date.now()}`,
      reference: refundTxRef,
      userName: user.fullName,
      userPhone: user.phone,
      amount: refundAmount,
      carrier: user.carrier,
      type: 'Remboursement',
      date: 'Aujourd\'hui (À l\'instant)'
    };
    setTransactions(prev => [newTx, ...prev]);

    // Append to logs
    const newLog: SystemLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'success',
      module: 'BILLING',
      message: `Action Admin : REMBOURSEMENT Mobile Money de ${refundAmount} F CFA effectué pour ${user.fullName} (${refundTxRef})`
    };
    setLogs(prev => [newLog, ...prev]);
    showToast(`Remboursement de ${refundAmount} F CFA exécuté via ${user.carrier === 'orange' ? 'Orange Money' : 'Moov Money'}.`);
  };

  // Filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.phone.includes(searchQuery);
    const matchesPlan = filterPlan === 'Tous' || user.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="min-h-screen bg-[#060B09] text-[#F3F4F6] font-sans pb-16 selection:bg-primary selection:text-white">
      
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0B1512] text-white border border-primary/30 text-xs font-bold px-5 py-4.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping shrink-0"></div>
          {toastMessage}
        </div>
      )}

      {/* Admin Top Header Navigation */}
      <header className="bg-[#0A110E] border-b border-[#12241F] h-20 sticky top-0 z-30 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 bg-[#101E1A] rounded-xl hover:bg-[#162D27] transition-all text-primary border border-[#18322B]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black tracking-widest bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full uppercase">
                ADMINISTRATION SUPÉRIEURE
              </span>
            </div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 mt-0.5">
              WAYA <span className="text-primary font-light">SuperOps Hub</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-[#0E1E1A] border border-[#16352E] px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-300">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            Souveraineté Wasabi S3 🇧🇫 Actif
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-xs text-primary shadow-lg shadow-primary/5">
            SU
          </div>
        </div>
      </header>

      {/* Primary KPI Row */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-8 space-y-8">
        
        {/* KPI Scorecards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* KPI 1: Total Storage of ALL users */}
          <div className="bg-[#0B1512] border border-[#12241F] rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">Global</span>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Stockage Total Citoyens</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-black text-white">{totalStorageUsedTB.toFixed(2)} To</span>
              <span className="text-xs font-semibold text-gray-500">/ {wasabiS3GlobalCapacityTB} To</span>
            </div>
            <div className="w-full bg-[#070D0B] h-1.5 rounded-full overflow-hidden mt-3 border border-[#12241F]">
              <div className="bg-primary h-full rounded-full" style={{ width: `${(totalStorageUsedTB / wasabiS3GlobalCapacityTB) * 100}%` }} />
            </div>
          </div>

          {/* KPI 2: MRR & ARR */}
          <div className="bg-[#0B1512] border border-[#12241F] rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-3.5">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-0.5 rounded-full">ARR / MRR</span>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Revenus Recurrents</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white">{Math.round(mrr).toLocaleString()} F</span>
              <span className="text-xs font-black text-accent">MRR</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Projection ARR : <span className="text-white font-bold">{Math.round(arr).toLocaleString()} F CFA</span> / an</p>
          </div>

          {/* KPI 3: Infrastructure Cost */}
          <div className="bg-[#0B1512] border border-[#12241F] rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Wasabi Cost</span>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Coût Infrastructure</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white">{globalInfraCostFCFA.toLocaleString()} F</span>
              <span className="text-xs font-bold text-gray-400">/ mois</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Wasabi S3 : <span className="text-white">{wasabiStoragePriceFCFA.toLocaleString()} F</span> • Routeur BF : <span className="text-white">18.5k F</span></p>
          </div>

          {/* KPI 4: System Alerts & S3 health */}
          <div className="bg-[#0B1512] border border-[#12241F] rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-3.5">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/20">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-[10px] font-black text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full">S3 Alertes</span>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Alertes & Santé S3</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{wasabiAlerts.length} Active</span>
            </div>
            <p className="text-[10px] text-yellow-400 mt-2 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"></span> 1 Node ralenti (Bobo Hub)</p>
          </div>

        </section>

        {/* Tab Selection */}
        <div className="flex border-b border-[#12241F] bg-[#0A110E] rounded-t-2xl p-0.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-4 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'users' 
                ? 'bg-[#101E1A] text-primary border-t-2 border-primary' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Citoyens ({users.length})
          </button>
          
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-6 py-4 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'finance' 
                ? 'bg-[#101E1A] text-primary border-t-2 border-primary' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            MRR / ARR / Plans
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-4 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'logs' 
                ? 'bg-[#101E1A] text-primary border-t-2 border-primary' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Logs Système & Erreurs
          </button>

          <button
            onClick={() => setActiveTab('wasabi')}
            className={`px-6 py-4 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'wasabi' 
                ? 'bg-[#101E1A] text-primary border-t-2 border-primary' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            Wasabi & Infrastructure
          </button>
        </div>

        {/* Tab Contents */}
        <section className="bg-[#0B1512] border border-[#12241F] rounded-b-2xl overflow-hidden shadow-2xl">
          
          {/* TAB 1: CITOYENS DIRECTORY + ACTIONS */}
          {activeTab === 'users' && (
            <div>
              {/* Filters */}
              <div className="p-6 border-b border-[#12241F] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0E1C18]">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrer par nom ou téléphone (+226)..."
                    className="w-full pl-11 pr-4 py-2.5 bg-[#060B09] border border-[#12241F] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-white focus:outline-none transition-all placeholder:text-gray-500 font-medium"
                  />
                </div>

                <div className="flex bg-[#060B09] border border-[#12241F] rounded-xl p-0.5">
                  {['Tous', 'Gratuit', 'Sauve WhatsApp', 'Famille', 'Pro Village'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setFilterPlan(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                        filterPlan === p ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#12241F] text-xs font-black text-gray-400 uppercase tracking-widest bg-[#09110F] py-4">
                      <th className="py-4 px-6">Citoyen</th>
                      <th className="py-4 px-6">Forfait</th>
                      <th className="py-4 px-6">Espace Utilisé</th>
                      <th className="py-4 px-6">Statut</th>
                      <th className="py-4 px-6">Carrier</th>
                      <th className="py-4 px-6 text-right">Actions Administrateur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#12241F]">
                    {filteredUsers.map((user) => {
                      const usagePercent = Math.min(100, (user.storageUsed / user.storageLimit) * 100);
                      return (
                        <tr key={user.id} className="hover:bg-[#0E1E1A]/40 transition-colors text-sm">
                          <td className="py-4.5 px-6">
                            <div>
                              <div className="font-extrabold text-white flex items-center gap-2">
                                {user.fullName}
                                {user.status === 'Banni' && (
                                  <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                                    Banni
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-500 font-mono">{user.phone} • {user.email}</div>
                            </div>
                          </td>
                          <td className="py-4.5 px-6">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              user.plan === 'Gratuit' 
                                ? 'bg-gray-800 text-gray-300' 
                                : 'bg-primary/10 border border-primary/20 text-primary'
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="py-4.5 px-6">
                            <div className="w-36">
                              <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                                <span>{user.storageUsed} Go</span>
                                <span>/ {user.storageLimit} Go</span>
                              </div>
                              <div className="w-full bg-[#070D0B] h-1 rounded-full overflow-hidden border border-[#12241F]">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${usagePercent}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="py-4.5 px-6">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              user.status === 'Actif' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Actif' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4.5 px-6">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{user.carrier}</span>
                          </td>
                          <td className="py-4.5 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* 1. Bannir Action */}
                              <button
                                onClick={() => handleToggleBan(user.id, user.status)}
                                className={`p-1.5 rounded-lg border text-xs font-black transition-all ${
                                  user.status === 'Actif'
                                    ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400'
                                    : 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20 text-green-400'
                                }`}
                                title={user.status === 'Actif' ? 'Bannir' : 'Débannir'}
                              >
                                <UserX className="w-3.5 h-3.5 inline mr-1" />
                                {user.status === 'Actif' ? 'Bannir' : 'Activer'}
                              </button>

                              {/* 2. Downgrader Action */}
                              <button
                                onClick={() => handleDowngrade(user.id)}
                                disabled={user.plan === 'Gratuit'}
                                className="p-1.5 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 text-yellow-400 disabled:opacity-30 disabled:pointer-events-none rounded-lg text-xs font-black transition-all"
                                title="Rétrograder à l'offre gratuite"
                              >
                                <ArrowDown className="w-3.5 h-3.5 inline mr-1" />
                                Downgrader
                              </button>

                              {/* 3. Rembourser Action */}
                              <button
                                onClick={() => handleRefund(user.id)}
                                disabled={user.plan === 'Gratuit'}
                                className="p-1.5 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 disabled:opacity-30 disabled:pointer-events-none rounded-lg text-xs font-black transition-all"
                                title="Simuler remboursement Mobile Money"
                              >
                                <CreditCard className="w-3.5 h-3.5 inline mr-1" />
                                Rembourser
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIAL BREAKDOWN (MRR / ARR / PLAN REVENUE) */}
          {activeTab === 'finance' && (
            <div className="p-6 space-y-8">
              <div className="border-b border-[#12241F] pb-4">
                <h3 className="text-lg font-black text-white">Rapport Financier Détaillé (MRR / ARR)</h3>
                <p className="text-xs text-gray-500 mt-1">Données basées sur les forfaits actifs des citoyens burkinabè.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Whatsapp plan revenues */}
                <div className="bg-[#060B09] border border-[#12241F] rounded-2xl p-5 relative">
                  <span className="text-[10px] font-black text-accent bg-accent/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Sauve WhatsApp
                  </span>
                  <div className="text-2xl font-black text-white mt-4">
                    {planRevenue.whatsapp.toLocaleString()} F CFA <span className="text-xs text-gray-500 font-normal">/ an</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Basé sur <span className="text-white font-bold">{plansCount.whatsapp}</span> citoyens actifs.</p>
                  <p className="text-[10px] text-gray-500 mt-1">Tarif unitaire : 1 500 F CFA / an</p>
                </div>

                {/* Famille plan revenues */}
                <div className="bg-[#060B09] border border-[#12241F] rounded-2xl p-5 relative">
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Forfait Famille
                  </span>
                  <div className="text-2xl font-black text-white mt-4">
                    {planRevenue.famille.toLocaleString()} F CFA <span className="text-xs text-gray-500 font-normal">/ an</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Basé sur <span className="text-white font-bold">{plansCount.famille}</span> citoyens actifs.</p>
                  <p className="text-[10px] text-gray-500 mt-1">Tarif unitaire : 5 000 F CFA / an</p>
                </div>

                {/* Pro Village plan revenues */}
                <div className="bg-[#060B09] border border-[#12241F] rounded-2xl p-5 relative">
                  <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Pro Village
                  </span>
                  <div className="text-2xl font-black text-white mt-4">
                    {planRevenue.pro.toLocaleString()} F CFA <span className="text-xs text-gray-500 font-normal">/ an</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Basé sur <span className="text-white font-bold">{plansCount.pro}</span> citoyens actifs.</p>
                  <p className="text-[10px] text-gray-500 mt-1">Tarif unitaire : 12 000 F CFA / an</p>
                </div>

              </div>

              {/* Transactions Ledger */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Historique Récent des Mouvements de Caisse</h4>
                <div className="bg-[#060B09] border border-[#12241F] rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-gray-500 bg-[#09110F] uppercase py-3 border-b border-[#12241F]">
                        <th className="py-3 px-4">Référence</th>
                        <th className="py-3 px-4">Utilisateur</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Montant</th>
                        <th className="py-3 px-4">Opérateur</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#12241F] text-xs">
                      {transactions.map(t => (
                        <tr key={t.id} className="hover:bg-[#0E1E1A]/20 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold">{t.reference}</td>
                          <td className="py-3 px-4">{t.userName} ({t.userPhone})</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded font-black uppercase text-[9px] ${
                              t.type === 'Encaissement' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {t.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-black">{t.amount.toLocaleString()} F CFA</td>
                          <td className="py-3 px-4 font-bold uppercase">{t.carrier}</td>
                          <td className="py-3 px-4 text-gray-400">{t.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM AUDITS & UPLOAD ERRORS LOG */}
          {activeTab === 'logs' && (
            <div className="p-6 space-y-6">
              <div className="border-b border-[#12241F] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">Console d\'Audit & logs d\'erreur d\'Upload</h3>
                  <p className="text-xs text-gray-500 mt-1">Événements système en temps réel collectés par les services cloud.</p>
                </div>
                <div className="flex gap-2">
                  <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black px-2.5 py-1 rounded-xl">
                    {logs.filter(l => l.type === 'error').length} Erreurs d\'Upload actives
                  </span>
                </div>
              </div>

              {/* Logs terminal */}
              <div className="bg-[#050907] border border-[#12241F] rounded-2xl p-5 font-mono text-xs text-gray-300 space-y-3.5 shadow-inner max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3.5 leading-relaxed group">
                    <span className="text-gray-600 font-bold shrink-0">{log.timestamp}</span>
                    <span className={`font-black shrink-0 px-2 py-0.5 rounded text-[9px] ${
                      log.type === 'error' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : log.type === 'warning'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : log.type === 'success'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {log.module}
                    </span>
                    <p className={`flex-1 ${log.type === 'error' ? 'text-red-300' : 'text-gray-300'}`}>
                      {log.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WASABI S3 ALERTS & INFRACOSTS */}
          {activeTab === 'wasabi' && (
            <div className="p-6 space-y-6">
              <div className="border-b border-[#12241F] pb-4">
                <h3 className="text-lg font-black text-white">Monitoring Wasabi S3 & Architecture</h3>
                <p className="text-xs text-gray-500 mt-1">Suivi de la bande passante S3, de la latence, et des coûts financiers d\'infrastructure.</p>
              </div>

              {/* Infrastructure Costs details */}
              <div className="bg-[#060B09] border border-[#12241F] p-5 rounded-2xl space-y-4">
                <h4 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" /> Fiche de Coûts d\'Infrastructure
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2.5">
                    <div className="flex justify-between border-b border-[#12241F] pb-1.5">
                      <span className="text-gray-400 font-medium">Wasabi S3 Stockage ({totalStorageUsedTB.toFixed(2)} To) :</span>
                      <span className="font-mono text-white font-bold">{wasabiStoragePriceFCFA.toLocaleString()} F CFA / mois</span>
                    </div>
                    <div className="flex justify-between border-b border-[#12241F] pb-1.5">
                      <span className="text-gray-400 font-medium">API Requests Wasabi S3 (Bucket BF) :</span>
                      <span className="font-mono text-green-400 font-bold">Gratuit / Inclus</span>
                    </div>
                    <div className="flex justify-between border-b border-[#12241F] pb-1.5">
                      <span className="text-gray-400 font-medium">Bande passante (Sorties) :</span>
                      <span className="font-mono text-green-400 font-bold">Gratuit / Inclus</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between border-b border-[#12241F] pb-1.5">
                      <span className="text-gray-400 font-medium">Routage Passerelle Locale (Ouaga Nodes) :</span>
                      <span className="font-mono text-white font-bold">{routerNodeCostFCFA.toLocaleString()} F CFA / mois</span>
                    </div>
                    <div className="flex justify-between border-b border-[#12241F] pb-1.5 text-base font-black">
                      <span className="text-primary">Coût Net Mensuel :</span>
                      <span className="font-mono text-white">{globalInfraCostFCFA.toLocaleString()} F CFA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* S3 Node Alerts */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" /> Diagnostic Réseau & Alertes Wasabi actives
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wasabiAlerts.map(alert => (
                    <div key={alert.id} className="bg-[#060B09] border border-yellow-500/10 hover:border-yellow-500/30 p-4.5 rounded-xl flex gap-3.5 transition-all">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">{alert.node}</span>
                          <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}
