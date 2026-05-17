'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cloud, Lock, Phone, ArrowLeft, Loader2, ShieldCheck, User, Mail, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUser } from '@/context/UserContext';

export default function RegisterPage() {
  const router = useRouter();
  const { loginMock } = useUser();
  const [step, setStep] = useState(1);
  
  // Form values
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [carrier, setCarrier] = useState<'orange' | 'moov'>('orange');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (!fullName || !email) {
        setError('Veuillez renseigner votre nom et votre email.');
        return;
      }
      if (!email.includes('@')) {
        setError('Veuillez entrer une adresse email valide.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!phoneNumber || phoneNumber.length < 8) {
        setError('Veuillez entrer un numéro de téléphone à 8 chiffres valide.');
        return;
      }
      setStep(3);
    }
  };

  const prevStep = () => {
    setError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Veuillez choisir un mot de passe sécurisé.');
      return;
    }
    if (!agreeTerms) {
      setError('Vous devez accepter les conditions pour continuer.');
      return;
    }
    setError(null);
    setIsLoading(true);

    // Call loginMock from context to synchronize state instantly and set cookies
    setTimeout(() => {
      setIsLoading(false);
      loginMock(fullName, email, phoneNumber);
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Back to Home */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-textSecondary hover:text-primary transition-colors z-30"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à l'accueil
      </Link>

      {/* Left side: Premium reassurance (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-textPrimary via-[#0F6E56] to-primary p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primaryLight/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
            <Cloud className="w-6 h-6 text-accent" />
          </div>
          <span className="text-2xl font-bold tracking-tight select-none">WAYA</span>
        </div>

        <div className="space-y-6 z-10 my-auto">
          <div className="inline-flex items-center gap-2 bg-[#FAC775]/20 border border-[#FAC775]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-accent shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            2 Go offerts immédiatement
          </div>
          <h1 className="text-4xl xl:text-5xl font-black leading-tight">
            Reprenez le contrôle de vos souvenirs numériques.
          </h1>
          <p className="text-base text-gray-200/90 leading-relaxed max-w-lg">
            Rejoignez des milliers de burkinabè qui font le choix de la souveraineté numérique. Pas de carte bancaire, payable simplement avec Orange Money.
          </p>

          <div className="space-y-3 pt-4">
            {[
              "Hébergement local sécurisé à Ouagadougou 🇧🇫",
              "Sauvegarde cryptée automatique de vos photos WhatsApp",
              "Paiement annuel ultra-flexible sans carte bleue",
            ].map((text, idx) => (
              <div key={idx} className="flex gap-3 text-sm text-gray-200/90 font-medium">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 z-10 flex justify-between items-center text-xs text-gray-300">
          <p>© 2026 WAYA Cloud BF. Tous droits réservés.</p>
          <p className="font-semibold text-accent">Hébergé au Burkina Faso 🇧🇫</p>
        </div>
      </div>

      {/* Right side: Multistep form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-10">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primaryLight flex items-center justify-center text-primary border border-primary/20 shadow-md">
                <Cloud className="w-7 h-7" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-textPrimary tracking-tight">
              Créer mon compte
            </h2>
            <p className="text-sm text-textSecondary mt-2">
              Commencez en 1 minute. Aucun moyen de paiement requis pour l'offre gratuite.
            </p>
          </div>

          {/* Stepper Header */}
          <div className="flex items-center gap-4 bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
            {[
              { num: 1, label: 'Identité' },
              { num: 2, label: 'Mobile' },
              { num: 3, label: 'Sécurité' }
            ].map((s) => (
              <div key={s.num} className="flex-1 flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold leading-none transition-all ${
                  step > s.num ? 'bg-primary text-white' :
                  step === s.num ? 'bg-primaryLight text-primary ring-2 ring-primary/20' :
                  'bg-white text-gray-400 border border-gray-200'
                }`}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${
                  step === s.num ? 'text-textPrimary font-extrabold' : 'text-gray-400'
                }`}>{s.label}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold p-4 rounded-xl border border-red-100 animate-shake">
              {error}
            </div>
          )}

          {/* Step 1: Identity */}
          {step === 1 && (
            <form onSubmit={nextStep} className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">
                  Nom Complet
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Oumar Traoré"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-textPrimary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">
                  Adresse Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="oumar@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-textPrimary"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-3.5 bg-primary hover:bg-[#0F6E56] text-white font-bold shadow-lg shadow-primary/20 flex justify-center items-center gap-2">
                Suivant
                <ChevronRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* Step 2: Phone */}
          {step === 2 && (
            <form onSubmit={nextStep} className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-3">
                  Opérateur Mobile Principal
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setCarrier('orange')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      carrier === 'orange' 
                        ? 'border-[#FF6600] bg-[#FF6600]/5 text-[#FF6600] font-bold shadow-sm' 
                        : 'border-gray-200 text-textSecondary hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#FF6600] text-white flex items-center justify-center font-bold text-lg">
                      OM
                    </div>
                    <span className="text-xs">Orange Money</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCarrier('moov')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      carrier === 'moov' 
                        ? 'border-[#008080] bg-[#008080]/5 text-[#008080] font-bold shadow-sm' 
                        : 'border-gray-200 text-textSecondary hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#008080] text-white flex items-center justify-center font-bold text-lg">
                      MM
                    </div>
                    <span className="text-xs">Moov Money</span>
                  </button>
                </div>
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
                    placeholder="76 XX XX XX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className="block w-full pl-14 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-textPrimary"
                  />
                </div>
                <p className="text-[10px] text-textSecondary mt-2">
                  Nécessaire pour le backup et vos validations de paiement locaux.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button type="button" variant="outline" onClick={prevStep} className="py-3.5 text-textPrimary font-semibold">
                  Retour
                </Button>
                <Button type="submit" className="py-3.5 bg-primary hover:bg-[#0F6E56] text-white font-bold shadow-lg shadow-primary/20 flex justify-center items-center gap-2">
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Password & Security */}
          {step === 3 && (
            <form onSubmit={handleRegister} className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">
                  Créer un Mot de passe
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-textPrimary"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="agree_terms"
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 mt-0.5 text-primary focus:ring-primary/20 border-gray-300 rounded shrink-0 cursor-pointer"
                />
                <label htmlFor="agree_terms" className="ml-2.5 block text-xs font-semibold text-textSecondary leading-relaxed cursor-pointer select-none">
                  J'accepte les conditions d'utilisation et certifie héberger mes fichiers numériques conformément à la législation sur la souveraineté des données du Burkina Faso.
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button type="button" variant="outline" onClick={prevStep} className="py-3.5 text-textPrimary font-semibold" disabled={isLoading}>
                  Retour
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="py-3.5 bg-primary hover:bg-[#0F6E56] text-white font-bold shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Création...
                    </>
                  ) : (
                    'Commencer (2 Go)'
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="text-center text-sm text-textSecondary pt-4">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
