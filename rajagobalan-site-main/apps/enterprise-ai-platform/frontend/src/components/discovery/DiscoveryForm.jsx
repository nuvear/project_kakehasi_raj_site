import React, { useState } from 'react';
import { INDUSTRIES } from '../../utils/constants';

export default function DiscoveryForm({ onSubmit, loading }) {
  const [industry, setIndustry] = useState('');
  const [businessProblems, setBusinessProblems] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!industry.trim() || !businessProblems.trim()) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit({
      industry,
      businessProblems: businessProblems
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Industry Dropdown */}
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
          Industry
        </label>
        <select
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          <option value="">Select an industry...</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* Business Problems Textarea */}
      <div>
        <label htmlFor="problems" className="block text-sm font-medium text-gray-700 mb-2">
          Business Problems
        </label>
        <p className="text-xs text-gray-500 mb-2">Enter one problem per line</p>
        <textarea
          id="problems"
          value={businessProblems}
          onChange={(e) => setBusinessProblems(e.target.value)}
          disabled={loading}
          placeholder="e.g.&#10;High customer churn rate&#10;Manual data entry errors&#10;Slow order processing"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          rows="6"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Generating Opportunities...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Generate AI Opportunities
          </>
        )}
      </button>
    </form>
  );
}
