import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getProjects, generateArchitecture } from '../utils/api';
import { DEMO_COMPANY_ID } from '../utils/constants';

const ARCHITECTURE_TYPES = [
  { id: 'batch', label: 'Batch Processing', icon: 'fa-layer-group', description: 'Process large volumes of data on a schedule.' },
  { id: 'real_time', label: 'Real-Time Serving', icon: 'fa-bolt', description: 'Instant predictions for online applications.' },
  { id: 'hybrid', label: 'Hybrid Architecture', icon: 'fa-random', description: 'Combined batch training with real-time serving.' },
];

export default function Architecture() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedType, setSelectedType] = useState('batch');
  const [options, setOptions] = useState({
    include_monitoring: true,
    include_feature_store: true,
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch projects for dropdown
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
    if (!selectedProject) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const project = projects.find(p => p.id === selectedProject);
      const payload = {
        project_id: selectedProject,
        project_name: project?.name || 'Unknown Project',
        architecture_type: selectedType,
        ...options
      };

      const data = await generateArchitecture(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSVG = () => {
    if (!result?.diagram_svg) return;
    const blob = new Blob([result.diagram_svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `architecture-${selectedType}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Architecture Generator</h1>
        <p className="text-gray-600 mt-2">Design production-ready ML pipelines tailored to your use case.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuration</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Project</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                  disabled={projects.length === 0}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {projects.length === 0 && <p className="text-xs text-red-500 mt-1">No projects found. Create one first.</p>}
              </div>

              {/* Architecture Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                <div className="space-y-3">
                  {ARCHITECTURE_TYPES.map(type => (
                    <div 
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedType === type.id 
                          ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <i className={`fas ${type.icon} ${selectedType === type.id ? 'text-sky-600' : 'text-gray-400'} mr-2`}></i>
                        <span className={`font-medium ${selectedType === type.id ? 'text-sky-900' : 'text-gray-900'}`}>
                          {type.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 ml-6">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Components</label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.include_monitoring}
                    onChange={(e) => setOptions({...options, include_monitoring: e.target.checked})}
                    className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Include Monitoring & Logging</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.include_feature_store}
                    onChange={(e) => setOptions({...options, include_feature_store: e.target.checked})}
                    className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Include Feature Store</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedProject}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all shadow-sm ${
                  loading || !selectedProject
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i> Designing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-drafting-compass mr-2"></i> Generate Blueprint
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <i className="fas fa-exclamation-circle mt-1 mr-2"></i>
              <div>{error}</div>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 h-full min-h-[400px] flex flex-col items-center justify-center text-gray-500 p-8 text-center">
              <i className="fas fa-sitemap text-5xl mb-4 text-gray-300"></i>
              <h3 className="text-lg font-medium text-gray-900">No Architecture Generated</h3>
              <p className="max-w-md mt-2">Select a project and architecture pattern to generate a comprehensive ML system blueprint.</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in space-y-6">
              {/* Diagram */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">System Diagram</h3>
                  <button 
                    onClick={handleDownloadSVG}
                    className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center"
                  >
                    <i className="fas fa-download mr-1"></i> Download SVG
                  </button>
                </div>
                <div className="p-6 flex justify-center bg-white" dangerouslySetInnerHTML={{ __html: result.diagram_svg }} />
              </div>

              {/* Component List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Recommended Stack</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {result.components.map((comp, idx) => (
                    <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-900">{comp.name}</h4>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded uppercase ${
                          comp.build_or_buy === 'buy' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {comp.build_or_buy}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{comp.description}</p>
                      
                      {comp.examples && (
                        <div className="flex flex-wrap gap-2">
                          {comp.examples.map((ex, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200">
                              {ex}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
