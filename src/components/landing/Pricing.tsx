import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

const plans = [
  {
    name: "Gratuit",
    price: "0 F",
    period: "/ mois",
    storage: "2 Go offerts",
    subtext: "Puis 3 Go après 2 mois",
    features: ["Backup WhatsApp basique", "Accès mobile & web", "Support email"],
    buttonVariant: "outline" as const
  },
  {
    name: "Sauve WhatsApp",
    price: "1 500 F",
    period: "/ an",
    calc: "125 F/mois seulement",
    storage: "20 Go",
    popular: true,
    features: ["Backup WhatsApp illimité", "Vidéos HD incluses", "Restauration prioritaire", "Support WhatsApp 24/7"],
    buttonVariant: "primary" as const
  },
  {
    name: "Famille",
    price: "3 999 F",
    period: "/ an",
    calc: "333 F/mois seulement",
    storage: "50 Go",
    features: ["Jusqu'à 5 comptes", "Partage de fichiers", "Album partagé sécurisé", "Documents officiels BF"],
    buttonVariant: "outline" as const
  },
  {
    name: "Pro Village",
    price: "6 999 F",
    period: "/ an",
    calc: "583 F/mois seulement",
    storage: "100 Go",
    features: ["Stockage ultra-sécurisé", "Reçus Mobile Money", "Espace client dédié", "Assistance VIP"],
    buttonVariant: "outline" as const
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
            Un tarif simple, sans surprise.
          </h2>
          <p className="text-textSecondary">
            Payez par Orange Money. Pas besoin de carte bancaire.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative flex flex-col ${plan.popular ? 'border-primary ring-1 ring-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="accent" className="bg-primary text-white text-[10px] uppercase tracking-wider px-3">Populaire</Badge>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-textPrimary mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  <span className="text-sm text-textSecondary">{plan.period}</span>
                </div>
                {plan.calc && (
                  <div className="text-xs text-primary font-medium mt-1">= {plan.calc}</div>
                )}
              </div>

              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="text-2xl font-bold text-textPrimary">{plan.storage}</div>
                <div className="text-xs text-textSecondary mt-1">{plan.subtext || "Espace sécurisé"}</div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex gap-3 text-sm text-textSecondary">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register" className="w-full">
                <Button variant={plan.buttonVariant} className="w-full">
                  Choisir ce plan
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
