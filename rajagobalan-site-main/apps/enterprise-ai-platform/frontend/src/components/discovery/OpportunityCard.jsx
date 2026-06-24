import React, { useState } from 'react';
import { QUADRANT_COLORS } from '../../utils/constants';

const complexityColors = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};

export default function OpportunityCard({ opportunity, onAddToPortfolio }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      await onAddToPortfolio(opportunity);
    } finally {
      setIsAdding(false);
    }
  };

  // Determine quadrant based on impact and feasibility scores
  const quadrant = getQuadrant(opportunity.impact_score, opportunity.feasibility_score);
  const quadrantColor = QUADRANT_COLORS[quadrant] || '#999';

  // Format expected ROI as currency
  const formattedROI = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(opportunity.expected_roi || 0);

  const complexityColor = complexityColors[opportunity.complexity] || complexityColors.Medium;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col h-full">
      {/* Use Case Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{opportunity.use_case}</h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        {opportunity.description}
      </p>

      {/* Prediction Target */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 font-medium">PREDICTION TARGET</p>
        <p className="text-sm text-gray-800 font-semibold">{opportunity.prediction_target}</p>
      </div>

      {/* Expected ROI */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-xs text-gray-500 font-medium">EXPECTED ROI</p>
        <p className="text-xl font-bold text-green-600">{formattedROI}</p>
      </div>

      {/* Badges Row */}
      <div className="flex gap-2 mb-4">
        {/* Complexity Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${complexityColor}`}>
          {opportunity.complexity} Complexity
        </span>

        {/* Quadrant Badge */}
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: quadrantColor }}
        >
          {quadrant}
        </span>
      </div>

      {/* Score Bars */}
      <div className="mb-6 space-y-3">
        {/* Impact Score */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-semibold text-gray-700">Impact Score</p>
            <p className="text-xs font-semibold text-gray-600">
              {Math.round(opportunity.impact_score)}/10
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(opportunity.impact_score / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Feasibility Score */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-semibold text-gray-700">Feasibility Score</p>
            <p className="text-xs font-semibold text-gray-600">
              {Math.round(opportunity.feasibility_score)}/10
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${(opportunity.feasibility_score / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add to Portfolio Button */}
      <button
        onClick={handleAdd}
        disabled={isAdding}
        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
            Adding...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add to Portfolio
          </>
        )}
      </button>
    </div>
  );
}

// Helper function to determine quadrant
function getQuadrant(impact, feasibility) {
  if (impact >= 5 && feasibility >= 5) {
    return 'Strategic';
  } else if (impact < 5 && feasibility >= 5) {
    return 'Quick Wins';
  } else if (impact >= 5 && feasibility < 5) {
    return 'Fill-ins';
  } else {
    return 'Low Priority';
  }
}
