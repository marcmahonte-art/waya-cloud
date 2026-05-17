'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cloud, Lock, Phone, ArrowLeft, Loader2, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUser } from '@/context/UserContext';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPhone, verifyOTP } = useUser();

  // Authentication Flow States
  // 'phone' = enter phone number, 'otp' = enter 6-digit verification code
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // UX Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // 1. Send OTP SMS
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      setError('Veuillez entrer un numéro de téléphone burkinabè valide à 8 chiffres.');
      return;
    }
    setError(null);
    setInfoMessage(null);
    setIsLoading(true);

    try {
      const res = await loginWithPhone(phoneNumber);
      setIsLoading(false);
      if (res.success) {
        setAuthStep('otp');
        if (res.message) {
          // If in simulator fallback mode, show the generated OTP code in an informative box
          setInfoMessage(res.message);
        }
      } else {
        setError(res.error || "Impossible d'envoyer le code SMS.");
      }
    } catch (err: any) {
      setIsLoading(false);
      setError("Une erreur est survenue lors de la connexion.");
    }
  };

  // 2. Verify OTP SMS
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('Veuillez renseigner le code de vérification à 6 chiffres.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await verifyOTP(phoneNumber, otpCode);
      setIsLoading(false);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setError(res.error || "Code de validation incorrect.");
      }
    } catch (err: any) {
      setIsLoading(false);
      setError("Erreur lors de la validation du code.");
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-textPrimary">
      {/* Back to Home Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-textSecondary hover:text-primary transition-colors z-30 animate-fade-in"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à l'accueil
      </Link>

      {/* Left side: Premium Slogans Info (Hidden on mobile) */}
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
            Supabase Secure Auth OTP
          </div>
          <h1 className="text-4xl xl:text-5xl font-black leading-tight">
            Sécurité souveraine par validation SMS.
          </h1>
          <p className="text-base text-gray-200/90 leading-relaxed max-w-lg">
            Plus besoin de mot de passe à retenir. Connectez-vous de manière sécurisée en recevant un code OTP temporaire à 6 chiffres directement sur votre téléphone burkinabè.
          </p>
        </div>

        <div className="pt-8 border-t border-white/10 z-10 flex justify-between items-center text-xs text-gray-300">
          <p>© 2026 WAYA Cloud BF. Tous droits réservés.</p>
          <p className="font-semibold text-accent">Hébergement Souverain 🇧🇫</p>
        </div>
      </div>

      {/* Right side: Login / OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primaryLight flex items-center justify-center text-primary border border-primary/20 shadow-md">
                <Cloud className="w-7 h-7" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-textPrimary tracking-tight">
              {authStep === 'phone' ? 'Se connecter' : 'Vérification SMS'}
            </h2>
            <p className="text-sm text-textSecondary mt-2">
              {authStep === 'phone' 
                ? 'Renseignez votre numéro de téléphone pour recevoir le code de connexion OTP.'
                : `Entrez le code de vérification à 6 chiffres envoyé au +226 ${phoneNumber}.`
              }
            </p>
          </div>

          {/* Feedback boxes */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold p-4 rounded-xl border border-red-100 animate-shake">
              {error}
            </div>
          )}

          {infoMessage && (
            <div className="bg-green-50 text-green-700 text-xs font-bold p-4 rounded-xl border border-green-150 flex items-start gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
              <p className="leading-relaxed">{infoMessage}</p>
            </div>
          )}

          {/* STEP 1: Phone input */}
          {authStep === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">
                  Numéro de Téléphone (Burkina Faso)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-bold text-gray-400 select-none">
                    +226
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="76 XX XX XX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className="block w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-textPrimary"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3.5 bg-primary hover:bg-[#0F6E56] text-white font-bold shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi du code...
                  </>
                ) : (
                  'Recevoir le code par SMS'
                )}
              </Button>
            </form>
          )}

          {/* STEP 2: OTP Verification input */}
          {authStep === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">
                  Code de vérification (6 chiffres)
                </label>
                <input
                  type="text"
                  required
                  placeholder="123456"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="block w-full text-center tracking-[0.5em] text-lg font-bold py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-textPrimary"
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3.5 bg-primary hover:bg-[#0F6E56] text-white font-bold shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    'Confirmer et Se connecter'
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setAuthStep('phone')}
                  className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-textPrimary text-xs font-bold rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                  Modifier le numéro de téléphone
                </button>
              </div>
            </form>
          )}

          <div className="text-center text-sm text-textSecondary pt-4">
            Nouveau sur WAYA ?{' '}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Créer mon compte gratuitement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
