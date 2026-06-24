import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ScenarioChart({ scenarios }) {
  const [activeMetric, setActiveMetric] = useState('roi_percentage');

  const getChartData = () => {
    const labels = ['Base', 'Optimistic (1.3x)', 'Pessimistic (0.7x)'];
    const colors = ['#3b82f6', '#10b981', '#ef4444'];

    let datasets = [];

    if (activeMetric === 'roi_percentage') {
      datasets = [
        {
          label: 'ROI %',
          data: [
            scenarios.base.roi_percentage,
            scenarios.optimistic.roi_percentage,
            scenarios.pessimistic.roi_percentage,
          ],
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        },
      ];
    } else if (activeMetric === 'npv') {
      datasets = [
        {
          label: 'NPV ($)',
          data: [scenarios.base.npv / 1000, scenarios.optimistic.npv / 1000, scenarios.pessimistic.npv / 1000],
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        },
      ];
    } else if (activeMetric === 'total_benefit') {
      datasets = [
        {
          label: 'Total Benefit ($)',
          data: [
            scenarios.base.total_benefit / 1000,
            scenarios.optimistic.total_benefit / 1000,
            scenarios.pessimistic.total_benefit / 1000,
          ],
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        },
      ];
    }

    return {
      labels,
      datasets,
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (activeMetric === 'roi_percentage') {
              return context.parsed.y.toFixed(1) + '%';
            }
            return '$' + context.parsed.y.toFixed(0) + 'K';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (activeMetric === 'roi_percentage') {
              return value.toFixed(0) + '%';
            }
            return '$' + value.toFixed(0) + 'K';
          },
        },
      },
    },
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveMetric('roi_percentage')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeMetric === 'roi_percentage'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ROI %
        </button>
        <button
          onClick={() => setActiveMetric('npv')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeMetric === 'npv'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          NPV
        </button>
        <button
          onClick={() => setActiveMetric('total_benefit')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeMetric === 'total_benefit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Total Benefit
        </button>
      </div>

      <div style={{ height: '300px', position: 'relative' }}>
        <Bar data={getChartData()} options={options} />
      </div>
    </div>
  );
}
