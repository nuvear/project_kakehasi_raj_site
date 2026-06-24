import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getProjects, createProject, updateProject, deleteProject } from '../utils/api';
import { DEMO_COMPANY_ID, QUADRANT_COLORS, PROJECT_STATUSES } from '../utils/constants';

// Helper to map quadrant names to color keys
const getQuadrantColor = (quadrantName) => {
  const map = {
    'Quick Win': QUADRANT_COLORS.quickWin,
    'Big Bet': QUADRANT_COLORS.bigBet,
    'Fill-In': QUADRANT_COLORS.fillIn,
    'Deprioritize': QUADRANT_COLORS.deprioritize
  };
  return map[quadrantName] || '#9ca3af';
};

// Calculate quadrant based on scores
const calculateQuadrant = (impact, feasibility) => {
  if (impact >= 5 && feasibility >= 5) return 'Quick Win';
  if (impact >= 5 && feasibility < 5) return 'Big Bet';
  if (impact < 5 && feasibility >= 5) return 'Fill-In';
  return 'Deprioritize';
};

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Planned',
    impact_score: 5,
    feasibility_score: 5,
    estimated_roi: 0,
    implementation_cost: 0,
    timeline_months: 3
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects(DEMO_COMPANY_ID);
      setProjects(data);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description || '',
        status: project.status || 'Planned',
        impact_score: project.impact_score || 5,
        feasibility_score: project.feasibility_score || 5,
        estimated_roi: project.estimated_roi || 0,
        implementation_cost: project.implementation_cost || 0,
        timeline_months: project.timeline_months || 3
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        status: 'Planned',
        impact_score: 5,
        feasibility_score: 5,
        estimated_roi: 0,
        implementation_cost: 0,
        timeline_months: 3
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate derived fields
      const quadrant = calculateQuadrant(formData.impact_score, formData.feasibility_score);
      
      const payload = {
        ...formData,
        company_id: DEMO_COMPANY_ID,
        quadrant
      };

      if (editingProject) {
        await updateProject(editingProject.id, payload);
      } else {
        await createProject(payload);
      }
      
      handleCloseModal();
      fetchProjects();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Manager</h1>
          <p className="text-gray-600 mt-2">Optimize your AI investment strategy using the Impact-Feasibility matrix.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center"
        >
          <i className="fas fa-plus mr-2"></i> New Project
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualization Matrix */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[600px] flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Impact vs. Feasibility</h2>
            <div className="relative flex-grow border-l-2 border-b-2 border-gray-300 m-8">
              {/* Labels */}
              <div className="absolute -left-12 top-1/2 -rotate-90 text-sm font-semibold text-gray-500 tracking-wider">BUSINESS IMPACT</div>
              <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-500 tracking-wider">FEASIBILITY</div>

              {/* Quadrant Backgrounds */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-30 pointer-events-none">
                <div className="bg-amber-100 border-r border-b border-gray-200 flex items-center justify-center"><span className="text-amber-800 font-bold text-xl opacity-40">Big Bet</span></div>
                <div className="bg-emerald-100 border-b border-gray-200 flex items-center justify-center"><span className="text-emerald-800 font-bold text-xl opacity-40">Quick Win</span></div>
                <div className="bg-red-100 border-r border-gray-200 flex items-center justify-center"><span className="text-red-800 font-bold text-xl opacity-40">Deprioritize</span></div>
                <div className="bg-blue-100 flex items-center justify-center"><span className="text-blue-800 font-bold text-xl opacity-40">Fill-In</span></div>
              </div>

              {/* Project Dots */}
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${(project.feasibility_score / 10) * 100}%`,
                    top: `${100 - ((project.impact_score / 10) * 100)}%`,
                  }}
                  onClick={() => handleOpenModal(project)}
                >
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-md transition-all group-hover:scale-125"
                    style={{ backgroundColor: getQuadrantColor(project.quadrant) }}
                  ></div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-md py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <p className="font-bold truncate">{project.name}</p>
                    <p className="opacity-80">Imp: {project.impact_score} | Feas: {project.feasibility_score}</p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="lg:col-span-1 flex flex-col h-[600px]">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Projects ({projects.length})</h2>
            </div>
            <div className="overflow-y-auto flex-grow p-2 space-y-2">
              {loading ? (
                <p className="text-center text-gray-500 py-4">Loading projects...</p>
              ) : projects.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No projects found.</p>
              ) : (
                projects.map((project) => (
                  <div 
                    key={project.id} 
                    className="p-3 rounded-lg border border-gray-100 hover:border-sky-200 hover:bg-sky-50 transition-all cursor-pointer group relative"
                    onClick={() => handleOpenModal(project)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{project.name}</h3>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Project"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span 
                        className="px-2 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: getQuadrantColor(project.quadrant) }}
                      >
                        {project.quadrant}
                      </span>
                      <span className="text-gray-500">{project.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline (Months)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.timeline_months}
                    onChange={(e) => setFormData({...formData, timeline_months: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact Score <span className="text-sky-600 font-bold ml-1">{formData.impact_score}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.impact_score}
                    onChange={(e) => setFormData({...formData, impact_score: parseFloat(e.target.value)})}
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feasibility Score <span className="text-emerald-600 font-bold ml-1">{formData.feasibility_score}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.feasibility_score}
                    onChange={(e) => setFormData({...formData, feasibility_score: parseFloat(e.target.value)})}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Hard</span>
                    <span>Easy</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Est. ROI ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimated_roi}
                    onChange={(e) => setFormData({...formData, estimated_roi: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.implementation_cost}
                    onChange={(e) => setFormData({...formData, implementation_cost: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 shadow-sm transition-colors"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
