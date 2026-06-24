import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getProjects, generateWardley } from '../utils/api';
import { DEMO_COMPANY_ID, WARDLEY_RECOMMENDATIONS } from '../utils/constants';

export default function Wardley() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects(DEMO_COMPANY_ID);
        setProjects(data);
        if (data.length > 0) setSelectedProject(data[0].id);
      } catch (err) {
        console.error('Failed to load projects', err);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        company_id: DEMO_COMPANY_ID,
        project_id: selectedProject || null,
      };
      
      const data = await generateWardley(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Wardley Mapping</h1>
        <p className="text-gray-600 mt-2">Strategize your build vs. buy decisions with evolutionary context.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Map Configuration</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Context Project (Optional)</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                >
                  <option value="">-- General Strategy --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i> Mapping...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-map-marked-alt mr-2"></i> Generate Map
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Strategic Recommendations */}
          {result && (
            <div className="mt-6 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-l-4 border-l-blue-500">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <i className="fas fa-tools text-blue-500 mr-2"></i> Build Recommendations
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {result.build_recommendations?.map((rec, i) => (
                    <li key={i}>• {rec.item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-l-4 border-l-emerald-500">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <i className="fas fa-shopping-cart text-emerald-500 mr-2"></i> Buy Recommendations
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {result.buy_recommendations?.map((rec, i) => (
                    <li key={i}>• {rec.item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-l-4 border-l-amber-500">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <i className="fas fa-handshake text-amber-500 mr-2"></i> Partner Recommendations
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {result.partner_recommendations?.map((rec, i) => (
                    <li key={i}>• {rec.item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Map Visualization */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!result && !loading && !error && (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 h-[600px] flex flex-col items-center justify-center text-gray-500">
              <i className="fas fa-map text-4xl mb-4 text-gray-300"></i>
              <p className="text-lg">Generate a Wardley Map to visualize strategy.</p>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[600px] relative flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Value Chain Evolution</h2>
              
              <div className="flex-grow relative border-l-2 border-b-2 border-gray-300 m-8 bg-gradient-to-r from-gray-50 to-white">
                {/* Y-Axis Label */}
                <div className="absolute -left-12 top-1/2 -rotate-90 text-sm font-semibold text-gray-500 tracking-wider">VISIBILITY / VALUE CHAIN</div>
                
                {/* X-Axis Labels (Evolution Stages) */}
                <div className="absolute bottom-[-40px] left-0 w-full flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">
                  <div className="w-1/4 text-center">Genesis</div>
                  <div className="w-1/4 text-center">Custom Built</div>
                  <div className="w-1/4 text-center">Product (+Rental)</div>
                  <div className="w-1/4 text-center">Commodity (+Utility)</div>
                </div>

                {/* Evolution Stage Dividers */}
                <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
                  <div className="border-r border-dashed border-gray-200"></div>
                  <div className="border-r border-dashed border-gray-200"></div>
                  <div className="border-r border-dashed border-gray-200"></div>
                  <div></div>
                </div>

                {/* Components */}
                {result.components.map((comp, idx) => {
                  // Map stage string to X coordinate range
                  let xBase = 0;
                  if (comp.evolution_stage === 'custom_built') xBase = 25;
                  if (comp.evolution_stage === 'product') xBase = 50;
                  if (comp.evolution_stage === 'commodity') xBase = 75;
                  
                  // Add random jitter to avoid overlap if needed, or static for now
                  const xPos = xBase + 12.5; 
                  const yPos = comp.visibility * 100;

                  return (
                    <div
                      key={idx}
                      className="absolute transform -translate-x-1/2 translate-y-1/2 group cursor-pointer"
                      style={{
                        left: `${xPos}%`,
                        bottom: `${yPos}%`
                      }}
                    >
                      <div className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-md group-hover:scale-125 transition-transform"></div>
                      <span className="absolute left-6 top-[-4px] text-xs font-bold text-gray-800 whitespace-nowrap bg-white/80 px-1 rounded backdrop-blur-sm">
                        {comp.name}
                      </span>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-md py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        <p className="font-bold">{comp.name}</p>
                        <p className="opacity-80 mt-1">{comp.description}</p>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
