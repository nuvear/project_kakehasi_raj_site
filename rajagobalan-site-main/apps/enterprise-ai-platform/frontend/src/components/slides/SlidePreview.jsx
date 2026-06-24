import React from 'react';

const slideContent = {
  'Executive Summary': {
    icon: '📊',
    color: 'bg-blue-50 border-blue-200',
    description: 'High-level overview of AI strategy and key objectives',
  },
  'Maturity Assessment': {
    icon: '📈',
    color: 'bg-purple-50 border-purple-200',
    description: 'Current state assessment across 6 maturity domains',
  },
  'Portfolio Overview': {
    icon: '🎯',
    color: 'bg-green-50 border-green-200',
    description: 'Overview of AI projects and initiatives',
  },
  'ROI Analysis': {
    icon: '💰',
    color: 'bg-amber-50 border-amber-200',
    description: 'Financial impact and ROI projections',
  },
  'Roadmap': {
    icon: '🛤️',
    color: 'bg-indigo-50 border-indigo-200',
    description: 'Phased transformation timeline and milestones',
  },
  'Architecture': {
    icon: '🏗️',
    color: 'bg-rose-50 border-rose-200',
    description: 'Technology architecture and infrastructure requirements',
  },
  'Recommendations': {
    icon: '💡',
    color: 'bg-cyan-50 border-cyan-200',
    description: 'Strategic recommendations and next steps',
  },
};

export default function SlidePreview({ sections }) {
  if (!sections || sections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Select sections above to see slide preview</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sections.map((section, idx) => {
        const content = slideContent[section] || {
          icon: '📄',
          color: 'bg-gray-50 border-gray-200',
          description: 'Custom slide content',
        };

        return (
          <div
            key={idx}
            className={`border-2 ${content.color} rounded-lg p-6 hover:shadow-lg transition duration-200`}
          >
            <div className="mb-4 text-3xl">{content.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              Slide {idx + 1}: {section}
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              {content.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
