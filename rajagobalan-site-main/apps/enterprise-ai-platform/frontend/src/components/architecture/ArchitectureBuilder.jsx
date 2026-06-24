import { useState } from 'react';

export default function ArchitectureBuilder({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    project_name: 'AI Transform Initiative',
    architecture_type: 'Hybrid',
    include_monitoring: true,
    include_feature_store: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Name
        </label>
        <input
          type="text"
          name="project_name"
          value={formData.project_name}
          onChange={handleChange}
          placeholder="e.g., AI Transform Initiative"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Architecture Type
        </label>
        <div className="space-y-2">
          {['Batch', 'Real-Time', 'Hybrid'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="architecture_type"
                value={type}
                checked={formData.architecture_type === type}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="include_monitoring"
            checked={formData.include_monitoring}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
          />
          <span className="ml-3 text-sm text-gray-700">Include Monitoring</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="include_feature_store"
            checked={formData.include_feature_store}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
          />
          <span className="ml-3 text-sm text-gray-700">Include Feature Store</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? 'Generating...' : 'Generate Architecture'}
      </button>
    </form>
  );
}
