import { useState } from 'react';

export default function ROICalculator({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    current_revenue: 1000000,
    current_cost: 500000,
    revenue_increase_pct: 15,
    cost_reduction_pct: 10,
    implementation_cost: 250000,
    timeline_months: 12,
    discount_rate: 0.1,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (name === 'discount_rate' ? parseFloat(value) : Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Revenue
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">$</span>
          <input
            type="number"
            name="current_revenue"
            value={formData.current_revenue}
            onChange={handleChange}
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{formatCurrency(formData.current_revenue)}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Cost
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">$</span>
          <input
            type="number"
            name="current_cost"
            value={formData.current_cost}
            onChange={handleChange}
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{formatCurrency(formData.current_cost)}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Revenue Increase %: {formData.revenue_increase_pct}%
        </label>
        <input
          type="range"
          name="revenue_increase_pct"
          min="0"
          max="50"
          value={formData.revenue_increase_pct}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cost Reduction %: {formData.cost_reduction_pct}%
        </label>
        <input
          type="range"
          name="cost_reduction_pct"
          min="0"
          max="50"
          value={formData.cost_reduction_pct}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Implementation Cost
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">$</span>
          <input
            type="number"
            name="implementation_cost"
            value={formData.implementation_cost}
            onChange={handleChange}
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{formatCurrency(formData.implementation_cost)}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timeline (months): {formData.timeline_months}
        </label>
        <input
          type="range"
          name="timeline_months"
          min="3"
          max="36"
          value={formData.timeline_months}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>3 months</span>
          <span>36 months</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Discount Rate: {(formData.discount_rate * 100).toFixed(1)}%
        </label>
        <input
          type="range"
          name="discount_rate"
          min="0.01"
          max="0.20"
          step="0.01"
          value={formData.discount_rate}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1%</span>
          <span>20%</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? 'Running Simulation...' : 'Run Simulation'}
      </button>
    </form>
  );
}
