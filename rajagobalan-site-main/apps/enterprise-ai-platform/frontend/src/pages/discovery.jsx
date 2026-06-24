import React, { useState } from 'react';
import Layout from '../components/Layout';
import { generateDiscovery } from '../utils/api';
import { DEMO_COMPANY_ID, QUADRANT_COLORS } from '../utils/constants';

export default function Discovery() {
  const [industry, setIndustry] = useState('');
  const [problems, setProblems] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!industry || !problems) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const problemList = problems.split('\n').filter(p => p.trim());
      const data = await generateDiscovery({
        company_id: DEMO_COMPANY_ID,
        industry,
        business_problems: problemList
      });
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to generate use cases');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discovery Engine</h1>
        <p className="text-gray-600 mt-2">Identify high-impact AI opportunities tailored to your industry challenges.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Input Parameters</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Retail, Healthcare, Finance"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Problems</label>
                <p className="text-xs text-gray-500 mb-2">One problem per line</p>
                <textarea
                  value={problems}
                  onChange={(e) => setProblems(e.target.value)}
                  placeholder="High customer churn&#10;Inefficient inventory management&#10;Slow claims processing"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-sky-600 hover:bg-sky-700 shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i> Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-wand-magic-sparkles mr-2"></i> Generate Opportunities
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          {!results && !loading && !error && (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center h-full flex flex-col items-center justify-center text-gray-500">
              <i className="fas fa-lightbulb text-4xl mb-4 text-gray-300"></i>
              <p className="text-lg">Enter your industry and challenges to discover AI use cases.</p>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Identified Opportunities <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{results.opportunities.length} found</span>
                </h2>
              </div>

              <div className="grid gap-6">
                {results.opportunities.map((opp, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{opp.use_case}</h3>
                          <span 
                            className="text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide"
                            style={{ 
                              backgroundColor: QUADRANT_COLORS[opp.quadrant] ? `${QUADRANT_COLORS[opp.quadrant]}20` : '#f3f4f6',
                              color: QUADRANT_COLORS[opp.quadrant] || '#6b7280'
                            }}
                          >
                            {opp.quadrant.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{opp.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">{opp.expected_roi}%</div>
                        <div className="text-xs text-gray-500 uppercase font-medium">ROI</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Prediction Target</div>
                        <div className="font-medium text-sm text-gray-800">{opp.prediction_target || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Impact</div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2 max-w-[60px]">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${opp.impact_score}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{opp.impact_score}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Feasibility</div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2 max-w-[60px]">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${opp.feasibility_score}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{opp.feasibility_score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
