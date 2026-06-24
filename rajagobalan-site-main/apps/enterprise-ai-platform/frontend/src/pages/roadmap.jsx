import React, { useState } from 'react';
import Layout from '../components/Layout';
import { generateRoadmap } from '../utils/api';
import { DEMO_COMPANY_ID, MATURITY_LEVELS } from '../utils/constants';

const DURATION_OPTIONS = [
  { value: 6, label: '6 Months (Accelerated)' },
  { value: 12, label: '12 Months (Standard)' },
  { value: 18, label: '18 Months (Comprehensive)' },
  { value: 24, label: '24 Months (Multi-Year)' },
  { value: 36, label: '36 Months (Strategic)' },
];

export default function Roadmap() {
  const [duration, setDuration] = useState(12);
  const [maturityLevel, setMaturityLevel] = useState('Developing');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const payload = {
        company_id: DEMO_COMPANY_ID,
        duration_months: parseInt(duration),
        maturity_level: maturityLevel,
      };

      const data = await generateRoadmap(payload);
      setRoadmap(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  const getPhaseStyles = (index) => {
    const styles = [
      {
        border: 'border-teal-200',
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        dot: 'bg-teal-400',
        gradient: 'from-teal-500 to-teal-600',
        icon: 'text-teal-500'
      },
      {
        border: 'border-blue-200',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        dot: 'bg-blue-400',
        gradient: 'from-blue-500 to-blue-600',
        icon: 'text-blue-500'
      },
      {
        border: 'border-indigo-200',
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        dot: 'bg-indigo-400',
        gradient: 'from-indigo-500 to-indigo-600',
        icon: 'text-indigo-500'
      },
      {
        border: 'border-purple-200',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        dot: 'bg-purple-400',
        gradient: 'from-purple-500 to-purple-600',
        icon: 'text-purple-500'
      },
      {
        border: 'border-pink-200',
        bg: 'bg-pink-50',
        text: 'text-pink-700',
        dot: 'bg-pink-400',
        gradient: 'from-pink-500 to-pink-600',
        icon: 'text-pink-500'
      }
    ];
    return styles[index % styles.length];
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transformation Roadmap</h1>
        <p className="text-gray-600 mt-2">Generate a phased implementation plan tailored to your maturity and timeline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Plan Settings</h2>
            
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Duration</label>
                <div className="space-y-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="duration"
                        value={opt.value}
                        checked={duration === opt.value}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700 font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Maturity</label>
                <select
                  value={maturityLevel}
                  onChange={(e) => setMaturityLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                >
                  {MATURITY_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i> Generating Plan...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-magic mr-2"></i> Generate Roadmap
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Roadmap Display */}
        <div className="lg:col-span-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <i className="fas fa-exclamation-circle mr-2"></i>{error}
            </div>
          )}

          {!roadmap && !loading && !error && (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 h-96 flex flex-col items-center justify-center text-gray-500">
              <i className="fas fa-route text-4xl mb-4 text-gray-300"></i>
              <p className="text-lg">Select duration and generate your transformation roadmap.</p>
            </div>
          )}

          {roadmap && roadmap.phases && (
            <div className="space-y-8 relative">
              {/* Connecting Line for Timeline */}
              <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200 hidden md:block"></div>

              {roadmap.phases.map((phase, index) => {
                const styles = getPhaseStyles(index);

                return (
                  <div key={index} className="relative pl-0 md:pl-24 group">
                    {/* Phase Marker (Timeline Dot) */}
                    <div className={`absolute left-0 top-0 w-16 h-16 rounded-full border-4 border-white shadow-md bg-gradient-to-br ${styles.gradient} z-10 hidden md:flex items-center justify-center text-white font-bold text-xl`}>
                      {phase.phase_number}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      {/* Phase Header */}
                      <div className={`px-6 py-4 border-b ${styles.border} ${styles.bg} flex justify-between items-start flex-wrap gap-4`}>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                              {phase.phase_number}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900">{phase.name}</h3>
                          </div>
                          <p className="text-gray-600">{phase.description}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                          <i className="far fa-clock text-gray-400"></i>
                          <span className="font-semibold text-gray-900">{phase.duration_months} Months</span>
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Milestones */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                            <i className="fas fa-flag-checkered text-gray-400 mr-2"></i> Key Milestones
                          </h4>
                          <div className="space-y-4">
                            {phase.milestones.map((milestone, mIndex) => (
                              <div key={mIndex} className="relative pl-4 border-l-2 border-gray-100">
                                <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${styles.dot} ring-4 ring-white`}></div>
                                <h5 className="font-semibold text-gray-900 text-sm">{milestone.name}</h5>
                                <p className="text-xs text-gray-500 mt-0.5">{milestone.description}</p>
                                <span className="inline-block mt-1 text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                  Week {milestone.timeline_weeks}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Deliverables */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                            <i className="fas fa-box-open text-gray-400 mr-2"></i> Key Deliverables
                          </h4>
                          <ul className="space-y-2">
                            {phase.deliverables.map((item, dIndex) => (
                              <li key={dIndex} className="flex items-start text-sm text-gray-600">
                                <i className={`fas fa-check-circle mt-0.5 mr-2 ${styles.icon} opacity-75`}></i>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
