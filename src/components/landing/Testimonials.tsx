import React from 'react';
import { Quote } from 'lucide-react';
import { Card } from '../ui/Card';

const testimonials = [
  {
    name: "Aminata B.",
    role: "Commerçante à Sankar Yaaré",
    content: "Enfin une solution où je peux payer avec Orange Money. Je ne perds plus mes photos de produits quand je change de téléphone."
  },
  {
    name: "Oumar T.",
    role: "Étudiant, Ouagadougou",
    content: "C'est rapide et sécurisé. Savoir que mes documents sont stockés ici au pays me rassure énormément."
  },
  {
    name: "Fatou K.",
    role: "Entrepreneure, Bobo-Dioulasso",
    content: "Le backup WhatsApp automatique est un game-changer. Plus besoin de s'inquiéter pour les messages importants."
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Ils nous font confiance</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-primaryLight/30 border-none">
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-textPrimary italic mb-6 leading-relaxed">
                "{t.content}"
              </p>
              <div>
                <div className="font-bold text-textPrimary">{t.name}</div>
                <div className="text-sm text-textSecondary">{t.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
