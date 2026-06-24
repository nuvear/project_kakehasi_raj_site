'use client';

import React from 'react';
import {
  Chart as ChartJS,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { MATURITY_DOMAINS, DOMAIN_COLORS } from '../../utils/constants';

ChartJS.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function MaturityRadar({ scores = {}, benchmarks = null }) {
  const domainScores = MATURITY_DOMAINS.map((domain) => scores[domain] || 0);
  const benchmarkScores = benchmarks
    ? MATURITY_DOMAINS.map((domain) => benchmarks[domain] || 0)
    : null;

  const chartData = {
    labels: MATURITY_DOMAINS,
    datasets: [
      {
        label: 'Your Score',
        data: domainScores,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 6,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        tension: 0.3,
        fill: true,
      },
      ...(benchmarkScores
        ? [
            {
              label: 'Industry Average',
              data: benchmarkScores,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 5,
              pointBackgroundColor: '#10b981',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              tension: 0.3,
              fill: false,
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: { size: 12 },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 6,
        callbacks: {
          label(context) {
            return `${context.dataset.label}: ${context.parsed.r}/5`;
          },
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          font: { size: 11 },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: { size: 12, weight: 'bold' },
          padding: 10,
        },
      },
    },
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <Radar data={chartData} options={options} />
    </div>
  );
}
