
import React, { forwardRef } from 'react';

const SectionCard = forwardRef(({ title, icon, description, children }, ref) => {
  return (
    <section ref={ref} className="mb-8">
      {/* iOS Grouped List Header (Title Outside Card) */}
      <div className="px-4 mb-2 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider flex items-center gap-2">
          {icon && <span className="opacity-80 scale-75 transform origin-left">{icon}</span>}
          {title}
        </h2>
      </div>

      {description && (
        <p className="px-4 mb-3 text-[13px] text-[#8E8E93] leading-snug">{description}</p>
      )}

      {/* Card Container */}
      <div className="bg-[#1C1C1E] rounded-[20px] p-4 sm:p-5">
        {children}
      </div>
    </section>
  );
});

export default SectionCard;
