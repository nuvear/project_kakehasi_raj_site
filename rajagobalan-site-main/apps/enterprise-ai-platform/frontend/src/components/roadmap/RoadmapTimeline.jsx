import React from 'react';
import { PHASE_COLORS } from '../../utils/constants';

const phaseColorMap = {
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-300',
    header: 'bg-teal-500',
    text: 'text-teal-900',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    header: 'bg-blue-500',
    text: 'text-blue-900',
  },
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-300',
    header: 'bg-indigo-500',
    text: 'text-indigo-900',
  },
};

export default function RoadmapTimeline({ phases }) {
  if (!phases || phases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No phases to display</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4 mt-8">
        {phases.map((phase, index) => {
          const colorKey = PHASE_COLORS[index + 1] || 'teal';
          const colors = phaseColorMap[colorKey];

          return (
            <div key={index} className="flex-1 relative">
              {/* Connecting line to next phase */}
              {index < phases.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-2 w-4 h-0.5 bg-gray-300" />
              )}

              {/* Phase Card */}
              <div className={`${colors.bg} border-2 ${colors.border} rounded-lg overflow-hidden shadow-lg h-full`}>
                {/* Phase Header */}
                <div className={`${colors.header} text-white px-6 py-4`}>
                  <h3 className="text-xl font-bold">{phase.name}</h3>
                  <p className="text-sm opacity-90 mt-1">
                    {phase.duration} months
                  </p>
                </div>

                {/* Phase Content */}
                <div className="p-6">
                  {/* Description */}
                  {phase.description && (
                    <div className="mb-6">
                      <p className={`text-sm ${colors.text}`}>
                        {phase.description}
                      </p>
                    </div>
                  )}

                  {/* Milestones */}
                  {phase.milestones && phase.milestones.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3 text-sm">
                        Milestones
                      </h4>
                      <ul className="space-y-2">
                        {phase.milestones.map((milestone, idx) => (
                          <li
                            key={idx}
                            className="flex items-start text-sm text-gray-700"
                          >
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 mr-3 flex-shrink-0 mt-0.5">
                              <svg
                                className="h-3 w-3 text-gray-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                            <span>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Deliverables */}
                  {phase.deliverables && phase.deliverables.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 text-sm">
                        Deliverables
                      </h4>
                      <ul className="space-y-2">
                        {phase.deliverables.map((deliverable, idx) => (
                          <li
                            key={idx}
                            className="flex items-start text-sm text-gray-700"
                          >
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 mr-3 flex-shrink-0 mt-0.5">
                              <svg
                                className="h-3 w-3 text-gray-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
