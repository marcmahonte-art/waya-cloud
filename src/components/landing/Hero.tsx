import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { CheckCircle2, Play } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-textPrimary leading-tight mb-6">
            Tes souvenirs méritent mieux qu'un serveur étranger.
          </h1>
          <p className="text-xl text-textSecondary mb-8 max-w-lg">
            Sauvegarde tes photos WhatsApp, tes documents et ta vie numérique. 
            Stocké au <span className="text-primary font-semibold">Burkina Faso</span>. 
            Payable par <span className="text-[#FF6600] font-semibold">Orange Money</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                Commencer gratuitement — 2 Go offerts
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2">
              <Play className="w-5 h-5 fill-current" />
              Voir comment ça marche
            </Button>
          </div>

          <div className="flex items-center gap-6 text-sm text-textSecondary">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Souveraineté totale</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Paiement local</span>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Mockup Téléphone Android */}
          <div className="relative mx-auto w-[280px] h-[580px] bg-gray-900 rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden">
            {/* Écran WhatsApp Backup */}
            <div className="absolute inset-0 bg-[#0b141a] text-white p-6 font-sans">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="font-bold">W</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-400">Sauvegarde WhatsApp</div>
                  <div className="text-xs text-gray-500">En cours...</div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-800/50 p-4 rounded-xl">
                  <div className="text-sm mb-2 text-gray-300">Progression globale</div>
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3 transition-all duration-1000"></div>
                  </div>
                  <div className="mt-2 text-right text-xs text-primary">67%</div>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">
                      <div className="w-8 h-8 bg-gray-700 rounded-md"></div>
                      <div className="flex-1">
                        <div className="h-2 w-20 bg-gray-600 rounded mb-2"></div>
                        <div className="h-1.5 w-32 bg-gray-700 rounded"></div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Caméra selfie */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-800 rounded-full"></div>
          </div>

          {/* Éléments décoratifs */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full"></div>
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/20 blur-2xl rounded-full"></div>
        </div>
      </div>
    </section>
  );
};
