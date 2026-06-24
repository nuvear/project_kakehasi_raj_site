import React, { useState } from 'react';
import Layout from '../components/Layout';
import { simulateROI } from '../utils/api';
import { DEMO_COMPANY_ID } from '../utils/constants';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ROI() {
  const [formData, setFormData] = useState({
    current_revenue: 10000000,
    current_cost: 8000000,
    revenue_increase_pct: 15,
    cost_reduction_pct: 10,
    implementation_cost: 500000,
    timeline_months: 12,
    discount_rate: 0.1,
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const payload = {
        company_id: DEMO_COMPANY_ID,
        ...formData,
      };
      
      const data = await simulateROI(payload);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  // Chart Data preparation
  const chartData = results ? {
    labels: ['Revenue Benefit', 'Cost Savings', 'Total Benefit', 'Net Benefit (NPV)'],
    datasets: [
      {
        label: 'Base Case',
        data: [
          results.base_case.revenue_benefit,
          results.base_case.cost_benefit,
          results.base_case.total_benefit,
          results.base_case.npv
        ],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Optimistic',
        data: [
          results.optimistic_scenario.revenue_benefit,
          results.optimistic_scenario.cost_benefit,
          results.optimistic_scenario.total_benefit,
          results.optimistic_scenario.npv
        ],
        backgroundColor: '#10b981',
      },
      {
        label: 'Pessimistic',
        data: [
          results.pessimistic_scenario.revenue_benefit,
          results.pessimistic_scenario.cost_benefit,
          results.pessimistic_scenario.total_benefit,
          results.pessimistic_scenario.npv
        ],
        backgroundColor: '#ef4444',
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Scenario Analysis Comparison',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value / 1000}k`,
        },
      },
    },
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ROI Simulator</h1>
        <p className="text-gray-600 mt-2">Project financial impact with advanced scenario modeling.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Parameters</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Revenue ($)</label>
                  <input
                    type="number"
                    name="current_revenue"
                    value={formData.current_revenue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Cost ($)</label>
                  <input
                    type="number"
                    name="current_cost"
                    value={formData.current_cost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rev Increase (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="revenue_increase_pct"
                    value={formData.revenue_increase_pct}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Reduction (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="cost_reduction_pct"
                    value={formData.cost_reduction_pct}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Implementation Cost ($)</label>
                <input
                  type="number"
                  name="implementation_cost"
                  value={formData.implementation_cost}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline (Months)</label>
                  <input
                    type="number"
                    name="timeline_months"
                    value={formData.timeline_months}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    name="discount_rate"
                    value={formData.discount_rate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i> Calculating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-calculator mr-2"></i> Simulate ROI
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          {!results && !loading && !error && (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center h-full flex flex-col items-center justify-center text-gray-500">
              <i className="fas fa-chart-pie text-4xl mb-4 text-gray-300"></i>
              <p className="text-lg">Enter financial parameters to simulate ROI.</p>
            </div>
          )}

          {results && (
            <>
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-emerald-500">
                  <p className="text-sm text-gray-500 font-medium uppercase">ROI</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{results.base_case.roi_percentage.toFixed(1)}%</p>
                  <p className="text-xs text-emerald-600 mt-1 font-medium">Base Case</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
                  <p className="text-sm text-gray-500 font-medium uppercase">Net Present Value</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(results.base_case.npv)}</p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">Base Case</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
                  <p className="text-sm text-gray-500 font-medium uppercase">Payback Period</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{results.base_case.payback_months.toFixed(1)}</p>
                  <p className="text-xs text-purple-600 mt-1 font-medium">Months</p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <Bar data={chartData} options={chartOptions} />
              </div>

              {/* Detailed Breakdown Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Scenario Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 text-gray-500 font-medium">Metric</th>
                        <th className="px-6 py-3 text-red-600 font-medium">Pessimistic</th>
                        <th className="px-6 py-3 text-blue-600 font-medium">Base Case</th>
                        <th className="px-6 py-3 text-emerald-600 font-medium">Optimistic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-6 py-3 font-medium text-gray-900">Net Benefit (NPV)</td>
                        <td className="px-6 py-3">{formatCurrency(results.pessimistic_scenario.npv)}</td>
                        <td className="px-6 py-3 font-bold">{formatCurrency(results.base_case.npv)}</td>
                        <td className="px-6 py-3">{formatCurrency(results.optimistic_scenario.npv)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3 font-medium text-gray-900">ROI</td>
                        <td className="px-6 py-3">{results.pessimistic_scenario.roi_percentage.toFixed(1)}%</td>
                        <td className="px-6 py-3 font-bold">{results.base_case.roi_percentage.toFixed(1)}%</td>
                        <td className="px-6 py-3">{results.optimistic_scenario.roi_percentage.toFixed(1)}%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3 font-medium text-gray-900">Payback (Months)</td>
                        <td className="px-6 py-3">{results.pessimistic_scenario.payback_months.toFixed(1)}</td>
                        <td className="px-6 py-3 font-bold">{results.base_case.payback_months.toFixed(1)}</td>
                        <td className="px-6 py-3">{results.optimistic_scenario.payback_months.toFixed(1)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3 font-medium text-gray-900">Total Benefit</td>
                        <td className="px-6 py-3">{formatCurrency(results.pessimistic_scenario.total_benefit)}</td>
                        <td className="px-6 py-3">{formatCurrency(results.base_case.total_benefit)}</td>
                        <td className="px-6 py-3">{formatCurrency(results.optimistic_scenario.total_benefit)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
