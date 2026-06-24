import React from 'react';

const colorVariants = {
  blue: {
    border: 'border-l-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-900',
  },
  green: {
    border: 'border-l-green-600',
    bg: 'bg-green-50',
    text: 'text-green-900',
  },
  purple: {
    border: 'border-l-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-900',
  },
  indigo: {
    border: 'border-l-indigo-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
  },
  red: {
    border: 'border-l-red-600',
    bg: 'bg-red-50',
    text: 'text-red-900',
  },
  amber: {
    border: 'border-l-amber-600',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
  },
};

export default function KPICard({ title, value, subtitle, color = 'blue', icon }) {
  const colorClass = colorVariants[color] || colorVariants.blue;

  return (
    <div className={`${colorClass.bg} border-l-4 ${colorClass.border} rounded-lg p-6 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`${colorClass.text} text-3xl font-bold mt-2`}>{value}</p>
          <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
        </div>
        {icon && (
          <div className={`${colorClass.text} opacity-20`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
