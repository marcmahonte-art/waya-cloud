import React from 'react';
import { Shield, Smartphone, Wallet } from 'lucide-react';
import { Card } from '../ui/Card';

const features = [
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "100% souverain",
    description: "Vos données restent en Afrique, pas sur des serveurs américains. Une infrastructure locale pour une sécurité maximale."
  },
  {
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: "Backup WhatsApp en 1 clic",
    description: "Même si on vole ton téléphone, tu gardes tout. Photos, vidéos et conversations sont en sécurité chez nous."
  },
  {
    icon: <Wallet className="w-8 h-8 text-primary" />,
    title: "Payable Orange Money",
    description: "125 F par mois seulement. Aucune carte bancaire nécessaire, payez avec votre solde mobile habituel."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
            Pourquoi choisir WAYA ?
          </h2>
          <p className="text-textSecondary max-w-2xl mx-auto">
            La première solution de stockage cloud pensée pour et par les Burkinabè.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-primaryLight rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-textSecondary leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
