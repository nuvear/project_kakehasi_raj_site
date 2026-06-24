import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import Layout from '../components/Layout';
import KPICard from '../components/dashboard/KPICard';
import { getProjects, getMaturityResults } from '../utils/api';
import { DEMO_COMPANY_ID, QUADRANT_COLORS, PROJECT_STATUSES } from '../utils/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [maturityData, setMaturityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, maturityRes] = await Promise.all([
          getProjects(DEMO_COMPANY_ID),
          getMaturityResults(DEMO_COMPANY_ID),
        ]);
        setProjects(projectsRes);
        setMaturityData(maturityRes);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate KPI values
  const totalProjects = projects.length;
  const avgImpact = projects.length > 0
    ? (projects.reduce((sum, p) => sum + (p.impact_score || 0), 0) / projects.length).toFixed(2)
    : 0;
  const avgFeasibility = projects.length > 0
    ? (projects.reduce((sum, p) => sum + (p.feasibility_score || 0), 0) / projects.length).toFixed(2)
    : 0;
  const overallMaturity = maturityData?.overall_score?.toFixed(2) || 'N/A';

  // Prepare chart data for Projects by Status
  const statusCounts = {};
  PROJECT_STATUSES.forEach(status => {
    statusCounts[status] = projects.filter(p => p.status === status).length;
  });

  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Projects',
        data: Object.values(statusCounts),
        backgroundColor: [
          '#3b82f6', // blue
          '#10b981', // green
          '#f59e0b', // amber
          '#ef4444', // red
        ],
        borderRadius: 4,
      },
    ],
  };

  // Prepare chart data for Projects by Quadrant
  const quadrantCounts = {};
  const quadrants = ['Quick Win', 'Big Bet', 'Fill-In', 'Deprioritize'];
  quadrants.forEach(q => {
    quadrantCounts[q] = projects.filter(p => p.quadrant === q).length;
  });

  const quadrantChartData = {
    labels: quadrants,
    datasets: [
      {
        label: 'Projects',
        data: Object.values(quadrantCounts),
        backgroundColor: [
          QUADRANT_COLORS['quickWin'],
          QUADRANT_COLORS['bigBet'],
          QUADRANT_COLORS['fillIn'],
          QUADRANT_COLORS['deprioritize'],
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">AI Transformation Command Center</h1>
        <p className="text-gray-600 mt-2">Monitor and manage your AI transformation portfolio</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total Projects"
          value={totalProjects}
          subtitle="in portfolio"
          color="blue"
        />
        <KPICard
          title="Avg Impact Score"
          value={avgImpact}
          subtitle="out of 10"
          color="green"
        />
        <KPICard
          title="Avg Feasibility"
          value={avgFeasibility}
          subtitle="out of 10"
          color="purple"
        />
        <KPICard
          title="Overall Maturity"
          value={overallMaturity}
          subtitle="maturity level"
          color="indigo"
        />
      </div>

      {/* Portfolio Heatmap */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio Heatmap</h2>
        <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center" style={{ minHeight: '300px' }}>
          <div className="relative w-full h-64 border-l-2 border-b-2 border-gray-400">
            {/* Axis labels */}
            <div className="absolute -top-6 left-0 text-xs text-gray-600">Feasibility</div>
            <div className="absolute -left-12 top-1/2 text-xs text-gray-600 transform -rotate-90 origin-right">
              Impact
            </div>

            {/* Quadrant zones */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-amber-50 opacity-50 border-r border-b border-gray-300 flex items-center justify-center">
              <span className="text-xs font-semibold text-amber-700">Big Bet</span>
            </div>
            <div className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-green-50 opacity-50 border-b border-gray-300 flex items-center justify-center">
              <span className="text-xs font-semibold text-green-700">Quick Win</span>
            </div>
            <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-red-50 opacity-50 border-r border-gray-300 flex items-center justify-center">
              <span className="text-xs font-semibold text-red-700">Deprioritize</span>
            </div>
            <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-blue-50 opacity-50 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-700">Fill-In</span>
            </div>

            {/* Project dots */}
            {projects.map((project) => {
              const x = (project.feasibility_score / 10) * 100;
              const y = 100 - (project.impact_score / 10) * 100;
              const color = QUADRANT_COLORS[project.quadrant] || '#999';
              return (
                <div
                  key={project.id}
                  className="absolute rounded-full cursor-pointer hover:ring-2 hover:ring-offset-1 transition-all"
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: color,
                    left: `calc(${x}% - 8px)`,
                    top: `calc(${y}% - 8px)`,
                  }}
                  title={project.name}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Projects by Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Projects by Status</h2>
          <Bar data={statusChartData} options={barChartOptions} />
        </div>

        {/* Projects by Quadrant */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Projects by Quadrant</h2>
          <div className="flex justify-center">
            <div style={{ maxWidth: '300px', width: '100%' }}>
              <Doughnut data={quadrantChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Projects</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Quadrant</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Impact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Feasibility</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 10).map((project) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{project.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: QUADRANT_COLORS[project.quadrant] || '#999' }}
                    >
                      {project.quadrant}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(project.impact_score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{project.impact_score}/10</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(project.feasibility_score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{project.feasibility_score}/10</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
