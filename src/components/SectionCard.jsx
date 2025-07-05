
import React from 'react';

function SectionCard({ title, icon, description, children, bgColor, borderColor, textColor }) {
  return (
    <section className={`mb-8 p-6 ${bgColor} rounded-2xl shadow-lg border ${borderColor}`}>
      <h2 className={`text-3xl font-extrabold ${textColor || 'text-gray-100'} mb-3 flex items-center`}>
        {icon}
        {title}
      </h2>
      {description && <p className="text-gray-400 mb-4 text-md">{description}</p>}
      {children}
    </section>
  );
}

export default SectionCard;
