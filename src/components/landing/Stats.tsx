import React from 'react';

const stats = [
  { label: "fichiers protégés", value: "10 000+" },
  { label: "villes lancées", value: "2" },
  { label: "par mois seulement", value: "125 F" },
  { label: "Données à Ouaga", value: "Souverain" }
];

export const Stats = () => {
  return (
    <section className="bg-primaryDark py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-primaryLight/80 uppercase tracking-wider font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
